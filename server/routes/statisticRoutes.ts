import express from 'express';
import { handleGetStatistic } from 'server/controller/statisticController';
import { UserPermission, Feature, PermissionAction } from 'server/interfaces/userPermission';
import authMiddleware from 'server/middleware/authMiddleware';
import { verifyRole } from 'server/middleware/verifyUserRoleMiddleware';

export const statisticRoutes = express.Router();

statisticRoutes.get(
    '/',
    authMiddleware,
    verifyRole(new UserPermission(Feature.Statistic, [PermissionAction.Read])),
    handleGetStatistic
);
