import express from 'express';
import { deleteUpload, deleteUploads, getUpload, getUploads, handeleDeleteAllGeneratedFiles, handeleDeleteGeneratedFiles } from 'server/controller/uploadsController';
import authMiddleware from 'server/middleware/authMiddleware';

const router = express.Router();

router.get('/api/uploads', authMiddleware, getUploads);
router.delete('/api/uploads', authMiddleware, deleteUploads);
router.delete('/api/uploads/deleteUpload', authMiddleware, deleteUpload);
router.delete('/api/uploads/deleteGeneratedFiles', authMiddleware, handeleDeleteGeneratedFiles);
router.delete('/api/uploads/deleteAllGeneratedFiles', authMiddleware, handeleDeleteAllGeneratedFiles);
router.get('/api/uploads/getFile', authMiddleware, getUpload);

export default router;
