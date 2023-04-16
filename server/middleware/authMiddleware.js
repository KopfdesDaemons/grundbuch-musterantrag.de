const { promises: fsPromises } = require('fs');
const cookieController = require('../controller/cookieController');

const HASH_FILE_PATH = __dirname + '/../hash.json';

// Middleware für Authentifizierung
const auth = async (req, res, next) => {
  if(!req.headers.cookie) {
    return res.status(401).send('Anmedlung erforderlich!');
  }

  try {
    // Lese JSON Datei
    const data = await fsPromises.readFile(HASH_FILE_PATH, 'utf8');
    const json = JSON.parse(data);

    // Lese Cookie mit Token
    const tokenCookie = cookieController.getCookie('loginToken', req.headers.cookie);

    if (tokenCookie !== json.loginToken) {
      return res.status(401).send('Anmeldung erforderlich!');
    }

    next();
  } catch (err) {
    console.error(`Fehler beim Lesen von ${HASH_FILE_PATH}`, err);
    res.status(500).send('Interner Serverfehler');
  }
};

module.exports = auth;