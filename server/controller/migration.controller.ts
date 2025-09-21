import logger from 'server/config/logger.config';
import { Request, Response } from 'express';
import { migrateFromAntragToUploadinfo, migrateFromDocxToOdt, migrateFromJSONFilesToDatabase } from 'server/services/migration.service';

export const handleMigrationFromAntragToUploadinfo = async (req: Request, res: Response) => {
  await migrateFromAntragToUploadinfo();
  logger.info('Migration von Antrag zu Uploadinfo erfolgreich.');
  return res.status(200).send({ message: 'Migration von Antrag zu Uploadinfo erfolgreich.' });
};

export const handleMigrateFromJSONFilesToDatabase = async (req: Request, res: Response) => {
  await migrateFromJSONFilesToDatabase();
  logger.info('Migration von JSON zu Datenbank erfolgreich.');
  return res.status(200).send({ message: 'Migration von JSON zu Datenbank erfolgreich.' });
};

export const handleMigrateFromDocxToOdt = async (req: Request, res: Response) => {
  await migrateFromDocxToOdt();
  logger.info('Migration von .docx zu .odt erfolgreich.');
  return res.status(200).send({ message: 'Migration von .docx zu .odt erfolgreich.' });
};
