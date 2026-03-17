import { exec } from 'child_process';
import util from 'util';
import fs from 'fs';
import path from 'path';
import { PaginatedApiResponse } from 'common/interfaces/pagination-data.interface';
import { BACKUP_FOLDER_PATH, STORAGE_FOLDER_PATH } from 'server/config/path.config';
import { BackupFile } from 'common/interfaces/backup-file.interface';
import PizZip from 'pizzip';
import logger from 'server/config/logger.config';

const EXEC_PROMISE = util.promisify(exec);
const DB_HOST = 'db';
const DB_NAME = 'grundbuch-musterantrag';
const DB_USER = process.env['MYSQL_USER'];
const DB_PASSWORD = process.env['MYSQL_PASSWORD'];
const MAX_BACKUP_FILES = 30;

export const createNewBackup = async () => {
  if (!DB_USER || !DB_PASSWORD) {
    throw new Error('Datenbank-Zugangsdaten (MYSQL_USER, MYSQL_PASSWORD) fehlen.');
  }

  // Create backup folder
  try {
    await fs.promises.access(BACKUP_FOLDER_PATH);
  } catch {
    await fs.promises.mkdir(BACKUP_FOLDER_PATH, { recursive: true });
  }

  // Create filename with timestamp
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const sqlFileName = `backup_${timestamp}.sql`;
  const zipFileName = `backup_${timestamp}.zip`;
  const sqlFilePath = path.join(BACKUP_FOLDER_PATH, sqlFileName);
  const zipFilePath = path.join(BACKUP_FOLDER_PATH, zipFileName);

  const dumpCommand = `mariadb-dump --skip-ssl -h ${DB_HOST} -u ${DB_USER} ${DB_NAME} > ${sqlFilePath}`;

  await EXEC_PROMISE(dumpCommand, { env: { ...process.env, MYSQL_PWD: DB_PASSWORD } });

  const sqlData = await fs.promises.readFile(sqlFilePath);
  const zip = new PizZip();
  zip.file(sqlFileName, sqlData);

  const zipBuffer = zip.generate({ type: 'nodebuffer', compression: 'DEFLATE' });
  await fs.promises.writeFile(zipFilePath, zipBuffer);
  await fs.promises.unlink(sqlFilePath);
  await deleteOldBackups();
};

const deleteOldBackups = async () => {
  const files = await fs.promises.readdir(BACKUP_FOLDER_PATH);
  const zipFiles = files.filter(file => file.endsWith('.zip'));
  zipFiles.sort((a, b) => b.localeCompare(a));

  if (zipFiles.length > MAX_BACKUP_FILES) {
    const filesToDelete = zipFiles.slice(MAX_BACKUP_FILES);
    await deleteBackups(filesToDelete);
  }
};

export const restoreBackup = async (zipFilePath: string) => {
  if (!DB_USER || !DB_PASSWORD) {
    throw new Error('Datenbank-Zugangsdaten (MYSQL_USER, MYSQL_PASSWORD) fehlen.');
  }

  const zipData = await fs.promises.readFile(zipFilePath);
  const zip = new PizZip(zipData);
  const sqlFiles = Object.keys(zip.files).filter(name => name.endsWith('.sql'));
  if (sqlFiles.length === 0) {
    throw new Error('Die ZIP-Datei enthält keine .sql-Datei.');
  }
  const sqlFileName = sqlFiles[0];
  const sqlBuffer = zip.file(sqlFileName)!.asNodeBuffer();
  const tempSqlPath = path.join(STORAGE_FOLDER_PATH, `temp_extract_${Date.now()}.sql`);
  await fs.promises.writeFile(tempSqlPath, sqlBuffer);

  try {
    const restoreCommand = `mariadb --skip-ssl -h ${DB_HOST} -u ${DB_USER} ${DB_NAME} < ${tempSqlPath}`;
    await EXEC_PROMISE(restoreCommand, { env: { ...process.env, MYSQL_PWD: DB_PASSWORD } });
  } finally {
    await fs.promises.unlink(tempSqlPath);
  }
};

export const getBackupList = async (page: number = 1): Promise<PaginatedApiResponse<BackupFile>> => {
  let backupFiles: string[] = [];

  await fs.promises.access(BACKUP_FOLDER_PATH);
  const files = await fs.promises.readdir(BACKUP_FOLDER_PATH);
  backupFiles = files.filter(file => file.endsWith('.zip'));
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

export const initBackupCronJob = () => {
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
