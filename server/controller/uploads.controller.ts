import { Request, Response } from 'express';
import path from 'path';
import { UPLOADS_FOLDER_PATH } from 'server/config/path.config';
import logger from 'server/config/logger.config';
import { getFile } from 'server/helpers/file-system.helper';
import {
  deleteAllGeneratedFiles,
  deleteAllUploads,
  deleteGeneratedFiles,
  deleteUpload,
  getFeedbackEvaluation,
  getUploadsData
} from 'server/services/uploads.service';

export const getUploads = async (req: Request, res: Response) => {
  const page = parseInt(req.query['page'] as string, 10) || 1;
  const files = await getUploadsData(page);
  return res.json(files);
};

export const handleDeleteAllUploads = async (req: Request, res: Response) => {
  await deleteAllUploads();
  logger.info('Alle Uploads gelöscht');
  return res.send({ message: 'Alle Uploads gelöscht' });
};

export const handleDeleteUpload = async (req: Request, res: Response) => {
  const uploadIDs = req.query['uploadIDs'] as string;

  // Split the comma-separated string into an array
  const uploadIDsArray = uploadIDs.split(',').map(id => id.trim());

  if (!uploadIDsArray) {
    return res.status(400).send({ message: 'Unvollständige oder ungültige Anfrage, erwartet wird ein Array von IDs' });
  }

  await deleteUpload(uploadIDsArray);

  return res.status(200).send({ message: 'Upload gelöscht' });
};

export const getUpload = async (req: Request, res: Response) => {
  const fileNameWithExtension: string = req.query['fileName'] as string;
  if (!fileNameWithExtension) return res.status(400).send({ message: 'Fehlender Dateiname' });

  if (!fileNameWithExtension) {
    logger.error('Fehlender Dateiname beim Abrufen der Datei');
    return res.status(400).send({ message: 'Fehlender Dateiname' });
  }

  const fileWithoutExtension: string = fileNameWithExtension.split('.')[0];
  const folderPath: string = path.join(UPLOADS_FOLDER_PATH, fileWithoutExtension);

  const file = await getFile(folderPath, fileNameWithExtension);
  return res.send(file);
};

export const handeleDeleteGeneratedFiles = async (req: Request, res: Response) => {
  const uploadID = req.query['uploadID'] as string;
  if (!uploadID) return res.status(400).send({ message: 'Fehlende UploadID' });
  await deleteGeneratedFiles(uploadID);
  return res.status(200).send({ message: 'Generierte Dateien gelöscht' });
};

export const handeleDeleteAllGeneratedFiles = async (req: Request, res: Response) => {
  await deleteAllGeneratedFiles();
  return res.status(200).send({ message: 'Alle generierten Dateien gelöscht' });
};

export const handleGetUploadsFeedback = async (req: Request, res: Response) => {
  const monthStr = req.query['month'] as string | undefined;
  const yearStr = req.query['year'] as string | undefined;

  const month = monthStr ? parseInt(monthStr, 10) : undefined;
  const year = yearStr ? parseInt(yearStr, 10) : undefined;

  if (month !== undefined && (!Number.isInteger(month) || month < 1 || month > 12)) {
    return res.status(400).send({ message: 'Ungültige Monatsangabe' });
  }

  if (year !== undefined && (!Number.isInteger(year) || year <= 1900)) {
    return res.status(400).send({ message: 'Ungültige Jahresangabe' });
  }

  const evaluation = await getFeedbackEvaluation(month, year);
  return res.status(200).json(evaluation);
};
