import { Request, Response } from 'express';
import { getStatistic } from 'server/services/statistic.service';
import { Statistic } from 'common/interfaces/statistic.interface';

export const handleGetStatistic = async (req: Request, res: Response) => {
  const statistic: Statistic = await getStatistic();
  return res.status(200).json(statistic);
};
