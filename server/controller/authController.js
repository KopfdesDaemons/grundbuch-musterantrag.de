const { promises: fsPromises } = require('fs');
const bcrypt = require('bcrypt');
const HASH_FILE_PATH = __dirname + '/../hash.json';

exports.login = async (req, res) => {
    try {
        // Empfange Passwort
        const receivedPassword = req.body.password;

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
        console.log(error);
        res.status(500).send('Fehler bei der Authentifizierung');
    }
};