// src/controllers/authController.ts
import { Request, Response } from 'express';
import { authenticateUser, verifyToken } from '../services/authService';
import logger from 'server/config/logger';

export const login = async (req: Request, res: Response): Promise<any> => {
    const { username, password } = req.body;

    try {
        // Unvollständige Anmeldedaten
        if (!username || !password) {
            return res.status(401).json({ message: 'Anmeldedaten unvollständig' });
        }

        // Authentifizierung durch den Service
        const token = await authenticateUser(username, password);

        return res.json({ token });
    } catch (error: any) {
        logger.error(`Fehler bei der Anmeldung unter dem Usernamen ${username}:`, error);
        if (error.message === 'Ungültige Anmeldedaten') {
            return res.status(403).json({ message: 'Ungültige Anmeldedaten' });
        }
        return res.status(500).send('Serverfehler bei der Anmeldung');
    }
};

export const checkToken = async (req: Request, res: Response) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        // Unauthorized
        if (token == null) return res.sendStatus(401);


        await verifyToken(token);
        return res.status(200).send('Token gültig');
    } catch (error: any) {
        if (error.message === 'Token ungültig') {
            return res.sendStatus(403);
        }
        logger.error('Fehler bei der Prüfung des Tokens: ', error);
        return res.status(500).send('Interner Serverfehler');
    }
}
