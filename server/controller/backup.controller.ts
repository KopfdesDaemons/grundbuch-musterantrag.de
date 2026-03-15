import { Request, Response } from 'express';
import { createNewBackup, getBackupList, restoreBackup } from 'server/services/backup.service';
import { UploadedFile } from 'express-fileupload';
import path from 'path';
import { STORAGE_FOLDER_PATH } from 'server/config/path.config';
import fs from 'fs';
import logger from 'server/config/logger.config';

export const handleGetBackupList = async (req: Request, res: Response) => {
  const page = parseInt(req.query['page'] as string, 10) || 1;
  const files = await getBackupList(page);
  return res.json(files);
};

export const handelCreateNewBackup = async (req: Request, res: Response) => {
  await createNewBackup();
  return res.status(200).send({ message: 'Backup erfolgreich erstellt.' });
};

export const handleRestoreBackupByFileUpload = async (req: Request, res: Response) => {
  try {
    if (!req.files || !req.files['backupFile']) {
      return res.status(400).send({ message: 'Es wurde keine Backup-Datei übermittelt.' });
    }

    const backupFile = req.files['backupFile'] as UploadedFile;
    logger.info('Starte einspielen des Backups ' + backupFile.name);
    if (!backupFile.name.endsWith('.sql')) {
      return res.status(400).send({ message: 'Die Backup-Datei muss eine .sql-Datei sein.' });
    }
    const tempFilePath = path.join(STORAGE_FOLDER_PATH, 'temp_restore.sql');
    await backupFile.mv(tempFilePath);
    await restoreBackup(tempFilePath);
    fs.unlinkSync(tempFilePath);
    logger.info('Backup ' + backupFile.name + ' erfolgreich eingespielt.');
    return res.status(200).send({ message: 'Backup erfolgreich eingespielt.' });
  } catch (error) {
    logger.error('Fehler beim Einspielen des Backups:', error);
    return res.status(500).send({ message: 'Fehler beim Einspielen des Backups.' });
  }
};

export const handleRestoreBackupByFileName = async (req: Request, res: Response) => {
  try {
    const backupFileName = req.query['backupFileName'] as string;
    if (!backupFileName) {
      return res.status(400).send({ message: 'Es wurde kein Backup-Dateiname übermittelt.' });
    }

    const backupFilePath = path.join(STORAGE_FOLDER_PATH, 'backups', backupFileName);
    if (!fs.existsSync(backupFilePath)) {
      return res.status(404).send({ message: 'Die angegebene Backup-Datei wurde nicht gefunden.' });
    }

    logger.info('Starte einspielen des Backups ' + backupFileName);
    await restoreBackup(backupFilePath);
    logger.info('Backup ' + backupFileName + ' erfolgreich eingespielt.');
    return res.status(200).send({ message: 'Backup erfolgreich eingespielt.' });
  } catch (error) {
    logger.error('Fehler beim Einspielen des Backups:', error);
    return res.status(500).send({ message: 'Fehler beim Einspielen des Backups.' });
  }
};
