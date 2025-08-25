import logger from 'server/config/logger.config';
import { Request, Response } from 'express';
import { migrateFromAntragToUploadinfo, migrateFromDocxToOdt, migrateFromJSONFilesToDatabase } from 'server/services/migration.service';

export const handleMigrationFromAntragToUploadinfo = async (req: Request, res: Response) => {
  try {
    await migrateFromAntragToUploadinfo();
    logger.info('Migration von Antrag zu Uploadinfo erfolgreich.');
    return res.status(200).send({ message: 'Migration von Antrag zu Uploadinfo erfolgreich.' });
  } catch (error: any) {
    logger.error('Migration von Antrag zu Uploadinfo fehlgeschlagen: ', error);
    return res.status(500).json({ message: 'Migration von Antrag zu Uploadinfo fehlgeschlagen' });
  }
};

export const handleMigrateFromJSONFilesToDatabase = async (req: Request, res: Response) => {
  try {
    await migrateFromJSONFilesToDatabase();
    logger.info('Migration von JSON zu Datenbank erfolgreich.');
    return res.status(200).send({ message: 'Migration von JSON zu Datenbank erfolgreich.' });
  } catch (error: any) {
    logger.error('Migration von JSON zu Datenbank fehlgeschlagen: ', error);
    return res.status(500).send({ message: 'Migration von JSON zu Datenbank fehlgeschlagen' });
  }
};

export const handleMigrateFromDocxToOdt = async (req: Request, res: Response) => {
  try {
    await migrateFromDocxToOdt();
    logger.info('Migration von .docx zu .odt erfolgreich.');
    return res.status(200).send({ message: 'Migration von .docx zu .odt erfolgreich.' });
  } catch (error: any) {
    logger.error('Migration von .docx zu .odt fehlgeschlagen: ', error);
    return res.status(500).send({ message: 'Migration von .docx zu .odt fehlgeschlagen' });
  }
};
