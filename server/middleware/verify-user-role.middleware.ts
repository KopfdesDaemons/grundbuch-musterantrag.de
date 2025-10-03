import { Request, Response, NextFunction } from 'express';
import { UserPermission } from 'common/interfaces/user-permission.interface';
import { AuthError } from 'server/models/errors/auth-error.model';
import { checkPermission } from 'server/services/user-role.service';

export const verifyRole = (userPermission: UserPermission) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { jwtPayload } = req;
    const { userRoleID } = jwtPayload!;

    if (!userRoleID) throw new AuthError('UserRoleID nicht im JWT', 401);

    const userHasPermission = await checkPermission(userRoleID, userPermission);
    if (!userHasPermission) throw new AuthError('Nicht genügend Rechte', 403);

    return next();
  };
};
