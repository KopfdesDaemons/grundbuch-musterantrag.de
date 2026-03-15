import express from 'express';
import { handleReportDownloadByUser } from 'server/controller/submit-form.controller';
import {
  handleDeleteUpload,
  handleDeleteAllUploads,
  getUpload,
  getUploads,
  handeleDeleteAllGeneratedFiles,
  handeleDeleteGeneratedFiles
} from 'server/controller/uploads.controller';
import { UploadManagementAction } from 'common/interfaces/user-permission.interface';
import { authMiddleware } from 'server/middleware/auth.middleware';
import { verifyRole } from 'server/middleware/verify-user-role.middleware';
import { UploadManagementPermission } from 'common/models/user-permissions.model';

export const uploadsRoutes = express.Router();

uploadsRoutes.get('/', authMiddleware, verifyRole(new UploadManagementPermission([UploadManagementAction.ReadUploadData])), getUploads);

uploadsRoutes.delete(
  '/',
  authMiddleware,
  verifyRole(new UploadManagementPermission([UploadManagementAction.DeleteAllUploads])),
  handleDeleteAllUploads
);

uploadsRoutes.delete(
  '/deleteUpload',
  authMiddleware,
  verifyRole(new UploadManagementPermission([UploadManagementAction.DeleteUpload])),
  handleDeleteUpload
);

uploadsRoutes.delete(
  '/deleteGeneratedFiles',
  authMiddleware,
  verifyRole(new UploadManagementPermission([UploadManagementAction.DeleteGeneratedFiles])),
  handeleDeleteGeneratedFiles
);

uploadsRoutes.delete(
  '/deleteAllGeneratedFiles',
  authMiddleware,
  verifyRole(new UploadManagementPermission([UploadManagementAction.DeleteAllGeneratedFiles])),
  handeleDeleteAllGeneratedFiles
);

uploadsRoutes.get('/getFile', authMiddleware, verifyRole(new UploadManagementPermission([UploadManagementAction.GetFiles])), getUpload);

uploadsRoutes.put('/reportDownloadByUser', handleReportDownloadByUser);
