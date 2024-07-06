import { promises as fsPromises } from 'fs';
import * as cookieController from '../controller/cookieController';
import { Request, Response, NextFunction } from 'express';
import { HASH_FILE_PATH } from '../controller/authController'
import * as directoryController from '../controller/directoryController'

// Middleware für Authentifizierung
export default async function authMiddleware(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
        // Prüfen ob Cookie-Header vorhanden ist
        if (!req.headers.cookie) {
            return res.status(401).send('Anmeldung erforderlich! Kein loginToken-Cookie gefunden');
        }

        // Prüfen ob die Hash-Datei existiert
        const hashFileExist = await directoryController.checkFileExists(HASH_FILE_PATH);
        if (!hashFileExist) {
            return res.status(401).send('Initiale Anmeldung erforderlich. Hash File nicht vorhanden.');
        }

        // Lese Hash File
        const data = await fsPromises.readFile(HASH_FILE_PATH, 'utf8');
        const json = JSON.parse(data);

        // Lese Cookie mit Token
        const tokenCookie = cookieController.getCookie('loginToken', req.headers.cookie);

        if (tokenCookie !== json.loginToken) {
            return res.status(401).send('LoginToken nicht korrekt. Neue Anmeldung erforderlich');
        }

        next();
    } catch (error) {
        req.logger.error(`Fehler bei der Authentifizierung:`, error);
        res.status(500).send('Interner Serverfehler');
    }
};
