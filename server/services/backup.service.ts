import { spawn } from 'child_process';
import { pipeline } from 'stream/promises';
import zlib from 'zlib';
import fs from 'fs';
import path from 'path';
import { PaginatedApiResponse } from 'common/interfaces/pagination-data.interface';
import { BACKUP_FOLDER_PATH } from 'server/config/path.config';
import { BackupFile } from 'common/interfaces/backup-file.interface';
import logger from 'server/config/logger.config';
import { CURRENT_DB_VERSION, db, getCurrentDbVersion, initDatabase } from './database.service';

const DB_HOST = 'db';
const DB_NAME = 'grundbuch-musterantrag';
const DB_USER = process.env['MYSQL_USER'];
const DB_PASSWORD = process.env['MYSQL_PASSWORD'];
const MAX_BACKUP_FILES = 30;

export class IncompatibleBackupVersionError extends Error {
  readonly backupVersion: number;
  readonly serverVersion: number;

  constructor(backupVersion: number, serverVersion: number) {
    super(
      `Das Backup stammt aus einer neueren Datenbank-Version (v${backupVersion}) als vom Server unterstützt (v${serverVersion}). Bitte aktualisieren Sie zuerst die Anwendung.`
    );
    this.name = 'IncompatibleBackupVersionError';
    this.backupVersion = backupVersion;
    this.serverVersion = serverVersion;
  }
}

export interface RestoreBackupResult {
  backupDbVersion: number;
  currentDbVersion: number;
  migrated: boolean;
}

export const parseDbVersionFromFileName = (fileName: string): number | null => {
  const match = fileName.match(/_v(\d+)\.(?:sql\.)?gz$/i);
  if (!match) return null;
  const parsed = parseInt(match[1], 10);
  return Number.isNaN(parsed) ? null : parsed;
};

/**
 * Ermittelt die Datenbank-Version eines Backups anhand des Dateiinhalts (.sql.gz)
 * bzw. des Dateinamens. Gibt 0 zurück, wenn es sich um ein Legacy-Backup ohne Version handelt.
 */
export const extractDbVersionFromBackupFile = async (backupFilePath: string): Promise<number> => {
  const versionFromName = parseDbVersionFromFileName(path.basename(backupFilePath));

  return new Promise<number>((resolve, reject) => {
    const readStream = fs.createReadStream(backupFilePath);
    const gunzip = zlib.createGunzip();
    const versionRegex = /\(\s*'dbVersion'\s*,\s*'(\d+)'\s*\)/;
    let tail = '';
    let foundVersion: number | null = null;

    const cleanup = () => {
      readStream.destroy();
      gunzip.destroy();
    };

    readStream.on('error', err => {
      cleanup();
      reject(err);
    });

    gunzip.on('error', err => {
      cleanup();
      reject(err);
    });

    gunzip.on('data', (chunk: Buffer) => {
      const text = tail + chunk.toString('utf8');
      const match = text.match(versionRegex);
      if (match) {
        const parsed = parseInt(match[1], 10);
        if (!Number.isNaN(parsed)) {
          foundVersion = parsed;
          cleanup();
          resolve(foundVersion);
          return;
        }
      }
      tail = text.slice(-128);
    });

    gunzip.on('close', () => {
      if (foundVersion !== null) {
        resolve(foundVersion);
      } else {
        resolve(versionFromName ?? 0);
      }
    });

    readStream.pipe(gunzip);
  });
};

export const createNewBackup = async () => {
  if (!DB_USER || !DB_PASSWORD) {
    throw new Error('Datenbank-Zugangsdaten (MYSQL_USER, MYSQL_PASSWORD) fehlen.');
  }

  const dbVersion = await getCurrentDbVersion();

  // Create filename with timestamp and database version
  const now = new Date();
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Berlin',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23'
  }).formatToParts(now);
  const getPart = (type: string) => parts.find(part => part.type === type)?.value;
  const timestamp = `${getPart('year')}-${getPart('month')}-${getPart('day')}T${getPart('hour')}-${getPart('minute')}-${getPart('second')}`;
  const backupFileName = `backup_${timestamp}_v${dbVersion}.sql.gz`;
  const backupFilePath = path.join(BACKUP_FOLDER_PATH, backupFileName);

  const dumpProcess = spawn(
    'mariadb-dump',
    ['--skip-ssl', '-h', DB_HOST, '-u', DB_USER, DB_NAME],
    {
      env: { ...process.env, MYSQL_PWD: DB_PASSWORD },
      stdio: ['ignore', 'pipe', 'pipe']
    }
  );

  let stderr = '';
  dumpProcess.stderr.on('data', chunk => {
    stderr += chunk.toString();
  });

  const exitPromise = new Promise<void>((resolve, reject) => {
    dumpProcess.on('error', reject);
    dumpProcess.on('close', (code, signal) => {
      if (code === 0 || signal === 'SIGTERM') {
        resolve();
      } else {
        reject(new Error(`mariadb-dump fehlgeschlagen mit Exit-Code ${code} (Signal: ${signal}):\n${stderr.trim()}`));
      }
    });
  });

  try {
    await Promise.all([
      pipeline(
        dumpProcess.stdout,
        zlib.createGzip({ level: 9 }),
        fs.createWriteStream(backupFilePath)
      ),
      exitPromise
    ]);
  } catch (error) {
    if (dumpProcess.exitCode === null && dumpProcess.signalCode === null) {
      dumpProcess.kill('SIGTERM');
    }
    if (fs.existsSync(backupFilePath)) {
      await fs.promises.unlink(backupFilePath);
    }
    await exitPromise;
    throw error;
  }

  await deleteOldBackups();
};

const isBackupFile = (file: string) => file.endsWith('.sql.gz') || file.endsWith('.gz');

const deleteOldBackups = async () => {
  const files = await fs.promises.readdir(BACKUP_FOLDER_PATH);
  const backupFiles = files.filter(isBackupFile);
  backupFiles.sort((a, b) => b.localeCompare(a));

  if (backupFiles.length > MAX_BACKUP_FILES) {
    const filesToDelete = backupFiles.slice(MAX_BACKUP_FILES);
    await deleteBackups(filesToDelete);
  }
};

export const restoreBackup = async (backupFilePath: string): Promise<RestoreBackupResult> => {
  if (!DB_USER || !DB_PASSWORD) {
    throw new Error('Datenbank-Zugangsdaten (MYSQL_USER, MYSQL_PASSWORD) fehlen.');
  }

  if (!backupFilePath.endsWith('.sql.gz') && !backupFilePath.endsWith('.gz')) {
    throw new Error('Nicht unterstütztes Backup-Dateiformat. Erwartet wird .sql.gz.');
  }

  // Prüfe die Datenbank-Version des Backups vor dem Einspielen
  const backupDbVersion = await extractDbVersionFromBackupFile(backupFilePath);
  if (backupDbVersion > CURRENT_DB_VERSION) {
    throw new IncompatibleBackupVersionError(backupDbVersion, CURRENT_DB_VERSION);
  }

  /*
   * Entferne vorab die aktuelle dbVersion-Markierung, damit Legacy-Backups (v0),
   * die keinen dbVersion-Eintrag in settings besitzen, sicher als v0 erkannt werden.
   */
  try {
    await db.execute(`DELETE FROM settings WHERE name = 'dbVersion'`);
  } catch {
    // Ignorieren, falls settings-Tabelle noch nicht existiert
  }

  const restoreProcess = spawn(
    'mariadb',
    ['--skip-ssl', '-h', DB_HOST, '-u', DB_USER, DB_NAME],
    {
      env: { ...process.env, MYSQL_PWD: DB_PASSWORD },
      stdio: ['pipe', 'ignore', 'pipe']
    }
  );

  let stderr = '';
  restoreProcess.stderr.on('data', chunk => {
    stderr += chunk.toString();
  });

  const exitPromise = new Promise<void>((resolve, reject) => {
    restoreProcess.on('error', reject);
    restoreProcess.on('close', (code, signal) => {
      if (code === 0 || signal === 'SIGTERM') {
        resolve();
      } else {
        reject(new Error(`mariadb-Restore fehlgeschlagen mit Exit-Code ${code} (Signal: ${signal}):\n${stderr.trim()}`));
      }
    });
  });

  try {
    await Promise.all([
      pipeline(
        fs.createReadStream(backupFilePath),
        zlib.createGunzip(),
        restoreProcess.stdin
      ),
      exitPromise
    ]);
  } catch (error) {
    if (restoreProcess.exitCode === null && restoreProcess.signalCode === null) {
      restoreProcess.kill('SIGTERM');
    }
    await exitPromise;
    throw error;
  }

  /*
   * Nach dem Einspielen des Backups Datenbank-Migrationen ausführen,
   * um ältere Backups automatisch auf CURRENT_DB_VERSION zu heben.
   */
  const versionAfterRestore = await getCurrentDbVersion();
  const migrated = versionAfterRestore < CURRENT_DB_VERSION;
  await initDatabase();

  return {
    backupDbVersion: versionAfterRestore,
    currentDbVersion: CURRENT_DB_VERSION,
    migrated
  };
};

export const getBackupList = async (page: number = 1): Promise<PaginatedApiResponse<BackupFile>> => {
  let backupFiles: string[] = [];

  await fs.promises.access(BACKUP_FOLDER_PATH);
  const files = await fs.promises.readdir(BACKUP_FOLDER_PATH);
  backupFiles = files.filter(isBackupFile);
  backupFiles.sort((a, b) => b.localeCompare(a));

  const pageSize = 10;
  if (page < 1) throw new Error('Die Seitennummer muss größer oder gleich 1 sein.');

  const totalItems = backupFiles.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const offset = (page - 1) * pageSize;

  const pageFiles = backupFiles.slice(offset, offset + pageSize);
  const items: BackupFile[] = [];

  for (const fileName of pageFiles) {
    const filePath = path.join(BACKUP_FOLDER_PATH, fileName);
    const stat = await fs.promises.stat(filePath);
    const dbVersion = parseDbVersionFromFileName(fileName) ?? 0;
    items.push({
      fileName,
      sizeInBytes: stat.size,
      dbVersion,
      currentServerDbVersion: CURRENT_DB_VERSION
    });
  }

  return {
    page,
    totalPages,
    totalItems,
    items
  };
};

export const deleteBackups = async (fileNames: string[]) => {
  for (const fileName of fileNames) {
    const filePath = path.join(BACKUP_FOLDER_PATH, fileName);
    await fs.promises.access(filePath);
    await fs.promises.unlink(filePath);
  }
};

let isCronJobInitialized = false;

export const initBackupCronJob = () => {
  if (isCronJobInitialized) return;
  isCronJobInitialized = true;

  logger.info('Tägliches automatisches Backup eingeplant für 03:00 Uhr (Europe/Berlin).');

  let lastRunDate: string | null = null;

  const checkAndRunBackup = async () => {
    const now = new Date();

    const hour = parseInt(new Intl.DateTimeFormat('en-US', { timeZone: 'Europe/Berlin', hour: 'numeric', hour12: false }).format(now), 10);
    const minute = parseInt(new Intl.DateTimeFormat('en-US', { timeZone: 'Europe/Berlin', minute: 'numeric' }).format(now), 10);
    const dateString = new Intl.DateTimeFormat('en-US', { timeZone: 'Europe/Berlin', year: 'numeric', month: 'numeric', day: 'numeric' }).format(now);

    if (hour === 3 && minute === 0 && lastRunDate !== dateString) {
      lastRunDate = dateString;
      logger.info('Starte tägliches automatisches Backup (Cronjob)...');
      try {
        await createNewBackup();
        logger.info('Tägliches automatisches Backup erfolgreich abgeschlossen.');
      } catch (error) {
        logger.error('Fehler beim Erstellen des automatischen Backups:', error);
      }
    }
  };

  // Start check every 60 seconds
  setInterval(checkAndRunBackup, 60000);
};
