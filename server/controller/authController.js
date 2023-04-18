const { promises: fsPromises } = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const HASH_FILE_PATH = path.join(__dirname + '/../hash.json');
const directoryController = require('./directoryController');

exports.login = async (req, res) => {
    try {
        // Empfange Passwort
        const receivedPassword = req.body.password;

        const fileExists = await directoryController.checkFileExists(HASH_FILE_PATH);
        if(!fileExists) return res.status(500).send('Init erfoderlich');
        
        // Lese JSON Datei
        const file = await fsPromises.readFile(HASH_FILE_PATH, 'utf8');
        const json = JSON.parse(file);

        // Überprüfe Hash aus JSON mit dem Passwort
        const correct = await bcrypt.compare(receivedPassword, json.passwordHash);

        if (correct) {
            // Setze Cookie mit LoginToken

            // Ablaufdatum in 2 Wochen (14 Tage)
            const expiryDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
            res.cookie('loginToken', json.loginToken, { expires: expiryDate });

            res.status(200).send('Login erfolgreich');
        } else {
            res.status(401).send('Falsches Passwort.');
        }
    } catch (error) {
        req.logger.error('Fehler bei der Authentifizierung', error);
        res.status(500).send('Fehler bei der Authentifizierung');
    }
};

exports.createHashFile = async (req, res) => {
    try {
        const password = req.body.password;

        const file = await directoryController.checkFileExists(HASH_FILE_PATH);
        if (file) return res.status(500).send('bereits initalisiert');

        // Generiere Salt für Hashing
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);

        // Erstelle Passwort-Hash
        const passwordHash = await bcrypt.hash(password, salt);

        // Generiere zufälligen Login-Token
        const loginToken = uuidv4();

        // Erstelle JSON-Objekt
        const hashObj = {
            passwordHash,
            loginToken,
        };

        // Schreibe JSON-Objekt in Datei
        await fsPromises.writeFile(HASH_FILE_PATH, JSON.stringify(hashObj));

        res.status(200).send('Init erfolgreich');
        req.logger.info('hash.json erstellt.');
    } catch (error) {
        req.logger.error('Fehler beim Erstellen der hash.json.', error);
        res.status(500).send('Fehler bei der Dateigenerierung');
    }
};