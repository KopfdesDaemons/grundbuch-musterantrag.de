import { promises as fsPromises } from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import * as directoryController from './directoryController';
import { Request, Response } from 'express';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const SERVER_DIST_FOLDER = dirname(fileURLToPath(import.meta.url));
export const HASH_FILE_PATH = path.join(SERVER_DIST_FOLDER, 'hash.json');

// Funktion zur Erstellung eines Hashes
const createHash = (password: string): string => {
    const hash = crypto.createHash('sha256');
    hash.update(password);
    return hash.digest('hex');
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        // Empfange Passwort
        const receivedPassword = req.body.password;

        const fileExists = await directoryController.checkFileExists(HASH_FILE_PATH);
        if (!fileExists) {
            res.status(500).send('Init erforderlich');
            return;
        }

        // Lese JSON Datei
        const file = await fsPromises.readFile(HASH_FILE_PATH, 'utf8');
        const json = JSON.parse(file);

        // Erstelle Hash vom empfangenen Passwort
        const receivedPasswordHash = createHash(receivedPassword);

        // Überprüfe Hash aus JSON mit dem Passwort
        if (receivedPasswordHash === json.passwordHash) {
            // Setze Cookie mit LoginToken

            // Ablaufdatum in 2 Wochen (14 Tage)
            const expiryDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
            res.cookie('loginToken', json.loginToken, { expires: expiryDate });

            res.status(200).send('Login erfolgreich');
        } else {
            res.status(401).send('Falsches Passwort.');
        }
    } catch (error) {
        req.logger.error('Fehler bei der Authentifizierung', error);
        res.status(500).send('Fehler bei der Authentifizierung');
    }
};

export const createHashFile = async (req: Request, res: Response): Promise<void> => {
    try {
        const password = req.body.password;

        const fileExists = await directoryController.checkFileExists(HASH_FILE_PATH);
        if (fileExists) {
            res.status(500).send('Bereits initialisiert');
            return;
        }

        // Erstelle Hash vom empfangenen Passwort
        const passwordHash = createHash(password);

        // Generiere zufälligen Login-Token
        const loginToken = uuidv4();

        // Erstelle JSON-Objekt
        const hashObj = {
            passwordHash,
            loginToken,
        };

        // Schreibe JSON-Objekt in Datei
        await fsPromises.writeFile(HASH_FILE_PATH, JSON.stringify(hashObj));

        res.status(200).send('Init erfolgreich');
        req.logger.info('hash.json erstellt.');
    } catch (error) {
        req.logger.error('Fehler beim Erstellen der hash.json.', error);
        res.status(500).send('Fehler bei der Dateigenerierung');
    }
};
