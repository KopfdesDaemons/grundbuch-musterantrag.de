const { log } = require('console');
const fs = require('fs');
const path = require('path');

const pageSize = 50; // Anzahl der Dateien pro Seite

exports.getDirectoryContent = (req, res) => {
  const directoryPath = path.join(__dirname, req.params.dirName);
  const page = parseInt(req.query.page) || 1; // Standardseite: 1
  const offset = (page - 1) * pageSize;

  log('directoryController')

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      res.status(500).send({ error: 'Error getting directory content' });
    } else {
      const totalFiles = files.length;
      const totalPages = Math.ceil(totalFiles / pageSize);
      const pageFiles = files.slice(offset, offset + pageSize);
      const response = {
        page: page,
        totalPages: totalPages,
        totalFiles: totalFiles,
        files: pageFiles
      };
      res.send(response);
    }
  });
};
