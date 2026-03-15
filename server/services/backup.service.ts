import { exec } from 'child_process';
import util from 'util';
import fs from 'fs';
import path from 'path';
import { STORAGE_FOLDER_PATH } from 'server/config/path.config';
import { PaginatedApiResponse } from 'common/interfaces/pagination-data.interface';

const execPromise = util.promisify(exec);
const dbHost = 'db';
const dbName = 'grundbuch-musterantrag';
const dbUser = process.env['MYSQL_USER'];
const dbPassword = process.env['MYSQL_PASSWORD'];
const backupDir = path.join(STORAGE_FOLDER_PATH, 'backups');

export const createNewBackup = async () => {
  if (!dbUser || !dbPassword) {
    throw new Error('Datenbank-Zugangsdaten (MYSQL_USER, MYSQL_PASSWORD) fehlen.');
  }

  // Create backup folder
  try {
    await fs.promises.access(backupDir);
  } catch {
    await fs.promises.mkdir(backupDir, { recursive: true });
  }

  // Create filename with timestamp
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFilePath = path.join(backupDir, `backup_${timestamp}.sql`);

  const dumpCommand = `mariadb-dump --skip-ssl -h ${dbHost} -u ${dbUser} ${dbName} > ${backupFilePath}`;

  await execPromise(dumpCommand, { env: { ...process.env, MYSQL_PWD: dbPassword } });
};

export const restoreBackup = async (sqlFilePath: string) => {
  if (!dbUser || !dbPassword) {
    throw new Error('Datenbank-Zugangsdaten (MYSQL_USER, MYSQL_PASSWORD) fehlen.');
  }

  const restoreCommand = `mariadb --skip-ssl -h ${dbHost} -u ${dbUser} ${dbName} < ${sqlFilePath}`;

  await execPromise(restoreCommand, { env: { ...process.env, MYSQL_PWD: dbPassword } });
};

export const getBackupList = async (page: number = 1): Promise<PaginatedApiResponse<string>> => {
  let backupFiles: string[] = [];

  try {
    await fs.promises.access(backupDir);
    const files = await fs.promises.readdir(backupDir);
    backupFiles = files.filter(file => file.endsWith('.sql'));
    backupFiles.sort((a, b) => b.localeCompare(a)); // Neueste Backups zuerst
  } catch {
    // Verzeichnis existiert nicht oder ist nicht lesbar, wir geben eine leere Liste zurück
  }

  const pageSize = 10;
  if (page < 1) throw new Error('Die Seitennummer muss größer oder gleich 1 sein.');

  const totalItems = backupFiles.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const offset = (page - 1) * pageSize;

  return {
    page,
    totalPages,
    totalItems,
    items: backupFiles.slice(offset, offset + pageSize)
  };
};
