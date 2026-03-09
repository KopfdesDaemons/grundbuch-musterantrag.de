import { Request, Response } from 'express';
import { getStatisticByType as getStatisticByType, getUploadCountPerDays } from 'server/services/statistic.service';
import { Statistic } from 'common/interfaces/statistic.interface';
import { isValidTimeFilterOption } from 'server/helpers/type-guards.helper';

export const handleGetTotalStatisticByType = async (req: Request, res: Response) => {
  const statistic: Statistic = await getStatisticByType();
  return res.status(200).json(statistic);
};

export const handleGetStatisticByTimeframe = async (req: Request, res: Response) => {
  const monthStr = req.query['month'] as string | undefined;
  const yearStr = req.query['year'] as string | undefined;

  const month = monthStr ? parseInt(monthStr, 10) : undefined;
  const year = yearStr ? parseInt(yearStr, 10) : undefined;

  if (!isValidTimeFilterOption({ month, year })) {
    return res.status(400).json({ message: 'Ungültige Filteroption. Monat und Jahr müssen beide angegeben werden.' });
  }

  const statistic: Statistic = await getStatisticByType(month, year);
  if (!statistic || Object.keys(statistic).length === 0) {
    return res.status(204).json({ message: 'Keine Statistik für den angegebenen Zeitraum gefunden.' });
  }
  return res.status(200).json(statistic);
};

export const handleGetUploadCountPerDay = async (req: Request, res: Response) => {
  const timeframe = req.query['timeframe'] as string | undefined;
  const monthStr = req.query['month'] as string | undefined;
  const yearStr = req.query['year'] as string | undefined;

  const month = monthStr ? parseInt(monthStr, 10) : undefined;
  const year = yearStr ? parseInt(yearStr, 10) : undefined;

  const options: { timeframe?: string; month?: number; year?: number } = {};
  if (timeframe) options.timeframe = timeframe;
  if (month) options.month = month;
  if (year) options.year = year;

  if (!isValidTimeFilterOption(options)) {
    return res.status(400).send({ message: 'Ungültiger Filteroptionen' });
  }

  const countPerDay = await getUploadCountPerDays(options);
  return res.status(200).json(countPerDay);
};
