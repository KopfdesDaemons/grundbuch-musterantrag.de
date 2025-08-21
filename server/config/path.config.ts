import path from 'path';
import { fileURLToPath } from 'url';

// folder paths
export const SERVER_DIST_FOLDER = path.dirname(fileURLToPath(import.meta.url));
export const STORAGE_FOLDER_PATH = path.join('/app/storage');
export const TEMPLATES_FOLDER_PATH = path.join('/templates');

// storage folder paths
export const UPLOADS_FOLDER_PATH = path.join(STORAGE_FOLDER_PATH, 'uploads');
export const LOG_FILE_PATH = path.join(STORAGE_FOLDER_PATH, 'logFile.log');
