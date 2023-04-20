const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const authMiddleware = require('./middleware/authMiddleware');
const loggerMiddleware = require('./middleware/loggerMiddleware');
const authController = require('./controller/authController')
const directoryController = require('./controller/directoryController');
const scrapingController = require('./controller/scrapingController');
const fs = require('fs').promises;

const app = express();

//Umgebungsvariablen
process.env.UPLOAD_PATH = path.join(__dirname, '/uploads')

// Middlewares für die gesamte App
app.use(fileUpload());
app.use(express.json());
app.use(loggerMiddleware);


//Routen, welche nur einen Controller ansprechen
app.post('/api/login', authController.login);
app.post('/api/init', authController.createHashFile);
app.get('/api/uploads', authMiddleware, (req, res) => { directoryController.getDocxAndPdfFiles(req, res, process.env.UPLOAD_PATH); });
app.delete('/api/uploads/deleteFile', authMiddleware, (req, res) => { directoryController.deleteDocxAndPdfFiles(req, res, process.env.UPLOAD_PATH); });
app.delete('/api/uploads', authMiddleware, (req, res) => { directoryController.deleteAllFilesInFolder(req, res, process.env.UPLOAD_PATH); });
app.get('/api/uploads/getFile', authMiddleware, (req, res) => { directoryController.getFile(req, res, path.join(process.env.UPLOAD_PATH, req.query.name)); });
app.get('/api/amtsgerichtausplz', scrapingController.amtsgerichtausplz);


app.delete('/api/deleteLogFile', authMiddleware, async (req, res) => { 
  try{
    await fs.writeFile(path.join(__dirname, 'logFile.log'), '');
    res.status(200).send('LogFile.log gelöscht.');
  } catch(error){
    req.logger.error('Fehler beim Löschen der LogFile.log', error);
    res.status(500).send('Fehler beim Löschen der LogFile.log.' + error)
  }
});


app.get('/api/getLogFile', authMiddleware, async (req, res) => {
  try {
    const logFilePath = path.join(__dirname, 'logFile.log');
    const data = await fs.readFile(logFilePath, 'utf8');

    if(data == '') return res.send('Keine Serverlogs');

    // Trenne die JSON-Zeilen und füge sie zu einem Array zusammen
    const logs = data.trim().split('\n').map(line => JSON.parse(line));

    res.json(logs.reverse());
  } catch (error) {
    req.logger.error('Fehler beim Lesen der LogFile.log', error);
  }
});

//ausgelagerte Routen
app.use('/', require('./routes/anträge/grundbuchausdruckRoute'));


//Alle restlichen Routen zur index.html
app.get('*', (req, res) => {
  req.logger.info(`Anfrage an ${req.originalUrl} wurde zur Index.html umgeleitet`);
  res.redirect('/');
});

app.listen(8080, () => console.log('Server started'));