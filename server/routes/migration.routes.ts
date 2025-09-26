import express from 'express';
import {
  handleMigrateFromDocxToOdt,
  handleMigrateFromJSONFilesToDatabase,
  handleMigrationFromAntragToUploadinfo
} from 'server/controller/migration.controller';
import { MigrationAction } from 'common/interfaces/user-permission.interface';
import { authMiddleware } from 'server/middleware/auth.middleware';
import { verifyRole } from 'server/middleware/verify-user-role.middleware';
import { migrationPermission } from 'common/models/user-permissons.model';

export const migrationRoutes = express.Router();

migrationRoutes.post(
  '/fromAntragToUploadinfo',
  authMiddleware,
  verifyRole(new migrationPermission([MigrationAction.AntragToUploadinfoMigration])),
  handleMigrationFromAntragToUploadinfo
);

migrationRoutes.post(
  '/fromJSONToDatabase',
  authMiddleware,
  verifyRole(new migrationPermission([MigrationAction.JSONToDatabaseMigration])),
  handleMigrateFromJSONFilesToDatabase
);

migrationRoutes.post(
  '/fromDocxToOdt',
  authMiddleware,
  verifyRole(new migrationPermission([MigrationAction.DocxToOdtMigration])),
  handleMigrateFromDocxToOdt
);
