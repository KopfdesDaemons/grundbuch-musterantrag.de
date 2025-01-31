import logger from "server/config/logger";
import { migrateFromAntragToUploadinfo, migrateFromJSONFilesToDatabase } from "server/services/migrationService"

export const handleMigrationFromAntragToUploadinfo = async (req: any, res: any) => {
    try {
        await migrateFromAntragToUploadinfo();
        logger.info('Migration von Antrag zu Uploadinfo erfolgreich.');
        res.status(200).send({ message: 'Migration von Antrag zu Uploadinfo erfolgreich.' });
    } catch (error: any) {
        logger.error('Migration von Antrag zu Uploadinfo fehlgeschlagen: ', error);
        res.status(500).send({ message: 'Migration von Antrag zu Uploadinfo fehlgeschlagen: ' + error.message });
    }
}

export const handleMigrateFromJSONFilesToDatabase = async (req: any, res: any) => {
    try {
        await migrateFromJSONFilesToDatabase();
        logger.info('Migration von JSON zu Datenbank erfolgreich.');
        res.status(200).send({ message: 'Migration von JSON zu Datenbank erfolgreich.' });
    } catch (error: any) {
        logger.error('Migration von JSON zu Datenbank fehlgeschlagen: ', error);
        res.status(500).send({ message: 'Migration von JSON zu Datenbank fehlgeschlagen: ' + error.message });
    }
}