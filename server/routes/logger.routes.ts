import express from 'express';
import { deleteLogFile, getLogFile } from 'server/controller/logger.controller';
import { LoggerAction } from 'server/interfaces/user-permission.interface';
import { authMiddleware } from 'server/middleware/auth.middleware';
import { verifyRole } from 'server/middleware/verify-user-role.middleware';
import { loggerPermission } from 'server/models/user-permissons.model';

export const loggerRoutes = express.Router();

loggerRoutes.delete('/', authMiddleware, verifyRole(new loggerPermission([LoggerAction.ClearLogFile])), deleteLogFile);
loggerRoutes.get('/', authMiddleware, verifyRole(new loggerPermission([LoggerAction.ReadLogFile])), getLogFile);
