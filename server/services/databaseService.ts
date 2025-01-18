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
        // Tabellen und Spalten definieren
        const tables = [
            {
                name: 'uploads',
                columns: [
                    { name: 'uploadID', type: 'VARCHAR(255) NOT NULL PRIMARY KEY' },
                    { name: 'docxFile', type: 'BOOLEAN NOT NULL DEFAULT FALSE' },
                    { name: 'pdfFile', type: 'BOOLEAN NOT NULL DEFAULT FALSE' },
                    { name: 'filesDeleted', type: 'BOOLEAN NOT NULL DEFAULT FALSE' },
                    { name: 'uploadDate', type: 'DATETIME NOT NULL' },
                    { name: 'antragsart', type: 'VARCHAR(255)' },
                    { name: 'grundbuchamt', type: 'VARCHAR(255)' },
                ]
            },
            {
                name: 'settings',
                columns: [
                    { name: 'name', type: 'VARCHAR(255) NOT NULL PRIMARY KEY' },
                    { name: 'value', type: 'VARCHAR(255)' }
                ]
            },
            {
                name: 'statistic',
                columns: [
                    { name: 'antragsart', type: 'VARCHAR(255) PRIMARY KEY' },
                    { name: 'anzahl', type: 'INT DEFAULT 0' }
                ]
            }
        ];

        for (const table of tables) {
            // Tabelle erstellen, falls sie nicht existiert
            const createTableSQL = `CREATE TABLE IF NOT EXISTS ${table.name} (
                ${table.columns.map(col => `${col.name} ${col.type}`).join(', ')}
            )`;
            await query(createTableSQL, []);
            logger.info(`Tabelle "${table.name}" wurde erstellt bzw. überprüft.`);

            // Spalten überprüfen und bei Bedarf hinzufügen
            for (const column of table.columns) {
                const columnExistsSQL = `SELECT * 
                                        FROM INFORMATION_SCHEMA.COLUMNS 
                                        WHERE TABLE_NAME = '${table.name}' 
                                        AND COLUMN_NAME = '${column.name}'`;

                const columnExists: any = await query(columnExistsSQL, []);

                if (columnExists.length === 0) {
                    const addColumnSQL = `ALTER TABLE ${table.name} ADD ${column.name} ${column.type}`;
                    await query(addColumnSQL, []);
                    logger.info(`Spalte "${column.name}" in Tabelle "${table.name}" wurde hinzugefügt.`);
                }
            }
        }

        logger.info("Datenbank und Tabellen wurden erfolgreich initialisiert bzw. überprüft.");
    } catch (error) {
        logger.error("Fehler bei der Initialisierung der Datenbank:", error);
    }
};