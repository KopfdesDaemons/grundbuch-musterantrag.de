const { spawn } = require('child_process');

exports.convertToPdf = async (filepath, folderpath) =>{
    return new Promise((resolve, reject) => {
      const args = ['--convert-to', 'pdf', filepath, '--outdir', folderpath];
      const child = spawn('soffice', args);
      child.on('error', reject);
      child.on('exit', resolve);
    });
  }