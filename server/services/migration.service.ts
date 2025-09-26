import { UPLOADS_FOLDER_PATH } from 'server/config/path.config';
import * as fs from 'fs';
import path from 'path';
import { Upload } from 'common/models/upload.model';
import { Antrag } from 'src/app/interfaces/antrag';
import { updateUploadData } from './uploads.service';
import logger from 'server/config/logger.config';
import { checkFileExists } from '../helpers/file-system.helper';
import { updateStatistic } from './statistic.service';
import { db } from './database.service';
import { RowDataPacket } from 'mysql2';

/**
 * Migration von Antrag zu Uploadinfo
 * (Struktur der Uploadinfos wird geupdatet)
 */
export const migrateFromAntragToUploadinfo = async (): Promise<void> => {
  const uploadsFolders = await fs.promises.readdir(UPLOADS_FOLDER_PATH);

  for (const folder of uploadsFolders) {
    try {
      const JSONPath = path.join(UPLOADS_FOLDER_PATH, folder, folder + '.json');
      const file = await fs.promises.readFile(JSONPath, 'utf8');
      const antrag: Antrag = JSON.parse(file) as Antrag;
      const upload: Upload = new Upload(folder);

      // Nur gleichnamige Parameter übernehmen
      Object.keys(upload).forEach(key => {
        if (key in antrag) {
          (upload as any)[key] = (antrag as any)[key];
        }
      });

      if (!upload.uploadID) upload.uploadID = folder;
      if (!upload.uploadDate) {
        const [day, month, year] = antrag.datum;
        const formattedDate = `${year}-${month}-${day}`;
        upload.uploadDate = new Date(formattedDate);
      }
      if (!upload.antragsart) upload.antragsart = antrag.title;
      if (!(typeof upload.grundbuchamt === 'string')) upload.grundbuchamt = antrag.grundbuchamt.name;

      if (!upload.odtFile) {
        upload.odtFile = await checkFileExists(path.join(UPLOADS_FOLDER_PATH, folder, folder + '.docx'));
      }

      if (!upload.pdfFile) {
        upload.pdfFile = await checkFileExists(path.join(UPLOADS_FOLDER_PATH, folder, folder + '.pdf'));
      }

      await updateUploadData(upload);
    } catch (error) {
      logger.error('Fehler beim Migration von Antrag zu Uploadinfo beim Ordner ' + folder + ': ', error);
      throw error;
    }
  }
};

/**
 * Migration von der JSON Struktur zur Datenbank
 */
export const migrateFromJSONFilesToDatabase = async (): Promise<void> => {
  const uploadsFolders = await fs.promises.readdir(UPLOADS_FOLDER_PATH);

  if (!uploadsFolders) {
    logger.error('Migration fehlgeschlagen: Ordner ' + UPLOADS_FOLDER_PATH + ' konnte nicht gefunden werden.');
    throw new Error('Migration fehlgeschlagen: Ordner Uploads konnte nicht gefunden werden.');
  }

  for (const folder of uploadsFolders) {
    try {
      const JSONPath = path.join(UPLOADS_FOLDER_PATH, folder, folder + '.json');
      if (!(await checkFileExists(JSONPath))) {
        await fs.promises.rm(path.join(UPLOADS_FOLDER_PATH, folder), { recursive: true, force: true });
        continue;
      }
      const file = await fs.promises.readFile(JSONPath, 'utf8');
      const upload: Upload = new Upload(folder);
      const uploadJSON: any = JSON.parse(file);

      // Datums-String zu Date
      const dateString = uploadJSON.uploadDate;
      const [day, month, year] = dateString.split('.');
      uploadJSON.uploadDate = new Date(year, month - 1, day);

      Object.assign(upload, uploadJSON);

      await updateUploadData(upload);
      await updateStatistic(upload.antragsart, 1);

      if (upload.filesDeleted) {
        await fs.promises.rm(path.join(UPLOADS_FOLDER_PATH, folder), { recursive: true, force: true });
      }
    } catch (error) {
      logger.error('Fehler beim Migration von JSON zur Datenbank beim Ordner ' + folder + ': ', error);
      throw error;
    }
  }
};

/**
 * Migration von .docx zu .odt
 * (Aktualisiert bereits vorhandene Datenbankeinträge von .docx zu .odt)
 */
export const migrateFromDocxToOdt = async (): Promise<void> => {
  const query = `UPDATE uploads SET odtFile = TRUE WHERE docxFile = TRUE`;
  await db.execute<RowDataPacket[]>(query);

  const dropColumnSQL = `ALTER TABLE uploads DROP COLUMN docxFile`;
  await db.execute(dropColumnSQL);
};
