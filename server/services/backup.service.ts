import { exec } from 'child_process';
import util from 'util';
import fs from 'fs';
import path from 'path';
import { PaginatedApiResponse } from 'common/interfaces/pagination-data.interface';
import { BACKUP_FOLDER_PATH } from 'server/config/path.config';

const execPromise = util.promisify(exec);
const dbHost = 'db';
const dbName = 'grundbuch-musterantrag';
const dbUser = process.env['MYSQL_USER'];
const dbPassword = process.env['MYSQL_PASSWORD'];

export const createNewBackup = async () => {
  if (!dbUser || !dbPassword) {
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
  const backupFilePath = path.join(BACKUP_FOLDER_PATH, `backup_${timestamp}.sql`);

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

  await fs.promises.access(BACKUP_FOLDER_PATH);
  const files = await fs.promises.readdir(BACKUP_FOLDER_PATH);
  backupFiles = files.filter(file => file.endsWith('.sql'));
  backupFiles.sort((a, b) => b.localeCompare(a));

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

export const deleteBackups = async (fileNames: string[]) => {
  for (const fileName of fileNames) {
    const filePath = path.join(BACKUP_FOLDER_PATH, fileName);
    await fs.promises.access(filePath);
    await fs.promises.unlink(filePath);
  }
};
