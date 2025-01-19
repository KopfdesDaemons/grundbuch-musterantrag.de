import express from 'express';
import { handleMigrateFromJSONFilesToDatabase, handleMigrationFromAntragToUploadinfo } from 'server/controller/migrationController';
import { UserPermission, Feature, PermissionAction } from 'server/interfaces/userPermission';
import authMiddleware from 'server/middleware/authMiddleware';
import { verifyRole } from 'server/middleware/verifyUserRoleMiddleware';

export const migrationRoutes = express.Router();

migrationRoutes.post(
    '/fromAntragToUploadinfo',
    authMiddleware,
    verifyRole(
        new UserPermission(Feature.Migration, [
            PermissionAction.Create,
            PermissionAction.Read,
            PermissionAction.Update,
            PermissionAction.Delete,
        ])
    ),
    handleMigrationFromAntragToUploadinfo
);

migrationRoutes.post(
    '/fromJSONToDatabase',
    authMiddleware,
    verifyRole(
        new UserPermission(Feature.Migration, [
            PermissionAction.Create,
            PermissionAction.Read,
            PermissionAction.Update,
            PermissionAction.Delete,
        ])
    ),
    handleMigrateFromJSONFilesToDatabase
);