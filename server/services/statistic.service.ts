import { Statistic, TimeTrackingSectionStatistic, TimeTrackingStatistic, TimeTrackingStatusFilter } from 'common/interfaces/statistic.interface';
import { db } from './database.service';
import { RowDataPacket } from 'mysql2/promise';

/**
 * Fetches statistics, optionally filtered by month and year.
 * If no parameters are provided, it returns the total statistics.
 */
export const getStatisticByType = async (month?: number, year?: number): Promise<Statistic> => {
  const statistic: Statistic = {};
  const params: number[] = [];

  let query = 'SELECT antragsart, COUNT(*) as anzahl FROM uploads WHERE finished = 1';

  // Add filter if both month and year are provided
  if (month !== undefined && year !== undefined) {
    query += ' AND MONTH(uploadDate) = ? AND YEAR(uploadDate) = ?';
    params.push(month, year);
  } else if (year !== undefined) {
    query += ' AND YEAR(uploadDate) = ?';
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

  const whereClause = timeCondition ? `finished = 1 AND (${timeCondition})` : 'finished = 1';
  const query = `SELECT DATE_FORMAT(uploadDate, '%Y-%m-%d') as dateStr, COUNT(*) as count FROM uploads WHERE ${whereClause} GROUP BY dateStr`;
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

export const getTimeTrackingStatistics = async (
  month?: number,
  year?: number,
  status: TimeTrackingStatusFilter = 'all'
): Promise<TimeTrackingStatistic[]> => {
  const params: number[] = [];
  const conditions: string[] = ["u.antragsart IS NOT NULL AND u.antragsart != ''", 'ust.durationMs > 0'];

  if (status === 'finished') {
    conditions.push('u.finished = 1');
  } else if (status === 'abandoned') {
    conditions.push('u.finished = 0');
  }

  if (month !== undefined && year !== undefined) {
    conditions.push('MONTH(u.uploadDate) = ? AND YEAR(u.uploadDate) = ?');
    params.push(month, year);
  } else if (year !== undefined) {
    conditions.push('YEAR(u.uploadDate) = ?');
    params.push(year);
  }

  const whereClause = conditions.join(' AND ');

  const totalsQuery = `
    SELECT
      antragsart,
      COUNT(*) AS count,
      ROUND(AVG(uploadTotalDurationMs)) AS avgTotalDurationMs
    FROM (
      SELECT
        u.uploadID,
        u.antragsart,
        SUM(ust.durationMs) AS uploadTotalDurationMs
      FROM uploads u
      INNER JOIN upload_section_times ust ON u.uploadID = ust.uploadID
      WHERE ${whereClause}
      GROUP BY u.uploadID, u.antragsart
    ) AS upload_totals
    GROUP BY antragsart
    ORDER BY count DESC, antragsart ASC
  `;

  const sectionsQuery = `
    SELECT
      u.antragsart,
      ust.section,
      MIN(ust.stepOrder) AS stepOrder,
      ROUND(AVG(ust.durationMs)) AS avgDurationMs
    FROM uploads u
    INNER JOIN upload_section_times ust ON u.uploadID = ust.uploadID
    WHERE ${whereClause}
    GROUP BY u.antragsart, ust.section
    ORDER BY u.antragsart ASC, stepOrder ASC, ust.section ASC
  `;

  const [[totalRows], [sectionRows]] = await Promise.all([
    db.execute<RowDataPacket[]>(totalsQuery, params),
    db.execute<RowDataPacket[]>(sectionsQuery, params)
  ]);

  const sectionsByAntragsart = new Map<string, TimeTrackingSectionStatistic[]>();
  for (const row of sectionRows) {
    const antragsart = row['antragsart'] as string;
    const list = sectionsByAntragsart.get(antragsart) ?? [];
    list.push({
      name: row['section'] as string,
      durationMs: Number(row['avgDurationMs'] || 0)
    });
    sectionsByAntragsart.set(antragsart, list);
  }

  return totalRows.map(row => {
    const antragsart = row['antragsart'] as string;
    return {
      antragsart,
      count: Number(row['count'] || 0),
      totalDurationMs: Number(row['avgTotalDurationMs'] || 0),
      sections: sectionsByAntragsart.get(antragsart) ?? []
    };
  });
};
