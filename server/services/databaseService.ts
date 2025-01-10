import logger from "server/config/logger";

const mysql = require('mysql2');

const dbConfig = {
    host: 'db',
    user: process.env["MYSQL_USER"],
    password: process.env["MYSQL_PASSWORD"],
};

const db = mysql.createPool({
    ...dbConfig,
    database: 'grundbuch-musterantrag'
});

export const query = <T = unknown>(sql: string, params: (string | boolean | Date | number)[]): Promise<T> => {
    return new Promise((resolve, reject) => {
        db.query(sql, params, (err: any, results: T) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

export const initializeDatabase = async () => {
    try {
        // Erstelle die Datenbank, falls sie nicht existiert
        const createDatabaseSQL = `CREATE DATABASE IF NOT EXISTS \`grundbuch-musterantrag\``;
        await new Promise<void>((resolve, reject) => {
            db.query(createDatabaseSQL, (err: any) => {
                if (err) return reject(err);
                resolve();
            });
        });

        // Erstelle Tabellen in der Datenbank
        const createUploadTableSQL = `
        CREATE TABLE IF NOT EXISTS uploads (
            uploadID VARCHAR(255) PRIMARY KEY,
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
