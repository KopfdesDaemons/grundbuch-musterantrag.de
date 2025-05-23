import { Request, Response } from 'express';
import { login, verifyToken } from '../services/auth.service';
import logger from 'server/config/logger.config';
import { getUserByUsername } from 'server/services/user.service';
import { User } from 'server/models/user.model';

export const handleLogin = async (req: Request, res: Response): Promise<any> => {
    const { username, password } = req.body;

    try {
        // Unvollständige Anmeldedaten
        if (!username || !password) {
            return res.status(401).json({ message: 'Anmeldedaten unvollständig' });
        }

        const user: User | null = await getUserByUsername(username);
        if (!user) {
            throw new Error('Ungültige Anmeldedaten');
        }

        // Authentifizierung durch den Service
        const token = await login(user, password);

        if (user.isInitialPassword) {
            return res.status(401).json({ message: 'Passwortänderung erforderlich', userName: user.username });
        }

        return res.json({ token: token, username: user.username, userRoleName: user.userRole.name });
    } catch (error: any) {
        if (error.message === 'Ungültige Anmeldedaten') {
            logger.info(`Ungültiger Anmeldeversuch unter dem Usernamen ${username}`);
            return res.status(403).json({ message: 'Ungültige Anmeldedaten' });
        }
        logger.error(`Fehler bei der Anmeldung unter dem Usernamen ${username}:`, error);
        return res.status(500).send({ message: 'Interner Serverfehler' });
    }
};

export const checkToken = async (req: Request, res: Response) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        // Unauthorized
        if (token == null) return res.sendStatus(401).send({ message: 'Unauthorized' });


        await verifyToken(token);
        return res.status(200).send({ message: 'Authorized' });
    } catch (error: any) {
        if (error.message === 'Token ungültig') {
            return res.sendStatus(403);
        }
        logger.error('Fehler bei der Prüfung des Tokens: ', error);
        return res.status(500).send({ message: 'Interner Serverfehler' });
    }
}
