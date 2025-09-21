import { Request, Response, NextFunction } from 'express';
import { UserPermission } from 'server/interfaces/user-permission.interface';
import { getUserByUserID } from 'server/services/user.service';
import { User } from 'server/models/user.model';
import { AuthError } from 'server/models/errors/auth-error.model';

export const verifyRole = (userPermission: UserPermission) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { jwtPayload } = req;

    const { userID } = jwtPayload!;
    const user: User | null = await getUserByUserID(userID);
    if (!user) throw new AuthError('Benutzer nicht gefunden', 401);
    req.user = user;

    const userHasPermission = user.checkPermission(userPermission);
    if (!userHasPermission) throw new AuthError('Nicht genügend Rechte', 403);

    return next();
  };
};
