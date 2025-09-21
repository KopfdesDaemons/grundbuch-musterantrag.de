import express from 'express';
import { handleGetOwnUserRoleName as handleGetOwnUserRole } from 'server/controller/user-roles.controller';
import { handleChangeOwnPassword, handleChangeOwnUsername, handleGetOwnUsername } from 'server/controller/user-settings.controller';
import { authMiddleware } from 'server/middleware/auth.middleware';

export const userSettingsRoutes = express.Router();

userSettingsRoutes.patch('/username', authMiddleware, handleChangeOwnUsername);
userSettingsRoutes.patch('/password', authMiddleware, handleChangeOwnPassword);
userSettingsRoutes.get('/username', authMiddleware, handleGetOwnUsername);
userSettingsRoutes.get('/userrole', authMiddleware, handleGetOwnUserRole);
