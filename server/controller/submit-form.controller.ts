import path from 'path';
import { Request, Response } from 'express';
import * as fs from 'fs';
import { unzipSync, zipSync, strFromU8, strToU8, Zippable } from 'fflate';
import { OdtTemplater } from 'odt-templater';
import { TEMPLATES_FOLDER_PATH, UPLOADS_FOLDER_PATH } from 'server/config/path.config';
import logger from 'server/config/logger.config';
import { Upload } from 'common/models/upload.model';
import { deleteGeneratedFiles, reportDownloadByUser, updateUploadData } from 'server/services/uploads.service';
import { randomUUID } from 'crypto';
import { SettingsService } from 'server/services/settings.service';
import { convertToPdf } from '../helpers/file-conversion.helper';

interface CachedTemplate {
  baseZipStructure: Zippable;
  contentXml: string;
}

const templateCache = new Map<string, CachedTemplate>();
const pendingPdfConversions = new Map<string, Promise<void>>();
const deliveredFilesByUpload = new Map<string, Set<'odt' | 'pdf'>>();

const getTemplate = async (templateFileName: string): Promise<CachedTemplate> => {
  const cached = templateCache.get(templateFileName);
  if (cached) return cached;

  const templatePath = path.join(TEMPLATES_FOLDER_PATH, `${templateFileName}.odt`);
  const templateBuffer = await fs.promises.readFile(templatePath);
  const unzipped = unzipSync(templateBuffer);

  const contentU8 = unzipped['content.xml'];
  if (!contentU8) throw new Error('Die content.xml-Datei wurde im ODT-Template nicht gefunden.');
  const contentXml = strFromU8(contentU8);

  // In ODF, mimetype must be uncompressed (level 0) and the first entry in the archive
  const baseZipStructure: Zippable = {};
  if (unzipped['mimetype']) {
    baseZipStructure['mimetype'] = [unzipped['mimetype'], { level: 0 }];
  }
  for (const [filename, fileData] of Object.entries(unzipped)) {
    if (filename !== 'mimetype' && filename !== 'content.xml') {
      baseZipStructure[filename] = [fileData, { level: 1 }];
    }
  }

  const entry: CachedTemplate = { baseZipStructure, contentXml };
  templateCache.set(templateFileName, entry);
  return entry;
};

const markResponseFinishedAndCleanup = (uploadID: string, type: 'odt' | 'pdf') => {
  let delivered = deliveredFilesByUpload.get(uploadID);
  if (!delivered) {
    delivered = new Set();
    deliveredFilesByUpload.set(uploadID, delivered);
  }
  delivered.add(type);

  if (delivered.size >= 2) {
    deliveredFilesByUpload.delete(uploadID);
    void (async () => {
      try {
        if (!(await SettingsService.getSettings()).deleteGeneratedFilesAfterResponse) return;
        await deleteGeneratedFiles(uploadID);
      } catch (error) {
        logger.error('Fehler beim Löschen der generierten Dateien nach dem Response:', error);
      }
    })();
  }
};

export const submitForm = async (req: Request, res: Response) => {
  const { antrag } = req.body;

  if (!antrag) {
    logger.error('Es wurde kein Antrag übermittelt.');
    return res.status(400).send('Es wurde kein Antrag übermittelt.');
  }

  if (!antrag.templateFileName) {
    logger.error('Es wurde kein templateFileName übermittelt.');
    return res.status(400).send('Es wurde kein templateFileName übermittelt.');
  }

  const uploadID = randomUUID();
  const uploadFolderPath = path.join(UPLOADS_FOLDER_PATH, uploadID);
  const filePathOdt = path.join(uploadFolderPath, `${uploadID}.odt`);
  const filePathPdf = path.join(uploadFolderPath, `${uploadID}.pdf`);

  // Load cached template and create upload directory in parallel
  const [{ baseZipStructure, contentXml }] = await Promise.all([
    getTemplate(antrag.templateFileName),
    fs.promises.mkdir(uploadFolderPath, { recursive: true })
  ]);

  // Initialize OdtTemplater and render the document
  const templater = new OdtTemplater(contentXml);
  const renderedContent = templater.render(antrag);

  const filesToZip: Zippable = {
    ...baseZipStructure,
    'content.xml': [strToU8(renderedContent), { level: 1 }]
  };

  // Generate the output ODT file
  const outputBuffer = Buffer.from(zipSync(filesToZip));

  const newUpload = new Upload(uploadID);
  newUpload.odtFile = true;
  newUpload.antragsart = antrag.title;
  newUpload.grundbuchamt = antrag.grundbuchamt.name;
  newUpload.uploadDate = new Date();

  await Promise.all([fs.promises.writeFile(filePathOdt, outputBuffer), updateUploadData(newUpload)]);

  // Start PDF conversion asynchronously so ODT is immediately available
  const pdfConversionPromise = (async () => {
    try {
      await convertToPdf(filePathOdt, uploadFolderPath);
      await fs.promises.access(filePathPdf);
      newUpload.pdfFile = true;
      await updateUploadData(newUpload);
    } catch (e) {
      logger.error('Fehler bei der PDF-Konvertierung:', e);
    } finally {
      pendingPdfConversions.delete(uploadID);
    }
  })();

  pendingPdfConversions.set(uploadID, pdfConversionPromise);

  return res.status(200).send({ message: 'Antrag erfolgreich erstellt.', uploadID });
};

export const handleGetOdtAfterSubmitForm = async (req: Request, res: Response) => {
  const uploadID = req.query['uploadID'] as string;
  if (!uploadID) return res.status(400).send({ message: 'Fehlende UploadID' });

  const fileName = `${uploadID}.odt`;
  const folderPath: string = path.join(UPLOADS_FOLDER_PATH, uploadID);
  const filePath = path.join(folderPath, fileName);

  res.on('finish', () => {
    markResponseFinishedAndCleanup(uploadID, 'odt');
  });

  try {
    await fs.promises.access(filePath);
  } catch {
    return res.status(404).send({ message: 'ODT-Datei nicht gefunden' });
  }

  return res.contentType('application/vnd.oasis.opendocument.text').sendFile(filePath);
};

export const handleGetPdfAfterSubmitForm = async (req: Request, res: Response) => {
  const uploadID = req.query['uploadID'] as string;

  if (!uploadID) return res.status(400).send({ message: 'Fehlende UploadID' });

  const pendingConversion = pendingPdfConversions.get(uploadID);
  if (pendingConversion) {
    await pendingConversion;
  }

  const fileName = `${uploadID}.pdf`;
  const folderPath: string = path.join(UPLOADS_FOLDER_PATH, uploadID);
  const filePath = path.join(folderPath, fileName);

  res.on('finish', () => {
    markResponseFinishedAndCleanup(uploadID, 'pdf');
  });

  try {
    await fs.promises.access(filePath);
  } catch {
    return res.status(404).send({ message: 'PDF-Datei nicht gefunden' });
  }

  return res.contentType('application/pdf').sendFile(filePath);
};

export const handleReportDownloadByUser = async (req: Request, res: Response) => {
  const { uploadID, fileType } = req.body;

  if (!uploadID || !fileType) {
    return res.status(400).send({ message: 'Ungültige Anfrage' });
  }

  if (fileType !== 'odtFile' && fileType !== 'pdfFile') {
    return res.status(400).send({ message: 'Ungültiger Dateityp' });
  }

  await reportDownloadByUser(uploadID, fileType);

  return res.status(200).send({ message: 'Download erfolgreich gemeldet.' });
};
