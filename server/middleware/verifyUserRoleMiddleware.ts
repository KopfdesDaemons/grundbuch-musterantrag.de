import { Request, Response, NextFunction } from 'express';
import { UserPermission } from 'server/interfaces/userPermission';
import { getUser } from 'server/services/userService';
import { User } from 'server/models/user';

export const verifyRole = (userPermission: UserPermission) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const username = req.body.user.username;
        const user: User = getUser(username);
        const userHasPermission = user.checkPermission(userPermission);

        if (!userHasPermission) {
            return res.status(403).json({ message: 'Nicht genügend Rechte' });
        }
        return next();
    };
};
