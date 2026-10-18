import { spawn } from 'child_process';
import { pipeline } from 'stream/promises';
import zlib from 'zlib';
import fs from 'fs';
import path from 'path';
import { PaginatedApiResponse } from 'common/interfaces/pagination-data.interface';
import { BACKUP_FOLDER_PATH } from 'server/config/path.config';
import { BackupFile } from 'common/interfaces/backup-file.interface';
import logger from 'server/config/logger.config';

const DB_HOST = 'db';
const DB_NAME = 'grundbuch-musterantrag';
const DB_USER = process.env['MYSQL_USER'];
const DB_PASSWORD = process.env['MYSQL_PASSWORD'];
const MAX_BACKUP_FILES = 30;

export const createNewBackup = async () => {
  if (!DB_USER || !DB_PASSWORD) {
    throw new Error('Datenbank-Zugangsdaten (MYSQL_USER, MYSQL_PASSWORD) fehlen.');
  }

  // Create filename with timestamp
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
  const backupFileName = `backup_${timestamp}.sql.gz`;
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

export const restoreBackup = async (backupFilePath: string) => {
  if (!DB_USER || !DB_PASSWORD) {
    throw new Error('Datenbank-Zugangsdaten (MYSQL_USER, MYSQL_PASSWORD) fehlen.');
  }

  if (!backupFilePath.endsWith('.sql.gz') && !backupFilePath.endsWith('.gz')) {
    throw new Error('Nicht unterstütztes Backup-Dateiformat. Erwartet wird .sql.gz.');
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
    const stat = await fs.promises.stat(path.join(BACKUP_FOLDER_PATH, fileName));
    items.push({ fileName, sizeInBytes: stat.size });
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
