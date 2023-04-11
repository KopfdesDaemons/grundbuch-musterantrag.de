const { v4: uuidv4 } = require('uuid');
const converterController = require('../../controller/converterController');
const path = require('path');
const express = require('express');
const router = express.Router();

router.post('/api/antraggrundbuchausdruck', async (req, res) => {
  try {
    const { docx } = req.files;
    if (!docx) {
      return res.status(400).send('Es wurde keine Datei in dem Wert "docx" in der Formdata empfangen.');
    }
    
    //Einzigartiger Dateiname
    const filename = uuidv4();

    //Pfade
    const folderpath = path.join(__dirname, '/../../uploads');
    const filepath = path.join(folderpath, `${filename}.docx`);
    const filepathpdf = path.join(folderpath, `${filename}.pdf`);

    //Speichert die Datei
    await docx.mv(filepath);
    
    //Konvertiert DOCX in PDF
    await converterController.convertToPdf(filepath, folderpath);

    //Sendet PDF-Datei an den Client
    res.contentType('application/pdf').sendFile(filepathpdf);
  } catch (error) {
    console.error(error);
    res.status(500).send('Interner Serverfehler.');
  }
});

module.exports = router;
