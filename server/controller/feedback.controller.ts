import { Request, Response } from 'express';
import { getFeedbackRating, updateFeedbackRating } from 'server/services/feedback.service';
import logger from 'server/config/logger.config';

export const handleUpdateFeedbackRating = async (req: Request, res: Response) => {
  const { rating, uploadID } = req.body;
  const numericRating = Number(rating);

  if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
    return res.status(400).json({ message: 'Ungültige Bewertung: Muss eine ganze Zahl zwischen 1 und 5 sein.' });
  }

  try {
    await updateFeedbackRating(numericRating, uploadID);
    return res.status(200).json({ message: 'Bewertung erfolgreich gespeichert.' });
  } catch (error) {
    logger.error('Fehler beim Speichern der Bewertung:', error);
    return res.status(500).json({ message: 'Fehler beim Speichern der Bewertung.' });
  }
};

export const handleGetFeedbackRating = async (req: Request, res: Response) => {
  const uploadID = req.query['uploadID'] as string | undefined;
  try {
    const rating = await getFeedbackRating(uploadID);
    return res.status(200).json({ rating });
  } catch (error) {
    logger.error('Fehler beim Abrufen der Bewertung:', error);
    return res.status(500).json({ message: 'Fehler beim Abrufen der Bewertung.' });
  }
};

export { updateFeedbackRating, getFeedbackRating };
