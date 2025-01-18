import express from 'express';
import { handleDeleteUpload, handleDeleteAllUploads, getUpload, getUploads, handeleDeleteAllGeneratedFiles, handeleDeleteGeneratedFiles, handleGetUploadDates, handleGetUploadCountPerDay as handleGetUploadCountPerDays } from 'server/controller/uploadsController';
import { Feature, PermissionAction, UserPermission } from 'server/interfaces/userPermission';
import authMiddleware from 'server/middleware/authMiddleware';
import { verifyRole } from 'server/middleware/verifyUserRoleMiddleware';

const router = express.Router();

router.get(
    '/api/uploads',
    authMiddleware,
    verifyRole(
        new UserPermission(Feature.UploadManagement, [PermissionAction.Read])
    ),
    getUploads
);

router.delete(
    '/api/uploads',
    authMiddleware,
    verifyRole(
        new UserPermission(Feature.UploadManagement, [PermissionAction.Delete])
    ),
    handleDeleteAllUploads
);

router.delete(
    '/api/uploads/deleteUpload',
    authMiddleware,
    verifyRole(
        new UserPermission(Feature.UploadManagement, [PermissionAction.Delete])
    ),
    handleDeleteUpload
);

router.delete(
    '/api/uploads/deleteGeneratedFiles',
    authMiddleware,
    verifyRole(
        new UserPermission(Feature.UploadManagement, [PermissionAction.Delete])
    ),
    handeleDeleteGeneratedFiles
);

router.delete(
    '/api/uploads/deleteAllGeneratedFiles',
    authMiddleware,
    verifyRole(
        new UserPermission(Feature.UploadManagement, [PermissionAction.Delete])
    ),
    handeleDeleteAllGeneratedFiles
);

router.get(
    '/api/uploads/getFile',
    authMiddleware,
    verifyRole(
        new UserPermission(Feature.UploadManagement, [PermissionAction.Read])
    ),
    getUpload
);

router.get(
    '/api/uploads/getUploadDates',
    authMiddleware,
    verifyRole(new UserPermission(Feature.Statistic, [PermissionAction.Read])),
    handleGetUploadDates
);

router.get(
    '/api/uploads/getUploadCountPerDays',
    authMiddleware,
    verifyRole(new UserPermission(Feature.Statistic, [PermissionAction.Read])),
    handleGetUploadCountPerDays
);

export default router;
