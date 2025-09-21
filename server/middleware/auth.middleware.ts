import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/auth.service';
import { AuthError } from 'server/models/errors/auth-error.model';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) throw new AuthError('Unauthorized', 401);

  const jwtPayload = await verifyToken(token);
  req.jwtPayload = jwtPayload;
  return next();
};
