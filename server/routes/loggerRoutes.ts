import express from 'express';
import { deleteLogFile, getLogFile } from 'server/controller/loggerController';
import { UserPermission, Feature, PermissionAction } from 'server/interfaces/userPermission';
import authMiddleware from 'server/middleware/authMiddleware';
import { verifyRole } from 'server/middleware/verifyUserRoleMiddleware';

export const loggerRoutes = express.Router();

loggerRoutes.delete(
    '/',
    authMiddleware,
    verifyRole(new UserPermission(Feature.Logger, [PermissionAction.Delete])),
    deleteLogFile
);

loggerRoutes.get(
    '/',
    authMiddleware,
    verifyRole(new UserPermission(Feature.Logger, [PermissionAction.Read])),
    getLogFile
);
