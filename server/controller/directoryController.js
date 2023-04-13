const { log } = require('console');
const fs = require('fs');

const pageSize = 50;

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
    
      const index = mergedFileInfo.findIndex((fileInfo) => fileInfo.name === name);
      if (index === -1) {
        const fileInfo = {
          name,
          docxFile: '',
          pdfFile: '',
          uploadDate: (await fs.promises.stat(`${folderPath}/${file}`)).birthtime,
        };
    
        const docxFile = name + '.docx';
        const pdfFile = name + '.pdf';
    
        if (await checkFileExists(folderPath,'/', docxFile)) fileInfo.docxFile = docxFile;
        if (await checkFileExists(folderPath,'/', pdfFile)) fileInfo.pdfFile = pdfFile;
        
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
    res.status(500).send({ error: 'Error getting directory content' });
  }
};

async function checkFileExists(path){
  try {
    await fs.promises.access(path, fs.constants.F_OK);
    return true;
  } catch{
    return false;
  }
};

exports.deleteDocxAndPdfFiles = async (req, res, folderPath) => {
  try {
    const name = req.params.name;

    // Lösche die docx und pdf Dateien mit dem gegebenen Namen
    await Promise.all([
      fs.promises.unlink(`${folderPath}/${name}.docx`),
      fs.promises.unlink(`${folderPath}/${name}.pdf`)
    ]);

    res.send({ message: `Successfully deleted docx and pdf files for '${name}'` });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Error deleting docx and pdf files' });
  }
};