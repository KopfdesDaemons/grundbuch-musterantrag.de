import path from 'path';
import { Request, Response } from 'express';
import * as fs from 'fs';
import PizZip from 'pizzip';
import { OdtTemplater } from 'odt-templater';
import * as converterController from '../helpers/file-conversion.helper';
import { updateStatistic } from 'server/services/statistic.service';
import { TEMPLATES_FOLDER_PATH, UPLOADS_FOLDER_PATH } from 'server/config/path.config';
import logger from 'server/config/logger.config';
import { Upload } from 'server/models/upload.model';
import { deleteGeneratedFiles, updateUploadData } from 'server/services/uploads.service';
import { randomUUID } from 'crypto';
import { SettingsService } from 'server/services/settings.service';

export const submitForm = async (req: Request, res: Response) => {
  try {
    const uploadID = randomUUID();

    // Create a folder for the upload
    const uploadFolderPath = path.join(UPLOADS_FOLDER_PATH, uploadID);
    await fs.promises.mkdir(uploadFolderPath, { recursive: true });

    const filePathOdt = path.join(uploadFolderPath, `${uploadID}.odt`);
    const filePathPdf = path.join(uploadFolderPath, `${uploadID}.pdf`);

    const newUpload = new Upload(uploadID);
    const { antrag } = req.body;

    // Generate the ODT-File from the template
    try {
      if (!antrag || !antrag.templateFileName) {
        logger.error('Es wurde kein Antrag oder kein templateFileName im Antrag übermittelt.');
        return res.status(400).send('Es wurde kein Antrag oder kein templateFileName im Antrag übermittelt.');
      }
      // Load the ODT template file
      const templatePath = path.join(TEMPLATES_FOLDER_PATH, `${antrag.templateFileName}.odt`);
      const templateBuffer = fs.readFileSync(templatePath);
      const zip = new PizZip(templateBuffer);
      const contentFile = zip.file('content.xml');
      if (!contentFile) throw new Error('Die content.xml-Datei wurde im ODT-Template nicht gefunden.');
      const content = contentFile.asText();

      // Initialize OdtTemplater and render the document
      const templater = new OdtTemplater(content);
      const renderedContent = templater.render(antrag);

      // Replace the content in the ZIP
      zip.file('content.xml', renderedContent);

      // Generate the output ODT file
      const outputBuffer = zip.generate({ type: 'nodebuffer' });
      fs.writeFileSync(filePathOdt, outputBuffer);
      newUpload.odtFile = true;
    } catch (error) {
      logger.error('Fehler beim Erstellen der ODT-Datei:', error);
      return res.status(500).json({ message: 'Fehler beim Erstellen der ODT-Datei.' });
    }

    newUpload.antragsart = antrag.title;
    newUpload.grundbuchamt = antrag.grundbuchamt.name;
    newUpload.uploadDate = new Date();
    await saveUploadinfo();

    await updateStatistic(newUpload.antragsart, 1);

    // Convert the ODT-File to a PDF-File
    try {
      await converterController.convertToPdf(filePathOdt, uploadFolderPath);
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

    res.status(200).send({ message: 'Antrag erfolgreich erstellt.', uploadID });

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

export const handleGetOdtAfterSubmitForm = (req: Request, res: Response) => {
  const uploadID = req.query['uploadID'] as string;
  if (!uploadID) return res.status(400).send({ message: 'Fehlende UploadID' });

  const fileName = `${uploadID}.odt`;
  const folderPath: string = path.join(UPLOADS_FOLDER_PATH, uploadID);

  res.on('finish', async () => {
    try {
      if (!(await SettingsService.getSettings()).deleteGeneratedFilesAfterResponse) return;
      await deleteGeneratedFiles(uploadID);
    } catch (error) {
      logger.error('Fehler beim Löschen der generierten Dateien nach dem Response:', error);
    }
  });

  try {
    const filePath = path.join(folderPath, fileName);
    return res.contentType('application/vnd.oasis.opendocument.text').sendFile(filePath);
  } catch (error) {
    logger.error('Fehler beim Abrufen der ODT-Datei:', error);
    return res.status(500).send({ message: 'Fehler beim Abrufen der ODT-Datei' });
  }
};

export const handleGetPdfAfterSubmitForm = (req: Request, res: Response) => {
  const uploadID = req.query['uploadID'] as string;
  if (!uploadID) return res.status(400).send({ message: 'Fehlende UploadID' });

  const fileName = `${uploadID}.pdf`;
  const folderPath: string = path.join(UPLOADS_FOLDER_PATH, uploadID);

  try {
    const filePath = path.join(folderPath, fileName);
    return res.contentType('application/pdf').sendFile(filePath);
  } catch (error) {
    logger.error('Fehler beim Abrufen der PDF-Datei:', error);
    return res.status(500).send({ message: 'Fehler beim Abrufen der PDF-Datei' });
  }
};
