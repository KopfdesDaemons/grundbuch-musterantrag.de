import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/authService';
import logger from '../config/logger';

export default async function authMiddleware(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        // Unauthorized
        if (token == null) return res.sendStatus(401);

        // Verifiziere das Token über den Service
        try {
            const user = await verifyToken(token);
            req.body.user = user;
            return next();
        } catch {
            // Forbidden
            return res.sendStatus(403);
        }
    } catch (error) {
        logger.error('Fehler bei der Authentifizierung:', error);
        res.status(500).send('Interner Serverfehler');
    }
};
