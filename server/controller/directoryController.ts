import { Request, Response } from 'express';
import { getFile, deleteFolderContent } from '../helpers/fileSystemHelper';
import logger from '../config/logger';


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
