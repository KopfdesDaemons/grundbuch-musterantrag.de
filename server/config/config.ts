import path from 'path';
import { fileURLToPath } from 'url';


export const SERVER_DIST_FOLDER = path.dirname(fileURLToPath(import.meta.url));
export const STORAGE_FOLDER_PATH = path.join(SERVER_DIST_FOLDER, '..', '..', 'storage');

// storage
export const UPLOADS_FOLDER_PATH = path.join(STORAGE_FOLDER_PATH, 'uploads');
export const STATISTIC_JSON_PATH = path.join(STORAGE_FOLDER_PATH, 'statistic.json');
export const SETTINGS_JSON_PATH = path.join(STORAGE_FOLDER_PATH, 'settings.json');
export const LOG_FILE_PATH = path.join(STORAGE_FOLDER_PATH, 'logFile.log');