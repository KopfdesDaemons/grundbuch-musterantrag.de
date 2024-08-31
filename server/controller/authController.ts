// src/controllers/authController.ts
import { Request, Response } from 'express';
import { authenticateUser } from '../services/authService';
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
        logger.error('Fehler bei der Anmeldung:', error);
        if (error.message === 'Invalid credentials') {
            return res.status(403).json({ message: 'Ungültige Anmeldedaten' });
        }
        return res.status(500).send('Serverfehler bei der Anmeldung');
    }
};
