import express from 'express';
import { handleGetSettings, handleSaveSettings, handleGetPrimaryColor } from 'server/controller/settingsController';
import { UserPermission, Feature, PermissionAction } from 'server/interfaces/userPermission';
import authMiddleware from 'server/middleware/authMiddleware';
import { verifyRole } from 'server/middleware/verifyUserRoleMiddleware';

export const settingsRoutes = express.Router();

settingsRoutes.get(
    '/',
    authMiddleware,
    verifyRole(new UserPermission(Feature.Settings, [PermissionAction.Read])),
    handleGetSettings
);

settingsRoutes.put(
    '/',
    authMiddleware,
    verifyRole(new UserPermission(Feature.Settings, [PermissionAction.Update])),
    handleSaveSettings
);

settingsRoutes.get('/getPrimaryColor', handleGetPrimaryColor);
