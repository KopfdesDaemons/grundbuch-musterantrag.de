import express from 'express';
import { handleDeleteUpload, handleDeleteAllUploads, getUpload, getUploads, handeleDeleteAllGeneratedFiles, handeleDeleteGeneratedFiles, handleGetUploadDates, handleGetUploadCountPerDay as handleGetUploadCountPerDays } from 'server/controller/uploadsController';
import { Feature, PermissionAction, UserPermission } from 'server/interfaces/userPermission';
import authMiddleware from 'server/middleware/authMiddleware';
import { verifyRole } from 'server/middleware/verifyUserRoleMiddleware';

export const uploadsRoutes = express.Router();

uploadsRoutes.get(
    '/',
    authMiddleware,
    verifyRole(
        new UserPermission(Feature.UploadManagement, [PermissionAction.Read])
    ),
    getUploads
);

uploadsRoutes.delete(
    '/',
    authMiddleware,
    verifyRole(
        new UserPermission(Feature.UploadManagement, [PermissionAction.Delete])
    ),
    handleDeleteAllUploads
);

uploadsRoutes.delete(
    '/deleteUpload',
    authMiddleware,
    verifyRole(
        new UserPermission(Feature.UploadManagement, [PermissionAction.Delete])
    ),
    handleDeleteUpload
);

uploadsRoutes.delete(
    '/deleteGeneratedFiles',
    authMiddleware,
    verifyRole(
        new UserPermission(Feature.UploadManagement, [PermissionAction.Delete])
    ),
    handeleDeleteGeneratedFiles
);

uploadsRoutes.delete(
    '/deleteAllGeneratedFiles',
    authMiddleware,
    verifyRole(
        new UserPermission(Feature.UploadManagement, [PermissionAction.Delete])
    ),
    handeleDeleteAllGeneratedFiles
);

uploadsRoutes.get(
    '/getFile',
    authMiddleware,
    verifyRole(
        new UserPermission(Feature.UploadManagement, [PermissionAction.Read])
    ),
    getUpload
);

uploadsRoutes.get(
    '/getUploadDates',
    authMiddleware,
    verifyRole(new UserPermission(Feature.Statistic, [PermissionAction.Read])),
    handleGetUploadDates
);

uploadsRoutes.get(
    '/getUploadCountPerDays',
    authMiddleware,
    verifyRole(new UserPermission(Feature.Statistic, [PermissionAction.Read])),
    handleGetUploadCountPerDays
);
