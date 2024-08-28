import { Request, Response } from 'express';
import path from 'path';
import { UPLOADS_FOLDER_PATH } from 'server/config/config';
import logger from 'server/config/logger';
import { deleteFolderContent, deleteFolder, getFile } from 'server/services/directoryService';
import { changeStatistic, clearStatistic } from 'server/services/statisticService';
import { getUploadsData, readUploadJSON } from 'server/services/uploadsService';
import { Antrag } from 'src/app/interfaces/antrag';

export const getUploads = async (req: Request, res: Response) => {
    const page = parseInt(req.query['page'] as string, 10) || 1;
    try {
        const files = await getUploadsData(UPLOADS_FOLDER_PATH, page);
        res.json(files);
    } catch (error) {
        logger.error('Fehler beim Abrufen der Uploadsdaten:', error);
        res.status(500).send('Fehler beim Abrufen der Dateiliste');
    }
}

export const deleteUploads = async (req: Request, res: Response) => {
    try {
        await deleteFolderContent(UPLOADS_FOLDER_PATH);
        await clearStatistic();
        res.send('Inhalt des Upload Ordners gelöscht');
    } catch (error) {
        logger.error('Fehler beim Löschen des Ordnerinhalts des Uploads-Ordners:', error);
        res.status(500).send('Fehler beim Löschen des Ordnerinhalts');
    }
}

export const deleteUpload = async (req: Request, res: Response) => {
    const fileName = req.query['fileName'] as string;
    if (!fileName) return res.status(400).send('Fehlender Dateiname');

    // Aktualisiere die Statistik
    try {
        const antrag: Antrag = await readUploadJSON(UPLOADS_FOLDER_PATH, fileName);
        changeStatistic(antrag.title, -1);
    } catch (error) {
        logger.error('Fehler beim Aktualisieren der Statistik:', error);
    }

    // Lösche Ordner sammt Ihnalt
    const folderPath = path.join(UPLOADS_FOLDER_PATH, fileName);
    try {
        await deleteFolder(folderPath);
    } catch (error) {
        logger.error('Fehler beim Löschen des Ordner:', error);
        return res.status(500).send('Fehler beim Löschen der Datei');
    }

    return res.status(200).send('Datei gelöscht');
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

