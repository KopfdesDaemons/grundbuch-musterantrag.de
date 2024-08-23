import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

// Middleware für Authentifizierung
export default async function authMiddleware(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        // Unauthorized
        if (token == null) return res.sendStatus(401);

        const secretKey: string | undefined = process.env['DASHBOARD_LOGIN_PASSWORD'];
        if (!secretKey) throw new Error('DASHBOARD_LOGIN_PASSWORD is not defined');

        jwt.verify(token, secretKey, (err: any, user: any) => {
            // Forbidden
            if (err) return res.sendStatus(403);

            // Authenticated
            req.body.user = user;
            return next();
        });
    } catch (error) {
        req.logger.error(`Fehler bei der Authentifizierung:`, error);
        res.status(500).send('Interner Serverfehler');
    }
};