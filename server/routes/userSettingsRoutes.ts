import express from 'express';
import { handleGetOwnUserRoleName as handleGetOwnUserRole } from 'server/controller/userRolesController';
import { handleChangeOwnPassword, handleChangeOwnUsername, handleGetOwnUsername } from 'server/controller/userSettingsController';
import authMiddleware from 'server/middleware/authMiddleware';

export const userSettingsRoutes = express.Router();

userSettingsRoutes.patch('/username',
    authMiddleware,
    handleChangeOwnUsername
);

userSettingsRoutes.patch('/password',
    authMiddleware,
    handleChangeOwnPassword
);

userSettingsRoutes.get('/username',
    authMiddleware,
    handleGetOwnUsername
);

userSettingsRoutes.get('/userrole',
    authMiddleware,
    handleGetOwnUserRole
);