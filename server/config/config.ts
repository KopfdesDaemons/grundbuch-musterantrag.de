import path from 'path';
import { fileURLToPath } from 'url';
import logger from './logger';

// environment variables
export const JWT_SECRET: string = process.env['JWT_SECRET'] || '';
if (!JWT_SECRET) {
    console.warn('⚠️ JWT_SECRET ist nicht definiert');
    logger.info('JWT_SECRET ist nicht definiert');
}

export const DASHBOARD_ROOT_PASSWORD: string = process.env['DASHBOARD_ROOT_PASSWORD'] || '';
if (!DASHBOARD_ROOT_PASSWORD) {
    console.warn('⚠️ DASHBOARD_ROOT_PASSWORD ist nicht definiert');
    logger.info('DASHBOARD_ROOT_PASSWORD ist nicht definiert');
}

export const DASHBOARD_ROOT_USER: string = process.env['DASHBOARD_ROOT_USER'] || '';
if (!DASHBOARD_ROOT_USER) {
    console.warn('⚠️ DASHBOARD_ROOT_USER ist nicht definiert');
    logger.info('DASHBOARD_ROOT_USER ist nicht definiert');
}


// folder paths
export const SERVER_DIST_FOLDER = path.dirname(fileURLToPath(import.meta.url));
export const STORAGE_FOLDER_PATH = path.join('/app/storage');

// storage folder paths
export const UPLOADS_FOLDER_PATH = path.join(STORAGE_FOLDER_PATH, 'uploads');
export const STATISTIC_JSON_PATH = path.join(STORAGE_FOLDER_PATH, 'statistic.json');
export const SETTINGS_JSON_PATH = path.join(STORAGE_FOLDER_PATH, 'settings.json');
export const LOG_FILE_PATH = path.join(STORAGE_FOLDER_PATH, 'logFile.log');