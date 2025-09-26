import { Statistic } from 'common/interfaces/statistic.interface';
import { db } from './database.service';
import { RowDataPacket } from 'mysql2/promise';

export const getStatistic = async (): Promise<Statistic> => {
  const statistic: Statistic = {};

  const readQuery = 'SELECT antragsart, anzahl FROM statistic';
  const [result] = await db.execute<RowDataPacket[]>(readQuery);

  result.forEach(row => {
    statistic[row['antragsart']] = row['anzahl'];
  });

  return statistic;
};

export const updateStatistic = async (antragsart: string, numberOfDifferences: number): Promise<void> => {
  const [exists] = await db.execute<RowDataPacket[]>('SELECT antragsart, anzahl FROM statistic WHERE antragsart = ?', [antragsart]);

  if (exists.length > 0) {
    // Statistik aktualisieren
    const currentCount = exists[0]['anzahl'] as number;
    const updateQuery = `UPDATE statistic SET anzahl = ? WHERE antragsart = ?`;
    await db.execute(updateQuery, [currentCount + numberOfDifferences, antragsart]);
  } else {
    // Statistik einfügen
    if (numberOfDifferences < 0) numberOfDifferences = 0;
    const insertQuery = `INSERT INTO statistic (antragsart, anzahl) VALUES (?, ?)`;
    await db.execute(insertQuery, [antragsart, numberOfDifferences]);
  }
};

export const clearStatistic = async (): Promise<void> => {
  await db.execute('DELETE FROM statistic');
};
