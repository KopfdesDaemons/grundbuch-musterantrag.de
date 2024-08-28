// src/controllers/logFileController.ts
import { Request, Response } from 'express';
import { clearLogFile, readLogFile } from '../services/loggingService';
import logger from 'server/config/logger';

export const deleteLogFile = async (req: Request, res: Response) => {
    try {
        await clearLogFile();
        res.status(200).send('LogFile.log gelöscht.');
    } catch (error: any) {
        logger.error('Fehler beim Löschen der LogFile.log', error);
        res.status(500).send('Fehler beim Löschen der LogFile.log: ' + error.message);
    }
};

export const getLogFile = async (req: Request, res: Response) => {
    try {
        const logs = await readLogFile();

        if (logs.length === 0) {
            return res.status(204).send('Keine Serverlogs');
        }

        return res.status(200).json(logs);
    } catch (error: any) {
        logger.error('Fehler beim Lesen der LogFile.log', error);
        return res.status(500).send('Fehler beim Lesen der LogFile.log: ' + error.message);
    }
};
