const { log } = require('console');
const fs = require('fs');
const path = require('path');

const pageSize = 20;

exports.getDocxAndPdfFiles = async (req, res, folderPath) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * pageSize;

    const files = await fs.promises.readdir(folderPath);

    // Festlegen der Gesamtzahl der Dateien und Gesamtzahl der Seiten
    const totalFiles = files.length;
    const totalPages = Math.ceil(totalFiles / pageSize);

    // Festlegen der Dateien für die aktuelle Seite
    const pageFiles = files.slice(offset, offset + pageSize);

    let mergedFileInfo = [];

    for (const file of pageFiles) {
      const name = file.split('.').slice(0, -1).join('.'); //Entferne Dateiendung

      const uploadDate = (await fs.promises.stat(`${folderPath}/${file}`)).birthtime;
      const day = uploadDate.getDate().toString().padStart(2, '0');
      const month = (uploadDate.getMonth() + 1).toString().padStart(2, '0');
      const year = uploadDate.getFullYear().toString();

      const formattedDate = `${day}.${month}.${year}`;

      if (!mergedFileInfo.some((fileInfo) => fileInfo.name === name)) {
        const fileInfo = {
          name,
          docxFile: '',
          pdfFile: '',
          uploadDate: formattedDate,
        };

        const docxFile = name + '.docx';
        const pdfFile = name + '.pdf';

        if (await checkFileExists(folderPath + '/' + docxFile)) fileInfo.docxFile = docxFile;
        if (await checkFileExists(folderPath + '/' + pdfFile)) fileInfo.pdfFile = pdfFile;

        mergedFileInfo.push(fileInfo);
      }
    }
    const response = {
      page,
      totalPages,
      totalFiles,
      files: mergedFileInfo
    };
    res.send(response);
  } catch (error) {
    log(error);
    res.status(500).send({ error: 'Error beim Laden der Dateien aus dem Ordner' });
  }
};

async function checkFileExists(path) {
  try {
    await fs.promises.access(path, fs.constants.F_OK);
    return true;
  } catch (err) {
    console.log('Die Datei', path, 'existiert nicht');
    return false;
  }
};

exports.deleteDocxAndPdfFiles = async (req, res, folderPath) => {
  try {
    const name = req.query.name;

    // Prüfen, ob die Docx- und PDF-Dateien vorhanden sind
    const docxExists = await fs.promises.access(`${folderPath}/${name}.docx`).then(() => true).catch(() => false);
    const pdfExists = await fs.promises.access(`${folderPath}/${name}.pdf`).then(() => true).catch(() => false);

    if (docxExists) {
      await fs.promises.unlink(`${folderPath}/${name}.docx`);
    }
    if (pdfExists) {
      await fs.promises.unlink(`${folderPath}/${name}.pdf`);
    }

    res.send({ message: `Die Docx- und PDF-Dateien für '${name}' wurden erfolgreich gelöscht.` });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Fehler beim Löschen der Docx- und PDF-Dateien' });
  }
};

exports.getFile = (req, res, folderPath) => {
  const fileName = req.query.name;
  const filePath = path.join(folderPath, fileName);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      // Fehlerbehandlung, falls die Datei nicht gelesen werden konnte
      console.error(err);
      res.status(500).send('Datei konnte nicht gelesen werden.');
      return;
    }

    // Bestimmen der Dateiendung aus dem Dateinamen
    const ext = path.extname(filePath);

    if(ext == '.pdf'){
      // Sende .pdf mit der Option die Datei im Browser anzuzeigen
      res.contentType('application/pdf');
      res.setHeader('Content-Disposition', 'inline');
      res.setHeader('title', 'Musterantrag');
    }
    else{
      // Setze den Header auf binär
      res.setHeader('Content-Type', 'application/octet-stream');
      // Setze einen Header der den Download auslöst
      res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    }
    res.send(data);
  });
};

exports.deleteAllFilesInFolder = async (req, res, folderPath) => {
  try {
    // Lade alle Dateien aus dem Ordner
    const files = await fs.promises.readdir(folderPath);
    
    // Lösche jede Datei
    for (const file of files) {
      const filePath = path.join(folderPath, file);
      await fs.promises.unlink(filePath);
    }
    
    res.status(200).send('Alle Dateien gelöscht');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error beim Löschen der Dateien');
  }
}