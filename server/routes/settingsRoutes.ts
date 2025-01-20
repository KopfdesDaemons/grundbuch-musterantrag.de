import express from 'express';
import { handleGetSettings, handleSaveSettings, handleGetPrimaryColor } from 'server/controller/settingsController';
import { SettingsAction } from 'server/interfaces/userPermission';
import authMiddleware from 'server/middleware/authMiddleware';
import { verifyRole } from 'server/middleware/verifyUserRoleMiddleware';
import { settingsPermission } from 'server/models/userPermissons';

export const settingsRoutes = express.Router();

settingsRoutes.get(
    '/',
    authMiddleware,
    verifyRole(
        new settingsPermission([SettingsAction.ReadSettings])
    ),
    handleGetSettings
);

settingsRoutes.put(
    '/',
    authMiddleware,
    verifyRole(
        new settingsPermission([SettingsAction.UpdateSettings])
    ),
    handleSaveSettings
);

settingsRoutes.get('/getPrimaryColor', handleGetPrimaryColor);
