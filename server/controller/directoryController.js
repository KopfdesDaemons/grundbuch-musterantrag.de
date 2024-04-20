const { log } = require('console');
const fs = require('fs');
const path = require('path');

const pageSize = 20;

exports.getDocxAndPdfFiles = async (req, res, folderPath) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * pageSize;

    const files = await fs.promises.readdir(folderPath);

    const fileStats = await Promise.all(files.map(async (file) => {
      const filePath = `${folderPath}/${file}`;
      const stats = await fs.promises.stat(filePath);
      return { file, stats };
    }));
    
    // Sortiere: Neuste Datei zuerst
    const sortedFiles = fileStats.sort((a, b) => b.stats.mtimeMs - a.stats.mtimeMs).map(({ file }) => file);

    // Festlegen der Gesamtzahl der Dateien und Gesamtzahl der Seiten
    const totalFiles = sortedFiles.length;
    const totalPages = Math.ceil(totalFiles / pageSize);

    // Festlegen der Dateien für die aktuelle Seite
    const pageFiles = sortedFiles.slice(offset, offset + pageSize);

    let mergedFileInfo = [];

    for (const file of pageFiles) {
      const name = file.split('.').slice(0, -1).join('.'); //Entferne Dateiendung

      const uploadDate = (await fs.promises.stat(`${folderPath}/${file}`)).birthtime;
      const day = uploadDate.getDate().toString().padStart(2, '0');
      const month = (uploadDate.getMonth() + 1).toString().padStart(2, '0');
      const year = uploadDate.getFullYear().toString();

      const formattedDate = `${day}.${month}.${year}`;
      log(uploadDate);

      if (!mergedFileInfo.some((fileInfo) => fileInfo.name === name)) {
        const fileInfo = {
          name,
          docxFile: '',
          pdfFile: '',
          uploadDate: formattedDate,
        };

        const docxFile = name + '.docx';
        const pdfFile = name + '.pdf';
        const pathDocx = path.join(folderPath + '/' + docxFile)
        const pathPdf = path.join(folderPath + '/' + pdfFile)

        if (await this.checkFileExists(pathDocx)) fileInfo.docxFile = docxFile;
        if (await this.checkFileExists(pathPdf)) fileInfo.pdfFile = pdfFile;
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
    req.logger.error('Fehler beim Laden der Dateien aus dem Ordner', error);
  }
};

exports.checkFileExists = async (path) => {
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

    // Prüfen, ob die Docx- und PDF-Dateien vorhanden sind und lösche sie
    if (await this.checkFileExists(`${folderPath}/${name}.docx`)) {
      await fs.promises.unlink(`${folderPath}/${name}.docx`);
    }
    if (await this.checkFileExists(`${folderPath}/${name}.pdf`)) {
      await fs.promises.unlink(`${folderPath}/${name}.pdf`);
    }

    res.send({ message: `Die Docx- und PDF-Dateien für '${name}' wurden erfolgreich gelöscht.` });
  } catch (error) {
    req.logger.error('Fehler beim Löschen der Docx- und PDF-Dateien', error);
    res.status(500).send({ error: 'Fehler beim Löschen der Docx- und PDF-Dateien' });
  }
};

exports.getFile = (req, res, filePath) => {
  const fileName = filePath.replace(/^.*[\\\/]/, '')

  fs.readFile(filePath, (error, data) => {
    if (error) {
      // Fehlerbehandlung, falls die Datei nicht gelesen werden konnte
      req.logger.error('Fehler beim Lesen einer Datei.', error);
      res.status(500).send('Datei konnte nicht gelesen werden.');
      return;
    }

    // Bestimmen der Dateiendung aus dem Dateinamen
    const ext = path.extname(filePath);

    if (ext == '.pdf') {
      // Sende .pdf mit der Option die Datei im Browser anzuzeigen
      res.contentType('application/pdf');
      res.setHeader('Content-Disposition', 'inline');
      res.setHeader('title', 'Musterantrag');
    }
    else {
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
  } catch (error) {
    req.logger.error('Fehler beim Löschen der Datein aus dem Ordner.', error);
    res.status(500).send('Error beim Löschen der Dateien');
  }
}