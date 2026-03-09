import { Statistic } from 'common/interfaces/statistic.interface';
import { db } from './database.service';
import { RowDataPacket } from 'mysql2/promise';
import { getUploadDates } from './uploads.service';

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
  const datesArray: Date[] = await getUploadDates(options);

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
    const timeframe = options.timeframe;

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
    allDaysInTimeframe.push({ date: new Date(date), count: 0 });
  }

  // Update the count for each day based on the upload dates
  for (const date of datesArray) {
    const dateFromTimeframe = allDaysInTimeframe.find(
      day => day.date.toLocaleDateString('de-DE', { timeZone: 'Europe/Berlin' }) === date.toLocaleDateString('de-DE', { timeZone: 'Europe/Berlin' })
    );
    if (dateFromTimeframe) dateFromTimeframe.count++;
  }

  return allDaysInTimeframe;
};
