import path from 'path';

// Folder paths
export const STORAGE_FOLDER_PATH = path.join('/app/storage');
export const TEMPLATES_FOLDER_PATH = path.join('/templates');

// Storage folder paths
export const UPLOADS_FOLDER_PATH = path.join(STORAGE_FOLDER_PATH, 'uploads');
export const LOG_FILE_PATH = path.join(STORAGE_FOLDER_PATH, 'logFile.log');
