import logger from "server/config/logger";
import { migrateFromAntragToUploadinfo } from "server/services/migrationService"

export const handleMigrationFromAntragToUploadinfo = async (req: any, res: any) => {
    try {
        await migrateFromAntragToUploadinfo();
        logger.info('Migration from Antrag to Uploadinfo erfolgreich.');
        res.status(200).send('Migration from Antrag to Uploadinfo erfolgreich.');
    } catch (error: any) {
        logger.error('Migration from Antrag to Uploadinfo fehlgeschlagen: ', error);
        res.status(500).send('Migration from Antrag to Uploadinfo fehlgeschlagen: ' + error.message);
    }
}