// src/controllers/fileController.ts
import { Request, Response } from 'express';
import { deleteFolder, getFile, deleteFolderContent } from '../services/directoryService';
import logger from '../config/logger';
import { getUploadsData } from 'server/services/uploadsService';

export const handleGetFileList = async (req: Request, res: Response): Promise<void> => {
    const folderPath = req.query['folderPath'] as string;
    const page = parseInt(req.query['page'] as string, 10) || 1;

    try {
        const result = await getUploadsData(folderPath, page);
        res.send(result);
    } catch (error) {
        logger.error('Fehler beim Laden der Datei-Liste aus dem Ordner', error);
        res.status(500).send('Interner Serverfehler');
    }
};

export const handleDeleteFolder = async (req: Request, res: Response): Promise<void> => {
    const folderPath = req.query['folderPath'] as string;

    try {
        await deleteFolder(folderPath);
        res.status(200).send('Ordner gelöscht');
    } catch (error) {
        logger.error('Fehler beim Löschen des Ordners', error);
        res.status(500).send('Serverfehler beim Löschen des Ordners');
    }
};

export const handleGetFile = async (req: Request, res: Response): Promise<void> => {
    const folderPath = req.query['folderPath'] as string;
    const fileName = req.query['fileName'] as string;

    try {
        const file = await getFile(folderPath, fileName);
        res.send(file);
    } catch (error: any) {
        logger.error('Fehler beim Herunterladen der Datei', error);
        if (error.message === 'Datei nicht gefunden') {
            res.status(404).send('Datei nicht gefunden');
        } else {
            res.status(500).send('Fehler beim Herunterladen der Datei');
        }
    }
};

export const handleDeleteFolderContent = async (req: Request, res: Response): Promise<void> => {
    const folderPath = req.query['folderPath'] as string;

    try {
        await deleteFolderContent(folderPath);
        res.status(200).send('Alle Dateien und Unterordner gelöscht');
    } catch (error) {
        logger.error('Fehler beim Löschen der Dateien und Ordner', error);
        res.status(500).send('Fehler beim Löschen der Dateien und Ordner');
    }
};
