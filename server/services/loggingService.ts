// src/services/logFileService.ts
import * as fs from 'fs';
import * as path from 'path';
import { SERVER_DIST_FOLDER } from '../config/config';

const logFilePath = path.join(SERVER_DIST_FOLDER, 'logFile.log');

export const clearLogFile = async (): Promise<void> => {
    await fs.promises.writeFile(logFilePath, '');
};

export const readLogFile = async (): Promise<any[]> => {
    const data = await fs.promises.readFile(logFilePath, 'utf8');

    if (data === '') {
        return [];
    }

    // Trenne die JSON-Zeilen und füge sie zu einem Array zusammen
    const logs = data.trim().split('\n').map(line => JSON.parse(line));
    return logs.reverse();
};
