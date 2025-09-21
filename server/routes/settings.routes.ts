import express from 'express';
import { handleGetSettings, handleSaveSettings, handleGetPrimaryColor } from 'server/controller/settings.controller';
import { SettingsAction } from 'server/interfaces/user-permission.interface';
import { authMiddleware } from 'server/middleware/auth.middleware';
import { verifyRole } from 'server/middleware/verify-user-role.middleware';
import { settingsPermission } from 'server/models/user-permissons.model';

export const settingsRoutes = express.Router();

settingsRoutes.get('/', authMiddleware, verifyRole(new settingsPermission([SettingsAction.ReadSettings])), handleGetSettings);
settingsRoutes.put('/', authMiddleware, verifyRole(new settingsPermission([SettingsAction.UpdateSettings])), handleSaveSettings);
settingsRoutes.get('/getPrimaryColor', handleGetPrimaryColor);
