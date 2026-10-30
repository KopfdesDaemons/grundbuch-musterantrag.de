/* eslint-disable no-unused-vars */
import logger from 'server/config/logger.config';
import mysql, { Pool, PoolConnection, RowDataPacket } from 'mysql2/promise';
import { createRootUser } from './user.service';
import { createGuestRole, actionsTableMapping, clearUserRoleCache } from './user-role.service';

export const CURRENT_DB_VERSION = 4;

export interface DatabaseMigration {
  version: number;
  description: string;
  up: (connection: PoolConnection) => Promise<void>;
}

const GLOBAL_DB_POOL_KEY = Symbol.for('grundbuch.dbPool');
const globalWithDb = globalThis as typeof globalThis & { [GLOBAL_DB_POOL_KEY]?: Pool };

export const db: Pool = (globalWithDb[GLOBAL_DB_POOL_KEY] ??= mysql.createPool({
  host: 'db',
  user: process.env['MYSQL_USER'],
  password: process.env['MYSQL_PASSWORD'],
  database: 'grundbuch-musterantrag',
  timezone: 'Z'
}));

interface TableDefinition {
  name: string;
  columns: { name: string; type: string }[];
  deletedColumns?: string[];
  links?: { columnName: string; tableName: string; foreignKey: string }[];
}

const getBaselineV1Tables = (): TableDefinition[] => {
  const tables: TableDefinition[] = [
    {
      name: 'uploads',
      columns: [
        { name: 'uploadID', type: 'VARCHAR(255) NOT NULL PRIMARY KEY' },
        { name: 'odtFile', type: 'BOOLEAN NOT NULL DEFAULT FALSE' },
        { name: 'pdfFile', type: 'BOOLEAN NOT NULL DEFAULT FALSE' },
        { name: 'filesDeleted', type: 'BOOLEAN NOT NULL DEFAULT FALSE' },
        { name: 'uploadDate', type: 'DATETIME NOT NULL' },
        { name: 'antragsart', type: 'VARCHAR(255)' },
        { name: 'grundbuchamt', type: 'VARCHAR(255)' },
        { name: 'pdfFileDownloadedByUser', type: 'BOOLEAN' },
        { name: 'odtFileDownloadedByUser', type: 'BOOLEAN' }
      ]
    },
    {
      name: 'settings',
      columns: [
        { name: 'name', type: 'VARCHAR(255) NOT NULL PRIMARY KEY' },
        { name: 'value', type: 'VARCHAR(255)' }
      ]
    },
    {
      name: 'users',
      columns: [
        { name: 'userID', type: 'INT NOT NULL PRIMARY KEY AUTO_INCREMENT' },
        { name: 'username', type: 'VARCHAR(255) NOT NULL UNIQUE' },
        { name: 'passwordHash', type: 'VARCHAR(255) NOT NULL' },
        { name: 'userRoleID', type: 'INT NOT NULL' },
        { name: 'isInitialPassword', type: 'BOOLEAN NOT NULL DEFAULT TRUE' }
      ],
      deletedColumns: ['userRole']
    },
    {
      name: 'user_roles',
      columns: [
        { name: 'userRoleID', type: 'INT NOT NULL PRIMARY KEY AUTO_INCREMENT' },
        { name: 'name', type: 'VARCHAR(255) NOT NULL' },
        { name: 'description', type: 'VARCHAR(255)' }
      ]
    },
    {
      name: 'user_permissions',
      columns: [
        { name: 'userPermissionID', type: 'INT NOT NULL PRIMARY KEY AUTO_INCREMENT' },
        { name: 'userRoleID', type: 'INT' },
        { name: 'feature', type: 'VARCHAR(255) NOT NULL' }
      ],
      links: [{ columnName: 'userRoleID', tableName: 'user_roles', foreignKey: 'userRoleID' }]
    },
    {
      name: 'refresh_tokens',
      columns: [
        { name: 'tokenID', type: 'INT NOT NULL PRIMARY KEY AUTO_INCREMENT' },
        { name: 'userID', type: 'INT NOT NULL' },
        { name: 'tokenHash', type: 'VARCHAR(255) NOT NULL' },
        { name: 'userAgent', type: 'VARCHAR(255)' },
        { name: 'ip', type: 'VARCHAR(255)' },
        { name: 'creationDate', type: 'DATETIME NOT NULL' },
        { name: 'expiryDate', type: 'DATETIME NOT NULL' },
        { name: 'isRevoked', type: 'BOOLEAN NOT NULL DEFAULT FALSE' }
      ],
      links: [{ columnName: 'userID', tableName: 'users', foreignKey: 'userID' }]
    },
    {
      name: 'schema_migrations',
      columns: [
        { name: 'version', type: 'INT NOT NULL PRIMARY KEY' },
        { name: 'description', type: 'VARCHAR(255) NOT NULL' },
        { name: 'appliedAt', type: 'DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP' }
      ]
    }
  ];

  for (const featureActionTable of Object.values(actionsTableMapping)) {
    tables.push({
      name: featureActionTable,
      columns: [
        { name: 'actionID', type: 'INT NOT NULL PRIMARY KEY AUTO_INCREMENT' },
        { name: 'userPermissionID', type: 'INT' },
        { name: 'action_name', type: 'VARCHAR(255) NOT NULL' }
      ],
      links: [{ columnName: 'userPermissionID', tableName: 'user_permissions', foreignKey: 'userPermissionID' }]
    });
  }

  return tables;
};

/**
 * Inkrementelle Datenbank-Migrationen.
 * Neue Schema- oder Datenänderungen werden hier als neue Version (z.B. version: 2) angehängt
 * und CURRENT_DB_VERSION entsprechend erhöht.
 */
const migrations: DatabaseMigration[] = [
  {
    version: 1,
    description: 'Initiales Basis-Schema und Bereinigung von Legacy-Spalten/-Tabellen',
    up: async (connection: PoolConnection) => {
      const tables = getBaselineV1Tables();
      const tablesToDelete = ['statistic'];

      for (const table of tables) {
        const createTableSQL = `CREATE TABLE IF NOT EXISTS ${table.name} (
          ${table.columns.map(col => `${col.name} ${col.type}`).join(', ')}
          ${table.links ? ', ' + table.links.map(link => `FOREIGN KEY (${link.columnName}) REFERENCES ${link.tableName}(${link.foreignKey}) ON DELETE CASCADE`).join(', ') : ''}
        )`;
        await connection.execute(createTableSQL);

        for (const column of table.columns) {
          const [columnExists] = await connection.execute<RowDataPacket[]>(
            `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
             WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
            [table.name, column.name]
          );

          if (columnExists.length === 0) {
            await connection.execute(`ALTER TABLE ${table.name} ADD ${column.name} ${column.type}`);
            logger.info(`Spalte "${column.name}" in Tabelle "${table.name}" wurde hinzugefügt.`);
          }
        }

        if (table.deletedColumns) {
          for (const deletedColumn of table.deletedColumns) {
            const [columnExists] = await connection.execute<RowDataPacket[]>(
              `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
               WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
              [table.name, deletedColumn]
            );

            if (columnExists.length !== 0) {
              await connection.execute(`ALTER TABLE ${table.name} DROP COLUMN ${deletedColumn}`);
              logger.info(`Spalte "${deletedColumn}" in Tabelle "${table.name}" wurde entfernt.`);
            }
          }
        }
      }

      for (const tableName of tablesToDelete) {
        const [rows] = await connection.execute<RowDataPacket[]>(
          `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES
           WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?`,
          [tableName]
        );

        if (rows.length > 0) {
          await connection.execute(`DROP TABLE ${tableName}`);
          logger.info(`Tabelle "${tableName}" wurde gelöscht.`);
        }
      }
    }
  },
  {
    version: 2,
    description: 'Spalte finished in uploads und Tabelle upload_section_times für Zeitmessung hinzufügen',
    up: async (connection: PoolConnection) => {
      const [finishedColumnExists] = await connection.execute<RowDataPacket[]>(
        `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'uploads' AND COLUMN_NAME = 'finished'`
      );

      if (finishedColumnExists.length === 0) {
        await connection.execute(`ALTER TABLE uploads ADD COLUMN finished BOOLEAN NOT NULL DEFAULT FALSE`);
        await connection.execute(`UPDATE uploads SET finished = TRUE`);
        logger.info('Spalte "finished" in Tabelle "uploads" wurde hinzugefügt.');
      }

      await connection.execute(`
        CREATE TABLE IF NOT EXISTS upload_section_times (
          sectionTimeID INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
          uploadID VARCHAR(255) NOT NULL,
          section VARCHAR(255) NOT NULL,
          stepOrder INT NOT NULL DEFAULT 0,
          loadedAt DATETIME(3) NULL,
          completedAt DATETIME(3) NULL,
          durationMs BIGINT NOT NULL DEFAULT 0,
          UNIQUE KEY unique_upload_section (uploadID, section),
          FOREIGN KEY (uploadID) REFERENCES uploads(uploadID) ON DELETE CASCADE
        )
      `);

      await connection.execute(`DELETE FROM upload_section_times WHERE uploadID NOT IN (SELECT uploadID FROM uploads)`);
      logger.info('Tabelle "upload_section_times" wurde initialisiert.');
    }
  },
  {
    version: 3,
    description: 'Spalte rating in uploads für Feedback-Bewertung hinzufügen',
    up: async (connection: PoolConnection) => {
      const [ratingColumnExists] = await connection.execute<RowDataPacket[]>(
        `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'uploads' AND COLUMN_NAME = 'rating'`
      );

      if (ratingColumnExists.length === 0) {
        await connection.execute(`ALTER TABLE uploads ADD COLUMN rating INT NULL DEFAULT NULL`);
        logger.info('Spalte "rating" in Tabelle "uploads" wurde hinzugefügt.');
      }
    }
  },
  {
    version: 4,
    description: 'Spalte feedbackText in uploads für optionales Text-Feedback hinzufügen',
    up: async (connection: PoolConnection) => {
      const [columnExists] = await connection.execute<RowDataPacket[]>(
        `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'uploads' AND COLUMN_NAME = 'feedbackText'`
      );

      if (columnExists.length === 0) {
        await connection.execute(`ALTER TABLE uploads ADD COLUMN feedbackText TEXT NULL DEFAULT NULL`);
        logger.info('Spalte "feedbackText" in Tabelle "uploads" wurde hinzugefügt.');
      }
    }
  }
];

/**
 * Liest die aktuell in der Datenbank gespeicherte Schema-Version aus.
 * Gibt 0 zurück, falls noch keine Versionierung existiert (neue DB oder Legacy-Backup).
 */
export const getCurrentDbVersion = async (): Promise<number> => {
  const [settingsTable] = await db.execute<RowDataPacket[]>(
    `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'settings'`
  );

  if (settingsTable.length === 0) {
    return 0;
  }

  const [rows] = await db.execute<RowDataPacket[]>(
    `SELECT value FROM settings WHERE name = 'dbVersion'`
  );

  if (rows.length === 0 || !rows[0]['value']) {
    return 0;
  }

  const parsed = parseInt(rows[0]['value'] as string, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const setDbVersion = async (connection: PoolConnection, version: number, description: string): Promise<void> => {
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version INT NOT NULL PRIMARY KEY,
      description VARCHAR(255) NOT NULL,
      appliedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Bereinige evtl. verbleibende höhere Einträge nach dem Einspielen eines älteren Backups
  await connection.execute(`DELETE FROM schema_migrations WHERE version > ?`, [version]);

  await connection.execute(
    `INSERT INTO schema_migrations (version, description, appliedAt)
     VALUES (?, ?, UTC_TIMESTAMP())
     ON DUPLICATE KEY UPDATE description = VALUES(description), appliedAt = VALUES(appliedAt)`,
    [version, description]
  );

  await connection.execute(
    `INSERT INTO settings (name, value)
     VALUES ('dbVersion', ?)
     ON DUPLICATE KEY UPDATE value = VALUES(value)`,
    [String(version)]
  );
};

export const initDatabase = async (): Promise<void> => {
  try {
    const currentVersion = await getCurrentDbVersion();

    if (currentVersion > CURRENT_DB_VERSION) {
      const msg = `Datenbank-Version (v${currentVersion}) ist neuer als die vom Server unterstützte Version (v${CURRENT_DB_VERSION}). Bitte aktualisieren Sie die Anwendung.`;
      logger.error(msg);
      throw new Error(msg);
    }

    if (currentVersion < CURRENT_DB_VERSION) {
      logger.info(`Datenbank-Update erforderlich: Migriere von Version v${currentVersion} auf v${CURRENT_DB_VERSION}...`);

      const pendingMigrations = migrations
        .filter(m => m.version > currentVersion && m.version <= CURRENT_DB_VERSION)
        .sort((a, b) => a.version - b.version);

      for (const migration of pendingMigrations) {
        const connection = await db.getConnection();
        try {
          await connection.beginTransaction();
          logger.info(`Führe Datenbank-Migration auf v${migration.version} aus (${migration.description})...`);
          await migration.up(connection);
          await setDbVersion(connection, migration.version, migration.description);
          await connection.commit();
          logger.info(`Datenbank-Migration auf v${migration.version} erfolgreich abgeschlossen.`);
        } catch (migrationError) {
          await connection.rollback();
          throw migrationError;
        } finally {
          connection.release();
        }
      }
    } else {
      logger.info(`Datenbank-Schema ist auf dem aktuellen Stand (Version v${CURRENT_DB_VERSION}).`);
    }

    clearUserRoleCache();
    await Promise.all([createRootUser(), createGuestRole()]);
    logger.info('Datenbank wurde erfolgreich initialisiert bzw. überprüft.');
  } catch (error) {
    logger.error('Fehler bei der Initialisierung der Datenbank:', error);
    throw error;
  }
};
