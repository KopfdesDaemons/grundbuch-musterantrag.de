import { Request, Response, NextFunction } from 'express';
import { UserPermission } from 'server/interfaces/userPermission';
import { getUserByUserID } from 'server/services/userService';
import { User } from 'server/models/user';
import logger from 'server/config/logger';

export const verifyRole = (userPermission: UserPermission) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userID = req.body.user.userID;
            const user: User | null = await getUserByUserID(userID);
            if (!user) {
                return res.status(401).json({ message: 'Fehler bei der Prüfung der Benutzerrolle: UserID ' + userID + ' nicht gefunden' });
            }
            const userHasPermission = user.checkPermission(userPermission);

            if (!userHasPermission) {
                return res.status(403).json({ message: 'Nicht genügend Rechte' });
            }
            return next();
        } catch (error) {
            logger.error('Fehler beim Auslesen der Benutzerrolle:', error);
            res.status(500).send('Interner Serverfehler');
        }
    };
};
