import { RowDataPacket } from 'mysql2/promise';
import { db } from './database.service';

export const updateFeedbackRating = async (rating: number, uploadID?: string): Promise<void> => {
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new Error('Ungültige Bewertung: Muss eine ganze Zahl zwischen 1 und 5 sein.');
  }

  if (uploadID) {
    await db.execute('UPDATE uploads SET rating = ? WHERE uploadID = ?', [rating, uploadID]);
  }
};

export const getFeedbackRating = async (uploadID?: string): Promise<number | null> => {
  if (uploadID) {
    const [rows] = await db.execute<RowDataPacket[]>('SELECT rating FROM uploads WHERE uploadID = ?', [uploadID]);
    if (rows.length === 0 || rows[0]['rating'] === null || rows[0]['rating'] === undefined) {
      return null;
    }
    return Number(rows[0]['rating']);
  }

  const [rows] = await db.execute<RowDataPacket[]>(
    'SELECT AVG(rating) AS avgRating FROM uploads WHERE rating IS NOT NULL AND finished = 1'
  );
  if (rows.length === 0 || rows[0]['avgRating'] === null || rows[0]['avgRating'] === undefined) {
    return null;
  }
  return Number(Number(rows[0]['avgRating']).toFixed(1));
};
