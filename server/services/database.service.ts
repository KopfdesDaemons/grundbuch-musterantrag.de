import logger from "server/config/logger.config";
import mysql, { RowDataPacket } from 'mysql2/promise';
import { createRootUser } from "./user.service";
import { createGuestRole, actionsTableMapping } from "./user-role.service";

export const db = mysql.createPool({
    host: 'db',
    user: process.env["MYSQL_USER"],
    password: process.env["MYSQL_PASSWORD"],
    database: 'grundbuch-musterantrag'
});

export const initDatabase = async () => {
    try {
        const tables = [
            {
                name: 'uploads',
                columns: [
                    { name: 'uploadID', type: 'VARCHAR(255) NOT NULL PRIMARY KEY' },
                    { name: 'docxFile', type: 'BOOLEAN NOT NULL DEFAULT FALSE' },
                    { name: 'pdfFile', type: 'BOOLEAN NOT NULL DEFAULT FALSE' },
                    { name: 'filesDeleted', type: 'BOOLEAN NOT NULL DEFAULT FALSE' },
                    { name: 'uploadDate', type: 'DATETIME NOT NULL' },
                    { name: 'antragsart', type: 'VARCHAR(255)' },
                    { name: 'grundbuchamt', type: 'VARCHAR(255)' },
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
                name: 'statistic',
                columns: [
                    { name: 'antragsart', type: 'VARCHAR(255) PRIMARY KEY' },
                    { name: 'anzahl', type: 'INT DEFAULT 0' }
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
                    { name: 'description', type: 'VARCHAR(255)' },
                ]
            },
            {
                name: 'user_permissions',
                columns: [
                    { name: 'userPermissionID', type: 'INT NOT NULL PRIMARY KEY AUTO_INCREMENT' },
                    { name: 'userRoleID', type: 'INT' },
                    { name: 'feature', type: 'VARCHAR(255) NOT NULL' },
                ],
                links: [
                    { columnName: 'userRoleID', tableName: 'user_roles', foreignKey: 'userRoleID' }
                ]
            },
        ];

        for (const featureActionTable of Object.values(actionsTableMapping)) {
            const table = {
                name: featureActionTable,
                columns: [
                    { name: 'actionID', type: 'INT NOT NULL PRIMARY KEY AUTO_INCREMENT' },
                    { name: 'userPermissionID', type: 'INT' },
                    { name: 'action_name', type: 'VARCHAR(255) NOT NULL' },
                ],
                links: [
                    { columnName: 'userPermissionID', tableName: 'user_permissions', foreignKey: 'userPermissionID' }
                ]
            };
            tables.push(table);
        }

        for (const table of tables) {
            // Tabelle erstellen, falls sie nicht existiert
            const createTableSQL = `CREATE TABLE IF NOT EXISTS ${table.name} (
                ${table.columns.map(col => `${col.name} ${col.type}`).join(', ')}
                ${table.links ? ', ' + table.links.map(link =>
                `FOREIGN KEY (${link.columnName}) REFERENCES ${link.tableName}(${link.foreignKey}) ON DELETE CASCADE`
            ).join(', ') : ''}
            )`;
            await db.execute(createTableSQL);
            logger.info(`Tabelle "${table.name}" wurde erstellt bzw. überprüft.`);

            // Spalten überprüfen und bei Bedarf hinzufügen
            for (const column of table.columns) {
                const columnExistsSQL = `SELECT * 
                                        FROM INFORMATION_SCHEMA.COLUMNS 
                                        WHERE TABLE_NAME = '${table.name}' 
                                        AND COLUMN_NAME = '${column.name}'`;

                const [columnExists] = await db.execute<RowDataPacket[]>(columnExistsSQL);

                if (columnExists.length === 0) {
                    const addColumnSQL = `ALTER TABLE ${table.name} ADD ${column.name} ${column.type}`;
                    await db.execute(addColumnSQL);
                    logger.info(`Spalte "${column.name}" in Tabelle "${table.name}" wurde hinzugefügt.`);
                }
            }

            if (table.deletedColumns) {
                for (const deletedColumn of table.deletedColumns) {
                    const columnExistsSQL = `SELECT * 
                                            FROM INFORMATION_SCHEMA.COLUMNS 
                                            WHERE TABLE_NAME = '${table.name}' 
                                            AND COLUMN_NAME = '${deletedColumn}'`;

                    const [columnExists] = await db.execute<RowDataPacket[]>(columnExistsSQL);

                    if (columnExists.length !== 0) {
                        const dropColumnSQL = `ALTER TABLE ${table.name} DROP COLUMN ${deletedColumn}`;
                        await db.execute(dropColumnSQL);
                        logger.info(`Spalte "${deletedColumn}" in Tabelle "${table.name}" wurde entfernt.`);
                    }
                }
            }
        }
        await createRootUser();
        await createGuestRole();
        logger.info("Datenbank und Tabellen wurden erfolgreich initialisiert bzw. überprüft.");
    } catch (error) {
        logger.error("Fehler bei der Initialisierung der Datenbank:", error);
    }
};