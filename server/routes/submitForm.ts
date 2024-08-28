import path from 'path';
import express, { Request, Response } from 'express';
import moment from 'moment';
import * as fs from 'fs';
import * as converterController from '../services/converterService';
import { changeStatistic } from 'server/services/statisticService';
import { Antrag } from 'src/app/interfaces/antrag';
import { UPLOADS_FOLDER_PATH } from 'server/config/config';
import logger from 'server/config/logger';

const router = express.Router();

router.post('/api/submitForm', async (req: Request, res: Response) => {
  try {
    const { docx } = req.files as any;
    if (!docx) return res.status(400).send('Es wurde keine Datei in dem Wert "docx" in der Formdata empfangen.');

    const { data } = req.body;
    if (!data) return res.status(400).send('Es wurde keine Daten in dem Wert "data" in der Formdata empfangen.');
    const antrag = JSON.parse(data) as Antrag;

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
      logger.error('Fehler bei der Konvertierung:', convertError);
      return res.status(500).send('Fehler bei der Konvertierung der Datei.');
    }

    // Speichere Antragsdaten in JSON-Datei
    try {
      const formattedData = JSON.stringify(antrag, null, 2);
      await fs.promises.writeFile(filePathJSON, formattedData, 'utf-8');
    } catch (error) {
      logger.error('Fehler beim Speichern der Daten in der JSON-Datei:', error);
    }

    changeStatistic(antrag.title, 1);

    // Überprüfe ob die PDF-Datei erstellt wurde
    if (!fs.existsSync(filePathPdf)) {
      console.error('Die PDF-Datei wurde nicht erstellt.');
      return res.status(500).send('Interner Serverfehler: PDF-Datei nicht gefunden.');
    }

    // Sende PDF-Datei an den Client
    return res.contentType('application/pdf').sendFile(filePathPdf);

  } catch (error) {
    logger.error('Fehler bei der Generierung des Antrags auf Erteilung eines Grundbuchausdrucks.', error);
    return res.status(500).send('Interner Serverfehler.');
  }
});

export default router;
