const express = require('express');
const { promises: fsPromises } = require('fs');

const router = express.Router();

const TOKEN_FILE_PATH = __dirname + '/../token.json';

router.route('/api/login').post( async (req, res) => {
  try {
    const receivedPassword = req.body.password;

    //Lese JSON Datei
    const file = await fsPromises.readFile(TOKEN_FILE_PATH, 'utf8');
    const json = JSON.parse(file);

    if (receivedPassword === json.password) {
      res.cookie(`token`, json.token);
      res.status(200).send('Login erfolgreich');
    } else {
      res.status(401).send('Falsches Passwort.');
    }
  } catch (error) {
    console.log(error);
    res.status(500).send('Fehler beim Laden von JSON.');
  }
});

module.exports = router;