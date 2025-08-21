import path from 'path';
import { Request, Response } from 'express';
import * as fs from 'fs';
import * as converterController from '../helpers/file-conversion.helper';
import { updateStatistic } from 'server/services/statistic.service';
import { TEMPLATES_FOLDER_PATH, UPLOADS_FOLDER_PATH } from 'server/config/path.config';
import logger from 'server/config/logger.config';
import { Upload } from 'server/models/upload.model';
import { deleteGeneratedFiles, updateUploadData } from 'server/services/uploads.service';
import { SettingsService } from 'server/services/settings.service';
import { randomUUID } from 'crypto';
import OdtTemplater from 'server/helpers/odt-templater.helper';

export const submitForm = async (req: Request, res: Response) => {
  try {
    const uploadID = randomUUID();

    // Create a folder for the upload
    const uploadFolderPath = path.join(UPLOADS_FOLDER_PATH, uploadID);
    await fs.promises.mkdir(uploadFolderPath, { recursive: true });

    const filePathDocx = path.join(uploadFolderPath, `${uploadID}.docx`);
    const filePathPdf = path.join(uploadFolderPath, `${uploadID}.pdf`);

    // Check if the uploadinfo is in the formdata
    const { uploadinfo } = req.body;
    if (!uploadinfo) {
      logger.error('Es wurde keine Daten in dem Wert "uploadinfo" in der Formdata empfangen.');
      return res.status(400).send('Es wurde keine Daten in dem Wert "uploadinfo" in der Formdata empfangen.');
    }

    const newUpload = new Upload(uploadID);
    Object.assign(newUpload, JSON.parse(uploadinfo));
    newUpload.uploadDate = new Date();

    // Check if files is in the formdata
    if (!req.files) {
      logger.error('Es wurde keine Datei in der Formdata empfangen.');
      await saveUploadinfo();
      return res.status(400).send('Es wurde keine Datei in der Formdata empfangen.');
    }

    // Check if the DOCX-File is in the formdata
    const { docx } = req.files as any;
    if (!docx) {
      logger.error('Es wurde keine Datei in dem Wert "docx" in der Formdata empfangen.');
      await saveUploadinfo();
      return res.status(400).send('Es wurde keine Datei in dem Wert "docx" in der Formdata empfangen.');
    } else newUpload.docxFile = true;
    await saveUploadinfo();

    // Save the DOCX-File
    await docx.mv(filePathDocx);

    // Test odt-Templater ############################################################

    try {
      const templater = new OdtTemplater(path.join(TEMPLATES_FOLDER_PATH, 'abschriftBewilligung.odt'));
      const { antrag } = req.body;
      const parsedAntrag = JSON.parse(antrag);
      templater.replaceVariables(parsedAntrag);
      templater.generate(path.join(uploadFolderPath, `${uploadID}.odt`));
    } catch (error) {
      logger.error('Fehler beim Erstellen der ODT-Datei:', error);
      return res.status(500).send('Fehler beim Erstellen der ODT-Datei.');
    }
    await updateStatistic(newUpload.antragsart, 1);

    // ###############################################################################

    // Convert the DOCX-File to a PDF-File
    try {
      await converterController.convertToPdf(filePathDocx, uploadFolderPath);
    } catch (convertError) {
      logger.error('Fehler bei der Konvertierung:', convertError);
      return res.status(500).send('Fehler bei der Konvertierung der Datei.');
    }

    // Check if the PDF-File was created
    if (!fs.existsSync(filePathPdf)) {
      logger.error('Die PDF-Datei wurde nicht erstellt.');
      return res.status(500).send('Interner Serverfehler: PDF-Datei nicht gefunden.');
    } else newUpload.pdfFile = true;
    await saveUploadinfo();

    // Send the PDF-File
    res.contentType('application/pdf').sendFile(filePathPdf, cleanupFiles);

    // Delete generated files after response when setting is enabled
    async function cleanupFiles(): Promise<void> {
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
};
