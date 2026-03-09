import { Statistic } from 'common/interfaces/statistic.interface';
import { db } from './database.service';
import { RowDataPacket } from 'mysql2/promise';

/**
 * Fetches statistics, optionally filtered by month and year.
 * If no parameters are provided, it returns the total statistics.
 */
export const getStatisticByType = async (month?: number, year?: number): Promise<Statistic> => {
  const statistic: Statistic = {};
  const params: number[] = [];

  let query = 'SELECT antragsart, COUNT(*) as anzahl FROM uploads';

  // Add filter if both month and year are provided
  if (month !== undefined && year !== undefined) {
    query += ' WHERE MONTH(uploadDate) = ? AND YEAR(uploadDate) = ?';
    params.push(month, year);
  } else if (year !== undefined) {
    query += ' WHERE YEAR(uploadDate) = ?';
    params.push(year);
  }

  query += ' GROUP BY antragsart';

  const [result] = await db.execute<RowDataPacket[]>(query, params);

  result.forEach(row => {
    statistic[row['antragsart'] as string] = row['anzahl'] as number;
  });

  return statistic;
};

export const getUploadCountPerDays = async (options: {
  timeframe?: 'week' | 'month';
  month?: number;
  year?: number;
}): Promise<{ date: Date; count: number }[]> => {
  const { timeframe, month, year } = options;
  let timeCondition = '';
  const params: (string | number)[] = [];

  if (year !== undefined) {
    if (month === undefined) {
      timeCondition = 'YEAR(uploadDate) = ?';
      params.push(year);
    } else {
      timeCondition = 'MONTH(uploadDate) = ? AND YEAR(uploadDate) = ?';
      params.push(month, year);
    }
  } else if (timeframe) {
    timeCondition = timeframe === 'week' ? 'uploadDate >= NOW() - INTERVAL 7 DAY' : 'uploadDate >= NOW() - INTERVAL 1 MONTH';
  }

  const query = `SELECT DATE_FORMAT(uploadDate, '%Y-%m-%d') as dateStr, COUNT(*) as count FROM uploads WHERE ${timeCondition} GROUP BY dateStr`;
  const [rows] = await db.execute<RowDataPacket[]>(query, params);

  const counts = new Map<string, number>();
  rows.forEach(row => counts.set(row['dateStr'], row['count']));

  let startDate: Date;
  let endDate: Date;

  // Set start date and end date based on provided options
  if (options.year !== undefined) {
    // Complete year if month is not provided
    if (options.month === undefined) {
      startDate = new Date(options.year, 0, 1);
      endDate = new Date(options.year, 11, 31);
    } else {
      // Specific month and year
      startDate = new Date(options.year, options.month - 1, 1);
      endDate = new Date(options.year, options.month, 0);
    }
  } else {
    const startDateWeek = new Date(new Date().setDate(new Date().getDate() - 6));
    const startDateMonth = new Date(new Date().setMonth(new Date().getMonth() - 1));

    startDate = timeframe === 'week' ? startDateWeek : startDateMonth;
    const todayString = new Date().toLocaleDateString('us-US', { timeZone: 'Europe/Berlin' });
    endDate = new Date(todayString);
  }

  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);

  // Prepare an array with all days in the timeframe
  const allDaysInTimeframe: { date: Date; count: number }[] = [];

  // Add each day in the timeframe to the array
  for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
    const yearStr = date.getFullYear();
    const monthStr = String(date.getMonth() + 1).padStart(2, '0');
    const dayStr = String(date.getDate()).padStart(2, '0');
    const key = `${yearStr}-${monthStr}-${dayStr}`;
    allDaysInTimeframe.push({ date: new Date(date), count: counts.get(key) || 0 });
  }

  return allDaysInTimeframe;
};
