import express from 'express';
import { deleteLogFile, getLogFile } from 'server/controller/loggerController';
import { LoggerAction } from 'server/interfaces/userPermission';
import authMiddleware from 'server/middleware/authMiddleware';
import { verifyRole } from 'server/middleware/verifyUserRoleMiddleware';
import { loggerPermission } from 'server/models/userPermissons';

export const loggerRoutes = express.Router();

loggerRoutes.delete(
    '/',
    authMiddleware,
    verifyRole(new loggerPermission([LoggerAction.ClearLogFile])),
    deleteLogFile
);

loggerRoutes.get(
    '/',
    authMiddleware,
    verifyRole(new loggerPermission([LoggerAction.ReadLogFile])),
    getLogFile
);
