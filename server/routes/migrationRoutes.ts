import express from 'express';
import { handleMigrateFromJSONFilesToDatabase, handleMigrationFromAntragToUploadinfo } from 'server/controller/migrationController';
import { MigrationAction } from 'server/interfaces/userPermission';
import authMiddleware from 'server/middleware/authMiddleware';
import { verifyRole } from 'server/middleware/verifyUserRoleMiddleware';
import { migrationPermission } from 'server/models/userPermissons';

export const migrationRoutes = express.Router();

migrationRoutes.post(
    '/fromAntragToUploadinfo',
    authMiddleware,
    verifyRole(
        new migrationPermission([MigrationAction.AntragToUploadinfoMigration])
    ),
    handleMigrationFromAntragToUploadinfo
);

migrationRoutes.post(
    '/fromJSONToDatabase',
    authMiddleware,
    verifyRole(
        new migrationPermission([MigrationAction.JSONToDatabaseMigration])
    ),
    handleMigrateFromJSONFilesToDatabase
);