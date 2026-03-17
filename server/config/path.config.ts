import path from 'path';
import fs from 'fs';

// Folder paths
export const TEMPLATES_FOLDER_PATH = path.join('/templates');
export const STORAGE_FOLDER_PATH = path.join('/app/storage');

// Storage folder paths
export const UPLOADS_FOLDER_PATH = path.join(STORAGE_FOLDER_PATH, 'uploads');
export const LOG_FILE_PATH = path.join(STORAGE_FOLDER_PATH, 'logFile.log');
export const BACKUP_FOLDER_PATH = path.join(STORAGE_FOLDER_PATH, 'backups');

export const createStorageFolders = async () => {
  const folders = [UPLOADS_FOLDER_PATH, BACKUP_FOLDER_PATH];
  for (const folder of folders) {
    try {
      await fs.promises.access(folder);
    } catch {
      await fs.promises.mkdir(folder, { recursive: true });
      console.log(`Ordner ${folder} wurde erstellt.`);
    }
  }
};
