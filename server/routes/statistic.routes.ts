import express from 'express';
import {
  handleGetStatisticByTimeframe,
  handleGetTimeTrackingStatistics,
  handleGetTotalStatisticByType,
  handleGetUploadCountPerDay
} from 'server/controller/statistic.controller';
import { StatisticAction } from 'common/interfaces/user-permission.interface';
import { authMiddleware } from 'server/middleware/auth.middleware';
import { verifyRole } from 'server/middleware/verify-user-role.middleware';
import { StatisticPermission } from 'common/models/user-permissions.model';

export const statisticRoutes = express.Router();

statisticRoutes.get('/type', authMiddleware, verifyRole(new StatisticPermission([StatisticAction.ReadStatistic])), handleGetTotalStatisticByType);

statisticRoutes.get(
  '/typeByTimeframe',
  authMiddleware,
  verifyRole(new StatisticPermission([StatisticAction.ReadStatistic])),
  handleGetStatisticByTimeframe
);

statisticRoutes.get(
  '/numberPerDay',
  authMiddleware,
  verifyRole(new StatisticPermission([StatisticAction.ReadStatistic])),
  handleGetUploadCountPerDay
);

statisticRoutes.get(
  '/timeTracking',
  authMiddleware,
  verifyRole(new StatisticPermission([StatisticAction.ReadStatistic])),
  handleGetTimeTrackingStatistics
);
