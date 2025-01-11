import logger from "server/config/logger";
import mysql from 'mysql2';


const db = mysql.createPool({
    host: 'db',
    user: process.env["MYSQL_USER"],
    password: process.env["MYSQL_PASSWORD"],
    database: 'grundbuch-musterantrag'
});

export const query = <T>(sql: string, params: (string | boolean | Date | number)[]): Promise<T> => {
    return new Promise((resolve, reject) => {
        db.query(sql, params, (err, results) => {
            if (err) return reject(err);
            resolve(results as T);
        });
    });
};

export const initializeDatabase = async () => {
    try {
        // Erstelle Tabellen in der Datenbank
        const createUploadTableSQL = `
        CREATE TABLE IF NOT EXISTS uploads (
            uploadID VARCHAR(255) NOT NULL PRIMARY KEY,
            docxFile BOOLEAN NOT NULL DEFAULT FALSE,
            pdfFile BOOLEAN NOT NULL DEFAULT FALSE,
            filesDeleted BOOLEAN NOT NULL DEFAULT FALSE,
            uploadDate DATETIME NOT NULL,
            antragsart VARCHAR(255) NOT NULL,
            grundbuchamt VARCHAR(255) NOT NULL
        )`;
        await query(createUploadTableSQL, []);


        const createSettingsTableSQL = `
        CREATE TABLE IF NOT EXISTS settings (
            name VARCHAR(255) NOT NULL PRIMARY KEY,
            value VARCHAR(255) NOT NULL
        )`;
        await query(createSettingsTableSQL, []);


        const createStatisticTableSQL = `
        CREATE TABLE IF NOT EXISTS statistic (
            antragsart VARCHAR(255) PRIMARY KEY,
            anzahl INT NOT NULL
        )`;
        await query(createStatisticTableSQL, []);


        logger.info("Datenbank und Tabellen wurden erfolgreich initialisiert.");
    } catch (error) {
        logger.error("Fehler bei der Initialisierung der Datenbank:", error);
    }
};
