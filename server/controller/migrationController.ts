import logger from "server/config/logger";
import { migrateFromAntragToUploadinfo } from "server/services/migrationService"

export const handleMigrationFromAntragToUploadinfo = async (req: any, res: any) => {
    try {
        await migrateFromAntragToUploadinfo();
        logger.info('Migration von Antrag zu Uploadinfo erfolgreich.');
        res.status(200).send('Migration von Antrag zu Uploadinfo erfolgreich.');
    } catch (error: any) {
        logger.error('Migration von Antrag zu Uploadinfo fehlgeschlagen: ', error);
        res.status(500).send('Migration von Antrag zu Uploadinfo fehlgeschlagen: ' + error.message);
    }
}