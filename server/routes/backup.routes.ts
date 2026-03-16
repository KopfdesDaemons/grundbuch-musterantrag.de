import { BackupAction } from 'common/interfaces/user-permission.interface';
import { BackupPermission } from 'common/models/user-permissions.model';
import express from 'express';
import {
  handelCreateNewBackup,
  handleDeleteBackup as handleDeleteBackups,
  handleDownloadBackup,
  handleGetBackupList,
  handleRestoreBackupByFileName,
  handleRestoreBackupByFileUpload
} from 'server/controller/backup.controller';
import { authMiddleware } from 'server/middleware/auth.middleware';
import { verifyRole } from 'server/middleware/verify-user-role.middleware';

export const backupRoutes = express.Router();

backupRoutes.get('/', authMiddleware, verifyRole(new BackupPermission([BackupAction.GetBackupList])), handleGetBackupList);
backupRoutes.post('/', authMiddleware, verifyRole(new BackupPermission([BackupAction.CreateBackup])), handelCreateNewBackup);
backupRoutes.post(
  '/restoreByFileUpload',
  authMiddleware,
  verifyRole(new BackupPermission([BackupAction.RestoreBackup])),
  handleRestoreBackupByFileUpload
);
backupRoutes.post(
  '/restoreByFileName',
  authMiddleware,
  verifyRole(new BackupPermission([BackupAction.RestoreBackup])),
  handleRestoreBackupByFileName
);
backupRoutes.delete('/', authMiddleware, verifyRole(new BackupPermission([BackupAction.DeleteBackup])), handleDeleteBackups);
backupRoutes.get('/backupFile', authMiddleware, verifyRole(new BackupPermission([BackupAction.DownloadBackup])), handleDownloadBackup);
