import path from 'path';
import express, { Request, Response } from 'express';
import moment from 'moment';
import * as fs from 'fs';
import * as converterController from '../services/converterService';
import { changeStatistic } from 'server/services/statisticService';
import { UPLOADS_FOLDER_PATH } from 'server/config/config';
import logger from 'server/config/logger';
import { Upload } from 'server/models/upload';
import { deleteGeneratedFiles, writeUploadJSON } from 'server/services/uploadsService';
import { SettingsService } from 'server/services/settingsService';

const router = express.Router();

router.post('/api/submitForm', async (req: Request, res: Response) => {
  try {
    const uploadID = moment().format('YYYY-MM-DD-HH-mm-ss');

    // Erstelle Ordner für alle Uploaddateien
    const uploadFolderPath = path.join(UPLOADS_FOLDER_PATH, uploadID);
    await fs.promises.mkdir(uploadFolderPath, { recursive: true });


    const filePathDocx = path.join(uploadFolderPath, `${uploadID}.docx`);
    const filePathPdf = path.join(uploadFolderPath, `${uploadID}.pdf`);


    // Prüfe ob Daten in dem Wert "data" in der Formdata empfangen wurden
    let { uploadinfo } = req.body;
    if (!uploadinfo) {
      logger.error('Es wurde keine Daten in dem Wert "data" in der Formdata empfangen.');
      return res.status(400).send('Es wurde keine Daten in dem Wert "data" in der Formdata empfangen.');
    }


    uploadinfo = JSON.parse(uploadinfo) as Upload;
    uploadinfo.uploadDate = moment().format('DD.MM.YYYY');
    uploadinfo.uploadID = uploadID;


    // Prüfe ob Dateien in der Formdata empfangen wurden
    if (!req.files) {
      logger.error('Es wurde keine Datei in der Formdata empfangen.');
      saveUploadinfo();
      return res.status(400).send('Es wurde keine Datei in der Formdata empfangen.');
    }


    // Prüfe ob die Datei in dem Wert "docx" in der Formdata empfangen wurde
    const { docx } = req.files as any;
    if (!docx) {
      logger.error('Es wurde keine Datei in dem Wert "docx" in der Formdata empfangen.');
      saveUploadinfo();
      return res.status(400).send('Es wurde keine Datei in dem Wert "docx" in der Formdata empfangen.');
    }
    else uploadinfo.docxFile = true;
    saveUploadinfo();


    // Speichere die DOCX-Datei im Upload-Ordner
    await docx.mv(filePathDocx);

    await changeStatistic(uploadinfo.antragsart, 1);


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
    }
    else uploadinfo.pdfFile = true;
    saveUploadinfo();


    // Sende PDF-Datei an den Client
    res.contentType('application/pdf').sendFile(filePathPdf, () => {

      // Lösche Uploaddateien, wenn die Einstellung aktiviert ist
      if (!SettingsService.getSettings().deleteGeneratedFilesAfterResponse) return;
      try {
        deleteGeneratedFiles(uploadID);
      } catch (error) {
        logger.error('Fehler beim Löschen der generierten Dateien nach dem Response:', error);
      }
    });

    return;

    // Speichere Antragsdaten in JSON-Datei
    async function saveUploadinfo() {
      try {
        await writeUploadJSON(uploadinfo);
      } catch (error) {
        logger.error('Fehler beim Speichern der Daten in der JSON-Datei:', error);
      }
    }

  } catch (error) {
    logger.error('Fehler bei der Generierung des Antrags auf Erteilung eines Grundbuchausdrucks.', error);
    return res.status(500).send('Interner Serverfehler.');
  }
});

export default router;
