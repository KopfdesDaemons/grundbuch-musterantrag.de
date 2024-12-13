// src/services/logFileService.ts
import * as fs from 'fs';
import { LOG_FILE_PATH } from '../config/config';


export const clearLogFile = async (): Promise<void> => {
    await fs.promises.writeFile(LOG_FILE_PATH, '');
};

export const readLogFile = async (): Promise<any[]> => {
    const data = await fs.promises.readFile(LOG_FILE_PATH, 'utf8');

    if (data === '') {
        return [];
    }

    // Trenne die JSON-Zeilen und füge sie zu einem Array zusammen
    const logs = data.trim().split('\n').map(line => JSON.parse(line));
    return logs.reverse();
};
