import { Request, Response } from 'express';
import { getStatistic } from 'server/services/statistic.service';
import logger from 'server/config/logger.config';
import { Statistic } from 'server/interfaces/statistic.interface';

export const handleGetStatistic = async (req: Request, res: Response) => {
  try {
    const statistic: Statistic = await getStatistic();
    return res.status(200).json(statistic);
  } catch (error) {
    logger.error('Fehler beim Abrufen der Statistik:', error);
    return res.status(500).json({ message: 'Fehler beim Abrufen der Statistik' });
  }
};
