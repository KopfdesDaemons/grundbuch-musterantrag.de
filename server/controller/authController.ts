import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

export const login = async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;

    try {
        const secretKey: string | undefined = process.env['DASHBOARD_LOGIN_PASSWORD'];

        // Unvollständige Anmeldedaten
        if (!username || !password) {
            res.status(401).json({ message: 'Anmeldedaten unvollständig' });
        }

        // Ungültige Anmeldedaten
        if (username != 'rico' || password != secretKey) {
            res.status(403).json({ message: 'Ungültige Anmeldedaten' });
        }

        if (!secretKey) throw new Error('DASHBOARD_LOGIN_PASSWORD is not defined');

        // Erstelle ein Token mit einer Gültigkeit von 3 Wochen
        const token = jwt.sign({ username }, secretKey, { expiresIn: '21d' });

        res.json({ token });
    } catch (error) {
        req.logger.error('Fehler bei der Anmeldung', error);
        res.status(500).send('Serverfehler bei der Anmeldung');
    }
};
