import path from 'path';
import express, { Request, Response } from 'express';
import moment from 'moment';
import * as fs from 'fs';
import * as converterController from '../../controller/converterController';
import { fileURLToPath } from 'url';

const SERVER_DIST_FOLDER = path.dirname(fileURLToPath(import.meta.url));
const router = express.Router();

router.post('/api/antraggrundbuchausdruck', async (req: Request, res: Response) => {
  try {
    const { docx } = req.files as any;
    if (!docx) {
      return res.status(400).send('Es wurde keine Datei in dem Wert "docx" in der Formdata empfangen.');
    }

    // Einzigartiger Dateiname mit aktuellem Datum und Uhrzeit
    const filename = moment().format('YYYY-MM-DD-HH-mm-ss');

    // Pfade
    const folderpath = path.join(SERVER_DIST_FOLDER, '/uploads');
    const filepath = path.join(folderpath, `${filename}.docx`);
    const filepathpdf = path.join(folderpath, `${filename}.pdf`);

    // Überprüft, ob der Ordner existiert, und erstellt ihn bei Bedarf
    if (!fs.existsSync(folderpath)) {
      fs.mkdirSync(folderpath, { recursive: true });
    }

    // Speichert die Datei
    await docx.mv(filepath);

    // Konvertiert DOCX in PDF
    await converterController.convertToPdf(filepath, folderpath);

    // Sendet PDF-Datei an den Client
    return res.contentType('application/pdf').sendFile(filepathpdf);

  } catch (error) {
    console.error('Fehler bei der Generierung des Antrags auf Erteilung eines Grundbuchausdrucks.', error);
    res.status(500).send('Interner Serverfehler.');
  }
});

export default router;
