import { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const SERVER_DIST_FOLDER = path.dirname(fileURLToPath(import.meta.url));

export const deleteLogFile = async (req: Request, res: Response) => {
    try {
        await fs.promises.writeFile(path.join(SERVER_DIST_FOLDER, 'logFile.log'), '');
        res.status(200).send('LogFile.log gelöscht.');
    } catch (error: any) {
        req.logger.error('Fehler beim Löschen der LogFile.log', error);
        res.status(500).send('Fehler beim Löschen der LogFile.log: ' + error.message);
    }
};

export const getLogFile = async (req: Request, res: Response) => {
    try {
        const logFilePath = path.join(SERVER_DIST_FOLDER, 'logFile.log');
        const data = await fs.promises.readFile(logFilePath, 'utf8');

        if (data === '') {
            return res.status(204).send('Keine Serverlogs');
        }

        // Trenne die JSON-Zeilen und füge sie zu einem Array zusammen
        const logs = data.trim().split('\n').map(line => JSON.parse(line));

        return res.status(200).json(logs.reverse());
    } catch (error: any) {
        req.logger.error('Fehler beim Lesen der LogFile.log', error);
        return res.status(500).send('Fehler beim Lesen der LogFile.log: ' + error.message);
    }
};