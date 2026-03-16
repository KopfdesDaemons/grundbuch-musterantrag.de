import { Request, Response } from 'express';
import { createNewBackup, deleteBackups, getBackupList, restoreBackup } from 'server/services/backup.service';
import { UploadedFile } from 'express-fileupload';
import path from 'path';
import { BACKUP_FOLDER_PATH, STORAGE_FOLDER_PATH } from 'server/config/path.config';
import fs from 'fs';
import logger from 'server/config/logger.config';
import { getFile } from 'server/helpers/file-system.helper';
import { clearUserRoleCache } from 'server/services/user-role.service';

export const handleGetBackupList = async (req: Request, res: Response) => {
  const page = parseInt(req.query['page'] as string, 10) || 1;
  const paginatedResponse = await getBackupList(page);
  return res.json(paginatedResponse);
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
    if (!backupFile.name.endsWith('.zip')) {
      return res.status(400).send({ message: 'Die Backup-Datei muss eine .zip-Datei sein.' });
    }
    const tempFilePath = path.join(STORAGE_FOLDER_PATH, 'temp_restore.zip');
    await backupFile.mv(tempFilePath);
    await restoreBackup(tempFilePath);
    clearUserRoleCache();
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
    clearUserRoleCache();
    logger.info('Backup ' + backupFileName + ' erfolgreich eingespielt.');
    return res.status(200).send({ message: 'Backup erfolgreich eingespielt.' });
  } catch (error) {
    logger.error('Fehler beim Einspielen des Backups:', error);
    return res.status(500).send({ message: 'Fehler beim Einspielen des Backups.' });
  }
};

export const handleDeleteBackup = async (req: Request, res: Response) => {
  const fileNames = req.query['fileNames'] as string;

  // Split the comma-separated string into an array
  const fileNamesArray = fileNames.split(',').map(id => id.trim());

  if (!fileNamesArray) {
    return res.status(400).send({ message: 'Unvollständige oder ungültige Anfrage, erwartet wird ein Array von Dateinamens' });
  }

  await deleteBackups(fileNamesArray);

  return res.status(200).send({ message: 'Backups gelöscht' });
};

export const handleDownloadBackup = async (req: Request, res: Response) => {
  const fileName = req.query['fileName'] as string;
  if (!fileName) return res.status(400).send({ message: 'Es wurde kein Backup-Dateiname übermittelt.' });
  const file = await getFile(BACKUP_FOLDER_PATH, fileName);
  return res.send(file);
};
