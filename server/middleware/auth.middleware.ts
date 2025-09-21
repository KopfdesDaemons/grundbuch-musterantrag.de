import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/auth.service';
import logger from '../config/logger.config';

export default async function authMiddleware(req: Request, res: Response, next: NextFunction): Promise<any> {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // Unauthorized
    if (token == null) return res.sendStatus(401);

    // Verifiziere das Token über den Service
    try {
      const jwtPayload = await verifyToken(token);
      req.jwtPayload = jwtPayload;
      return next();
    } catch {
      // Forbidden
      return res.sendStatus(403);
    }
  } catch (error) {
    logger.error('Fehler bei der Authentifizierung:', error);
    res.status(500).send({ message: 'Interner Serverfehler bei der Authentifizierung' });
  }
}
