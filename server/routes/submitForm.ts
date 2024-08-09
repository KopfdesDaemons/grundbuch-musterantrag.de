import path from 'path';
import express, { Request, Response } from 'express';
import moment from 'moment';
import * as fs from 'fs';
import * as converterController from '../controller/converterController';
import { fileURLToPath } from 'url';

const SERVER_DIST_FOLDER = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_FOLDER_PATH = path.join(SERVER_DIST_FOLDER, '/uploads');
const router = express.Router();

router.post('/api/submitForm', async (req: Request, res: Response) => {
  try {
    const { docx } = req.files as any;
    if (!docx) return res.status(400).send('Es wurde keine Datei in dem Wert "docx" in der Formdata empfangen.');

    const { data } = req.body;
    if (!data) return res.status(400).send('Es wurde keine Daten in dem Wert "data" in der Formdata empfangen.');

    const filename = moment().format('YYYY-MM-DD-HH-mm-ss');

    // Erstelle Ordner für Antragsdateien
    const antragsFolderPath = path.join(UPLOADS_FOLDER_PATH, '/' + filename);
    await fs.promises.mkdir(antragsFolderPath, { recursive: true });

    const filePathDocx = path.join(antragsFolderPath, `${filename}.docx`);
    const filePathPdf = path.join(antragsFolderPath, `${filename}.pdf`);
    const filePathJSON = path.join(antragsFolderPath, `${filename}.json`);

    // Speichere die DOCX-Datei im Upload-Ordner
    await docx.mv(filePathDocx);

    // Konvertiere DOCX in PDF
    try {
      await converterController.convertToPdf(filePathDocx, antragsFolderPath);
    } catch (convertError) {
      req.logger.error('Fehler bei der Konvertierung:', convertError);
      return res.status(500).send('Fehler bei der Konvertierung der Datei.');
    }

    // Speichere Antragsdaten in JSON-Datei
    try {
      const formattedData = JSON.stringify(JSON.parse(data), null, 2);
      await fs.promises.writeFile(filePathJSON, formattedData, 'utf-8');
    } catch (error) {
      req.logger.error('Fehler beim Speichern der Daten in der JSON-Datei:', error);
    }

    // Überprüfe ob die PDF-Datei erstellt wurde
    if (!fs.existsSync(filePathPdf)) {
      console.error('Die PDF-Datei wurde nicht erstellt.');
      return res.status(500).send('Interner Serverfehler: PDF-Datei nicht gefunden.');
    }

    // Sende PDF-Datei an den Client
    return res.contentType('application/pdf').sendFile(filePathPdf);

  } catch (error) {
    req.logger.error('Fehler bei der Generierung des Antrags auf Erteilung eines Grundbuchausdrucks.', error);
    return res.status(500).send('Interner Serverfehler.');
  }
});

export default router;
