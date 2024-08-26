import express, { Request, Response } from 'express';
import path, { dirname } from 'path';
import { deleteFolder, deleteFolderContent, getFile, getFileList } from 'server/controller/directoryController';
import authMiddleware from 'server/middleware/authMiddleware';
import { fileURLToPath } from 'url';
const router = express.Router();


const SERVER_DIST_FOLDER = dirname(fileURLToPath(import.meta.url));
const UPLOADS_FOLDER_PATH: string = path.join(SERVER_DIST_FOLDER, '/uploads')

router.get('/api/uploads', authMiddleware, (req, res) => getFileList(req, res, UPLOADS_FOLDER_PATH));
router.delete('/api/uploads', authMiddleware, (req, res) => deleteFolderContent(req, res, UPLOADS_FOLDER_PATH));

router.delete('/api/uploads/deleteFiles', authMiddleware, (req: Request, res: Response) => {
    const fileName = req.query['fileName'] as string;
    if (!fileName) res.status(400).send('Fehlender Dateiname');
    const folderPath = path.join(UPLOADS_FOLDER_PATH, fileName);
    deleteFolder(req, res, folderPath);
});

router.get('/api/uploads/getFile', authMiddleware, (req: Request, res: Response) => {
    const fileNameWithExtension: string = req.query['fileName'] as string;

    if (!fileNameWithExtension) {
        res.status(400).send('Fehlender Dateiname');
        return;
    }

    const fileWithoutExtension: string = fileNameWithExtension.split('.')[0];
    const folderPath: string = path.join(UPLOADS_FOLDER_PATH, fileWithoutExtension);

    getFile(req, res, folderPath, fileNameWithExtension);
});


export default router;