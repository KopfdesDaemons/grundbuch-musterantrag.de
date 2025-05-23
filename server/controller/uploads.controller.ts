import { Request, Response } from 'express';
import path from 'path';
import { UPLOADS_FOLDER_PATH } from 'server/config/path.config';
import logger from 'server/config/logger.config';
import { Upload } from 'server/models/upload.model';
import { getFile } from 'server/helpers/file-system.helper';
import { updateStatistic, clearStatistic } from 'server/services/statistic.service';
import { deleteAllGeneratedFiles, deleteAllUploads, deleteGeneratedFiles, deleteUpload, getUploadCountPerDays, getUploadDates, getUploadsData, readUpload } from 'server/services/uploads.service';

export const getUploads = async (req: Request, res: Response) => {
    const page = parseInt(req.query['page'] as string, 10) || 1;
    try {
        const files = await getUploadsData(page);
        return res.json(files);
    } catch (error) {
        logger.error('Fehler beim Abrufen der Uploadsdaten:', error);
        return res.status(500).send({ message: 'Fehler beim Abrufen der Uploadsdaten' });
    }
}

export const handleDeleteAllUploads = async (req: Request, res: Response) => {
    try {
        await deleteAllUploads();
        await clearStatistic();
        logger.info('Alle Uploads gelöscht');
        return res.send('Alle Uploads gelöscht');
    } catch (error) {
        logger.error('Fehler beim Löschen aller Uploads:', error);
        return res.status(500).send({ message: 'Fehler beim Löschen aller Uploads' });
    }
}

export const handleDeleteUpload = async (req: Request, res: Response) => {
    const uploadID = req.query['uploadID'] as string;
    if (!uploadID) return res.status(400).send({ message: 'Fehlende UploadID' });

    // Aktualisiere die Statistik
    try {
        const antrag: Upload = await readUpload(uploadID);
        await updateStatistic(antrag.antragsart, -1);
    } catch (error) {
        logger.error('Fehler beim Aktualisieren der Statistik:', error);
    }

    try {
        await deleteUpload(uploadID);
        return res.status(200).send({ message: 'Upload gelöscht' });
    } catch (error) {
        logger.error('Fehler beim Löschen des Uploads:', error);
        return res.status(500).send({ message: 'Fehler beim Löschen des Uploads' });
    }
}

export const getUpload = async (req: Request, res: Response) => {
    const fileNameWithExtension: string = req.query['fileName'] as string;
    if (!fileNameWithExtension) return res.status(400).send({ message: 'Fehlender Dateiname' });

    if (!fileNameWithExtension) {
        logger.error('Fehlender Dateiname beim Abrufen der Datei');
        return res.status(400).send({ message: 'Fehlender Dateiname' });
    }

    const fileWithoutExtension: string = fileNameWithExtension.split('.')[0];
    const folderPath: string = path.join(UPLOADS_FOLDER_PATH, fileWithoutExtension);

    try {
        const file = await getFile(folderPath, fileNameWithExtension);
        return res.send(file);
    } catch (error) {
        logger.error('Fehler beim Abrufen der Datei:', error);
        return res.status(500).send({ message: 'Fehler beim Abrufen der Datei' });
    }
}

export const handeleDeleteGeneratedFiles = async (req: Request, res: Response) => {
    const uploadID = req.query['uploadID'] as string;
    if (!uploadID) return res.status(400).send({ message: 'Fehlende UploadID' });
    try {
        await deleteGeneratedFiles(uploadID);
        return res.status(200).send({ message: 'Generierte Dateien gelöscht' });
    } catch (error) {
        logger.error('Fehler beim Löschen der generierten Dateien:', error);
        return res.status(500).send({ message: 'Fehler beim Löschen der generierten Dateien' });
    }
}

export const handeleDeleteAllGeneratedFiles = async (req: Request, res: Response) => {
    try {
        await deleteAllGeneratedFiles();
        return res.status(200).send({ message: 'Alle generierten Dateien gelöscht' });
    } catch (error) {
        logger.error('Fehler beim Löschen aller generierten Dateien:', error);
        return res.status(500).send({ message: 'Fehler beim Löschen aller generierten Dateien' });
    }
}

export const handleGetUploadDates = async (req: Request, res: Response) => {
    const validTimespans = ['week', 'month'];
    const timeframe = req.query['timeframe'] as string;

    if (!validTimespans.includes(timeframe)) {
        return res.status(400).send({ message: 'Ungültiger Zeitspanne' });
    }
    try {
        const dates = await getUploadDates(timeframe as 'week' | 'month');
        return res.status(200).json(dates);
    } catch (error) {
        logger.error('Fehler beim Abrufen der Upload-Datumsliste:', error);
        return res.status(500).send({ message: 'Fehler beim Abrufen der Upload-Datumsliste' });
    }
}

export const handleGetUploadCountPerDay = async (req: Request, res: Response) => {
    const validTimespans = ['week', 'month'];
    const timeframe = req.query['timeframe'] as string;

    if (!validTimespans.includes(timeframe)) {
        return res.status(400).send({ message: 'Ungültiger Zeitspanne' });
    }

    try {
        const countPerDay = await getUploadCountPerDays(timeframe as 'week' | 'month');
        return res.status(200).json(countPerDay);
    } catch (error) {
        logger.error('Fehler beim Abrufen der Upload-Zahl pro Tag:', error);
        return res.status(500).send({ message: 'Fehler beim Abrufen der Upload-Zahl pro Tag' });
    }
}
