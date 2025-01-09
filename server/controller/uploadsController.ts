import { log } from 'console';
import { Request, Response } from 'express';
import path from 'path';
import { UPLOADS_FOLDER_PATH } from 'server/config/config';
import logger from 'server/config/logger';
import { Upload } from 'server/models/upload';
import { deleteFolderContent, deleteFolder, getFile } from 'server/services/directoryService';
import { changeStatistic, clearStatistic } from 'server/services/statisticService';
import { deleteAllGeneratedFiles, deleteAllUploads, deleteGeneratedFiles, deleteUpload, getUploadsData, readUpload } from 'server/services/uploadsService';

export const getUploads = async (req: Request, res: Response) => {
    const page = parseInt(req.query['page'] as string, 10) || 1;
    try {
        const files = await getUploadsData(page);
        res.json(files);
    } catch (error) {
        logger.error('Fehler beim Abrufen der Uploadsdaten:', error);
        res.status(500).send('Fehler beim Abrufen der Dateiliste');
    }
}

export const handleDeleteAllUploads = async (req: Request, res: Response) => {
    try {
        await deleteAllUploads();
        await clearStatistic();
        res.send('Alle Uploads gelöscht');
        logger.info('Alle Uploads gelöscht');
    } catch (error) {
        logger.error('Fehler beim Löschen aller Uploads:', error);
        res.status(500).send('Fehler beim Löschen aller Uploads');
    }
}

export const handleDeleteUpload = async (req: Request, res: Response) => {
    const uploadID = req.query['UploadID'] as string;
    if (!uploadID) return res.status(400).send('Fehlender Dateiname');

    // Aktualisiere die Statistik
    try {
        const antrag: Upload = await readUpload(uploadID);
        changeStatistic(antrag.antragsart, -1);
    } catch (error) {
        logger.error('Fehler beim Aktualisieren der Statistik:', error);
    }

    try {
        await deleteUpload(uploadID);
        return res.status(200).send('Datei gelöscht');
    } catch (error) {
        logger.error('Fehler beim Löschen des Uploads:', error);
        return res.status(500).send('Fehler beim Löschen des Uploads');
    }
}

export const getUpload = async (req: Request, res: Response) => {
    const fileNameWithExtension: string = req.query['fileName'] as string;

    if (!fileNameWithExtension) {
        res.status(400).send('Fehlender Dateiname');
        logger.error('Fehlender Dateiname beim Abrufen der Datei');
        return;
    }

    const fileWithoutExtension: string = fileNameWithExtension.split('.')[0];
    const folderPath: string = path.join(UPLOADS_FOLDER_PATH, fileWithoutExtension);

    try {
        const file = await getFile(folderPath, fileNameWithExtension);
        res.send(file);
    } catch (error) {
        logger.error('Fehler beim Abrufen der Datei:', error);
        res.status(500).send('Fehler beim Abrufen der Datei');
    }
}

export const handeleDeleteGeneratedFiles = async (req: Request, res: Response) => {
    const uploadID = req.query['uploadID'] as string;
    try {
        await deleteGeneratedFiles(uploadID);
        res.status(200).send('Generierte Dateien gelöscht');
    } catch (error) {
        logger.error('Fehler beim Löschen der generierten Dateien:', error);
        res.status(500).send('Fehler beim Löschen der generierten Dateien');
    }
}

export const handeleDeleteAllGeneratedFiles = async (req: Request, res: Response) => {
    try {
        await deleteAllGeneratedFiles();
        res.status(200).send('Alle generierte Dateien gelöscht');
    } catch (error) {
        logger.error('Fehler beim Löschen aller generierten Dateien:', error);
        res.status(500).send('Fehler beim Löschen aller generierten Dateien');
    }
}
