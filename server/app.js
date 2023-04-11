const express = require('express');
const fileUpload = require('express-fileupload');

const path = require('path');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();


// Middlewares für die gesamte App
app.use(fileUpload());
app.use(express.json());


//Für Sidemap und Robot.txt
var distDir = __dirname + "/../dist/grundbuch";
app.use(express.static(distDir));


//Routen
app.use('/', require('./routes/login'));
app.use('/', require('./routes/amtsgerichtAusPLZ'));
app.use('/', require('./routes/anträge/grundbuchausdruck'));


//Nur zum testen
app.get('/api/test', authMiddleware, (req, res) => {
  res.send('Dies ist eine geschützte Route!');
});

//Alle restlichen Routen zur index.html
app.get('*', (req, res) => {
res.sendFile(path.join(distDir, 'index.html'));
});

app.listen(8080, () => console.log('Server started'));