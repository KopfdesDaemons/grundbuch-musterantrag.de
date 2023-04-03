const express = require('express');
const fileUpload = require('express-fileupload');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const { spawn } = require('child_process');

const app = express();
app.use(fileUpload());
app.use(express.json());

var distDir = __dirname + "/../dist/grundbuch";
app.use(express.static(distDir));


app.post('/api/antraggrundbuchausdruck', async function (req, res) {
  if (!req.files || !req.files.docx) return res.status(400).send('Es wurde keine Datei in dem Wert "docx" in der Formdata empfangen.');
  let { docx } = req.files;

  //Einzigartiger Dateiname
  let filename = uuidv4();
  
  //Pfade
  let folderpath = path.join(__dirname, 'uploads');
  let filepath =  path.join(folderpath, `${filename}.docx`);
  let filepathpdf =  path.join(folderpath, `${filename}.pdf`);

  //Speichert die Datei
  docx.mv(filepath, async function (err) {
    if (err) return res.status(500).send(err);
    await convertToPdf(filepath, folderpath);
    res.setHeader('Content-Type', 'application/pdf');
    res.sendFile(filepathpdf);
  });
});

async function convertToPdf(filepath, folderpath) {
  return new Promise((resolve, reject) => {
    const args = ['--convert-to', 'pdf', filepath, '--outdir', folderpath];
    const child = spawn('soffice', args);
    child.on('error', reject);
    child.on('exit', resolve);
  });
}

app.get('/api/amtsgerichtausplz', async function (req, res){
  try {
    const plzSuche = req.query.plz;

    const url = `https://www.justizadressen.nrw.de/de/justiz/gericht?ang=grundbuch&plz=${plzSuche}&ort=`;
    const page = await fetch(url);
    const html = await page.text();

    const amtsgerichtRegex = /<h6>(.*?)<\/h6>/;
    const amtsgerichtMatch = amtsgerichtRegex.exec(html);
    const amtsgericht = amtsgerichtMatch && amtsgerichtMatch[1];
    
    const straßeRegex = /<strong>Lieferanschrift<\/strong><br>\s*([^<]*)<br>/s;
    const straßeMatch = straßeRegex.exec(html);
    const straße = straßeMatch && straßeMatch[1];
    
    const plzOrtRegex = new RegExp(straße + "<br>\\s*([^<]*?)<br>");
    const plzOrtMatch = plzOrtRegex.exec(html);
    const plzOrt = plzOrtMatch && plzOrtMatch[1];
    
    let [plz, ort] = (plzOrt || '').split(/\s+/).filter(Boolean);
    
    if (!amtsgericht || !straße || !plz || !ort) {
      throw new Error('Die benötigten Informationen konnten nicht aus der Webseite der Justiz extrahiert werden.');
    }
    
    res.send({amtsgericht, straße, plz, ort});
  }catch(error){res.status(500).send(error.message || 'Ein Fehler bei Laden der Daten aus der Webseite der Justiz.');}
});

app.get('*', (req, res) => {
  res.sendFile(path.join(distDir, 'index.html'));
});

app.listen(8080, () => console.log('Server started'));