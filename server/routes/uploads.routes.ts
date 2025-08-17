import express from 'express';
import {
  handleDeleteUpload,
  handleDeleteAllUploads,
  getUpload,
  getUploads,
  handeleDeleteAllGeneratedFiles,
  handeleDeleteGeneratedFiles,
  handleGetUploadDates,
  handleGetUploadCountPerDay as handleGetUploadCountPerDays
} from 'server/controller/uploads.controller';
import { StatisticAction, UploadManagementAction } from 'server/interfaces/user-permission.interface';
import authMiddleware from 'server/middleware/auth.middleware';
import { verifyRole } from 'server/middleware/verify-user-role.middleware';
import { statisticPermission, uploadManagementPermission } from 'server/models/user-permissons.model';

export const uploadsRoutes = express.Router();

uploadsRoutes.get('/', authMiddleware, verifyRole(new uploadManagementPermission([UploadManagementAction.ReadUploadData])), getUploads);

uploadsRoutes.delete(
  '/',
  authMiddleware,
  verifyRole(new uploadManagementPermission([UploadManagementAction.DeleteAllUploads])),
  handleDeleteAllUploads
);

uploadsRoutes.delete(
  '/deleteUpload',
  authMiddleware,
  verifyRole(new uploadManagementPermission([UploadManagementAction.DeleteUpload])),
  handleDeleteUpload
);

uploadsRoutes.delete(
  '/deleteGeneratedFiles',
  authMiddleware,
  verifyRole(new uploadManagementPermission([UploadManagementAction.DeleteGeneratedFiles])),
  handeleDeleteGeneratedFiles
);

uploadsRoutes.delete(
  '/deleteAllGeneratedFiles',
  authMiddleware,
  verifyRole(new uploadManagementPermission([UploadManagementAction.DeleteAllGeneratedFiles])),
  handeleDeleteAllGeneratedFiles
);

uploadsRoutes.get('/getFile', authMiddleware, verifyRole(new uploadManagementPermission([UploadManagementAction.GetFiles])), getUpload);

uploadsRoutes.get('/getUploadDates', authMiddleware, verifyRole(new statisticPermission([StatisticAction.ReadStatistic])), handleGetUploadDates);

uploadsRoutes.get(
  '/getUploadCountPerDays',
  authMiddleware,
  verifyRole(new statisticPermission([StatisticAction.ReadStatistic])),
  handleGetUploadCountPerDays
);
