import express from 'express';
import { handleGetStatistic } from 'server/controller/statistic.controller';
import { StatisticAction } from 'server/interfaces/user-permission.interface';
import { authMiddleware } from 'server/middleware/auth.middleware';
import { verifyRole } from 'server/middleware/verify-user-role.middleware';
import { statisticPermission } from 'server/models/user-permissons.model';

export const statisticRoutes = express.Router();

statisticRoutes.get('/', authMiddleware, verifyRole(new statisticPermission([StatisticAction.ReadStatistic])), handleGetStatistic);
