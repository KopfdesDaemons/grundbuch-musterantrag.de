import express from 'express';
import { handleGetStatisticByTimeframe, handleGetTotalStatistic } from 'server/controller/statistic.controller';
import { StatisticAction } from 'common/interfaces/user-permission.interface';
import { authMiddleware } from 'server/middleware/auth.middleware';
import { verifyRole } from 'server/middleware/verify-user-role.middleware';
import { statisticPermission } from 'common/models/user-permissions.model';

export const statisticRoutes = express.Router();

statisticRoutes.get('/', authMiddleware, verifyRole(new statisticPermission([StatisticAction.ReadStatistic])), handleGetTotalStatistic);

statisticRoutes.get(
  '/byTimeframe',
  authMiddleware,
  verifyRole(new statisticPermission([StatisticAction.ReadStatistic])),
  handleGetStatisticByTimeframe
);
