import path from 'path';
import express, { Request, Response } from 'express';
import * as fs from 'fs';
import * as converterController from '../helpers/file-conversion.helper';
import { updateStatistic } from 'server/services/statistic.service';
import { UPLOADS_FOLDER_PATH } from 'server/config/path.config';
import logger from 'server/config/logger.config';
import { Upload } from 'server/models/upload.model';
import { deleteGeneratedFiles, updateUploadData } from 'server/services/uploads.service';
import { SettingsService } from 'server/services/settings.service';
import { randomUUID } from 'crypto';

export const submitFormRoutes = express.Router();

submitFormRoutes.post('/', async (req: Request, res: Response) => {
  try {
    const uploadID = randomUUID();

    // Erstelle Ordner für alle Uploaddateien
    const uploadFolderPath = path.join(UPLOADS_FOLDER_PATH, uploadID);
    await fs.promises.mkdir(uploadFolderPath, { recursive: true });

    const filePathDocx = path.join(uploadFolderPath, `${uploadID}.docx`);
    const filePathPdf = path.join(uploadFolderPath, `${uploadID}.pdf`);

    // Prüfe ob Daten in dem Wert "data" in der Formdata empfangen wurden
    const { uploadinfo } = req.body;
    if (!uploadinfo) {
      logger.error('Es wurde keine Daten in dem Wert "data" in der Formdata empfangen.');
      return res.status(400).send('Es wurde keine Daten in dem Wert "data" in der Formdata empfangen.');
    }

    const newUpload = new Upload(uploadID);
    Object.assign(newUpload, JSON.parse(uploadinfo));
    newUpload.uploadDate = new Date();

    // Prüfe ob Dateien in der Formdata empfangen wurden
    if (!req.files) {
      logger.error('Es wurde keine Datei in der Formdata empfangen.');
      await saveUploadinfo();
      return res.status(400).send('Es wurde keine Datei in der Formdata empfangen.');
    }

    // Prüfe ob die Datei in dem Wert "docx" in der Formdata empfangen wurde
    const { docx } = req.files as any;
    if (!docx) {
      logger.error('Es wurde keine Datei in dem Wert "docx" in der Formdata empfangen.');
      await saveUploadinfo();
      return res.status(400).send('Es wurde keine Datei in dem Wert "docx" in der Formdata empfangen.');
    } else newUpload.docxFile = true;
    await saveUploadinfo();

    // Speichere die DOCX-Datei im Upload-Ordner
    await docx.mv(filePathDocx);

    await updateStatistic(newUpload.antragsart, 1);

    // Konvertiere DOCX in PDF
    try {
      await converterController.convertToPdf(filePathDocx, uploadFolderPath);
    } catch (convertError) {
      logger.error('Fehler bei der Konvertierung:', convertError);
      return res.status(500).send('Fehler bei der Konvertierung der Datei.');
    }

    // Überprüfe ob die PDF-Datei erstellt wurde
    if (!fs.existsSync(filePathPdf)) {
      logger.error('Die PDF-Datei wurde nicht erstellt.');
      return res.status(500).send('Interner Serverfehler: PDF-Datei nicht gefunden.');
    } else newUpload.pdfFile = true;
    await saveUploadinfo();

    // Sende PDF-Datei an den Client
    res.contentType('application/pdf').sendFile(filePathPdf, cleanupFiles);

    async function cleanupFiles(): Promise<void> {
      // Lösche Uploaddateien, wenn die Einstellung aktiviert ist
      try {
        if (!(await SettingsService.getSettings()).deleteGeneratedFilesAfterResponse) return;
        await deleteGeneratedFiles(uploadID);
      } catch (error) {
        logger.error('Fehler beim Löschen der generierten Dateien nach dem Response:', error);
      }
    }

    async function saveUploadinfo(): Promise<void> {
      try {
        await updateUploadData(newUpload);
      } catch (error) {
        logger.error('Fehler beim Speichern der Uploadinfos:', error);
      }
    }

    return;
  } catch (error) {
    logger.error('Fehler bei der Generierung des Antrags: ', error);
    return res.status(500).send('Interner Serverfehler.');
  }
});
