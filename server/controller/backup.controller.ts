import { Request, Response } from 'express';
import {
  createNewBackup,
  deleteBackups,
  getBackupList,
  IncompatibleBackupVersionError,
  restoreBackup,
  RestoreBackupResult
} from 'server/services/backup.service';
import { UploadedFile } from 'express-fileupload';
import path from 'path';
import { BACKUP_FOLDER_PATH, STORAGE_FOLDER_PATH } from 'server/config/path.config';
import fs from 'fs';
import logger from 'server/config/logger.config';
import { getFile } from 'server/helpers/file-system.helper';
import { clearUserRoleCache } from 'server/services/user-role.service';

const formatRestoreMessage = (result: RestoreBackupResult): string => {
  if (result.migrated) {
    const fromLabel = result.backupDbVersion === 0 ? 'v0 (Legacy)' : `v${result.backupDbVersion}`;
    return `Backup (${fromLabel}) erfolgreich eingespielt und automatisch auf Datenbank-Version v${result.currentDbVersion} migriert.`;
  }
  return `Backup (v${result.currentDbVersion}) erfolgreich eingespielt.`;
};

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
    if (!backupFile.name.endsWith('.sql.gz') && !backupFile.name.endsWith('.gz')) {
      return res.status(400).send({ message: 'Die Backup-Datei muss eine .sql.gz-Datei sein.' });
    }

    logger.info('Starte einspielen des Backups ' + backupFile.name);

    const ext = backupFile.name.endsWith('.sql.gz') ? '.sql.gz' : '.gz';
    const tempFilePath = path.join(STORAGE_FOLDER_PATH, `temp_restore_${Date.now()}${ext}`);
    await backupFile.mv(tempFilePath);
    try {
      const result = await restoreBackup(tempFilePath);
      clearUserRoleCache();
      const message = formatRestoreMessage(result);
      logger.info(`Backup ${backupFile.name} erfolgreich eingespielt (${message})`);
      return res.status(200).send({ message });
    } finally {
      if (fs.existsSync(tempFilePath)) {
        await fs.promises.unlink(tempFilePath);
      }
    }
  } catch (error) {
    logger.error('Fehler beim Einspielen des Backups:', error);
    if (error instanceof IncompatibleBackupVersionError) {
      return res.status(400).send({ message: error.message });
    }
    return res.status(500).send({ message: 'Fehler beim Einspielen des Backups.' });
  }
};

export const handleRestoreBackupByFileName = async (req: Request, res: Response) => {
  try {
    const backupFileName = req.query['backupFileName'] as string;
    if (!backupFileName) {
      return res.status(400).send({ message: 'Es wurde kein Backup-Dateiname übermittelt.' });
    }

    const backupFilePath = path.join(BACKUP_FOLDER_PATH, path.basename(backupFileName));
    if (!fs.existsSync(backupFilePath)) {
      return res.status(404).send({ message: 'Die angegebene Backup-Datei wurde nicht gefunden.' });
    }

    logger.info('Starte einspielen des Backups ' + backupFileName);
    const result = await restoreBackup(backupFilePath);
    clearUserRoleCache();
    const message = formatRestoreMessage(result);
    logger.info(`Backup ${backupFileName} erfolgreich eingespielt (${message})`);
    return res.status(200).send({ message });
  } catch (error) {
    logger.error('Fehler beim Einspielen des Backups:', error);
    if (error instanceof IncompatibleBackupVersionError) {
      return res.status(400).send({ message: error.message });
    }
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
