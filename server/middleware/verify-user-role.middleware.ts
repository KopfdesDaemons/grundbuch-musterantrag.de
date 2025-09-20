import { Request, Response, NextFunction } from 'express';
import { UserPermission } from 'server/interfaces/user-permission.interface';
import { getUserByUserID } from 'server/services/user.service';
import { User } from 'server/models/user.model';
import logger from 'server/config/logger.config';

export const verifyRole = (userPermission: UserPermission) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { jwtPayload } = req.body;
      if (!jwtPayload) {
        return res.status(400).json({ message: 'Kein JWT in der Anfrage' });
      }
      const { userID } = jwtPayload;
      const user: User | null = await getUserByUserID(userID);
      req.body.user = user;
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
      res.status(500).send({ message: 'Interner Serverfehler beim Auslesen der Benutzerrolle zur Prüfung der Berechtigung' });
    }
  };
};
