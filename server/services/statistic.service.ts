import { Statistic } from 'common/interfaces/statistic.interface';
import { db } from './database.service';
import { RowDataPacket } from 'mysql2/promise';

/**
 * Fetches statistics, optionally filtered by month and year.
 * If no parameters are provided, it returns the total statistics.
 */
export const getStatistic = async (month?: number, year?: number): Promise<Statistic> => {
  const statistic: Statistic = {};
  const params: number[] = [];

  let query = 'SELECT antragsart, COUNT(*) as anzahl FROM uploads';

  // Add filter if both month and year are provided
  if (month !== undefined && year !== undefined) {
    query += ' WHERE MONTH(uploadDate) = ? AND YEAR(uploadDate) = ?';
    params.push(month, year);
  }

  query += ' GROUP BY antragsart';

  const [result] = await db.execute<RowDataPacket[]>(query, params);

  result.forEach(row => {
    statistic[row['antragsart'] as string] = row['anzahl'] as number;
  });

  return statistic;
};
