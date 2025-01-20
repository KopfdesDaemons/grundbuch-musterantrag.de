import express from 'express';
import { handleGetStatistic } from 'server/controller/statisticController';
import { StatisticAction } from 'server/interfaces/userPermission';
import authMiddleware from 'server/middleware/authMiddleware';
import { verifyRole } from 'server/middleware/verifyUserRoleMiddleware';
import { statisticPermission } from 'server/models/userPermissons';

export const statisticRoutes = express.Router();

statisticRoutes.get(
    '/',
    authMiddleware,
    verifyRole(
        new statisticPermission([StatisticAction.ReadStatistic])
    ),
    handleGetStatistic
);
