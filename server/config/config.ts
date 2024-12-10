// src/config.ts
import path from 'path';
import { fileURLToPath } from 'url';

const SERVER_DIST_FOLDER = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_FOLDER_PATH = path.join(SERVER_DIST_FOLDER, '/uploads');
const STATISTIC_JSON_PATH = path.join(SERVER_DIST_FOLDER, 'statistic.json');
const SETTINGS_JSON_PATH = path.join(SERVER_DIST_FOLDER, 'settings.json');

export { SERVER_DIST_FOLDER, UPLOADS_FOLDER_PATH, STATISTIC_JSON_PATH, SETTINGS_JSON_PATH };
