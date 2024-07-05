import { promises as fsPromises } from 'fs';
import * as path from 'path';
import * as cookieController from '../controller/cookieController';
import { Request, Response, NextFunction } from 'express';
import { fileURLToPath } from 'url';

const SERVER_DIST_FOLDER = path.dirname(fileURLToPath(import.meta.url));
const HASH_FILE_PATH = path.join(SERVER_DIST_FOLDER, 'hash.json');

// Middleware für Authentifizierung
export default async function authMiddleware(req: Request, res: Response, next: NextFunction): Promise<any> {
    if (!req.headers.cookie) {
        return res.status(401).send('Anmeldung erforderlich!');
    }

    try {
        // Lese JSON Datei
        const data = await fsPromises.readFile(HASH_FILE_PATH, 'utf8');
        const json = JSON.parse(data);

        // Lese Cookie mit Token
        const tokenCookie = cookieController.getCookie('loginToken', req.headers.cookie);

        if (tokenCookie !== json.loginToken) {
            return res.status(401).send('Anmeldung erforderlich!');
        }

        next();
    } catch (error) {
        req.logger.error(`Fehler beim Lesen von ${HASH_FILE_PATH}`, error);
        res.status(500).send('Interner Serverfehler');
    }
};
