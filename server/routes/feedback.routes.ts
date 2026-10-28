import { UploadManagementAction } from 'common/interfaces/user-permission.interface';
import { UploadManagementPermission } from 'common/models/user-permissions.model';
import express from 'express';
import {
  handleGetFeedbackRating,
  handleUpdateFeedbackRating,
  handleUpdateFeedbackText
} from 'server/controller/feedback.controller';
import { authMiddleware } from 'server/middleware/auth.middleware';
import { verifyRole } from 'server/middleware/verify-user-role.middleware';

export const feedbackRoutes = express.Router();

feedbackRoutes.get(
  '/rating',
  authMiddleware,
  verifyRole(new UploadManagementPermission([UploadManagementAction.ReadUploadData])),
  handleGetFeedbackRating
);

feedbackRoutes.post('/rating', handleUpdateFeedbackRating);
feedbackRoutes.post('/text', handleUpdateFeedbackText);
