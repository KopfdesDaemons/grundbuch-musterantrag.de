import { UPLOADS_FOLDER_PATH } from "server/config/config";
import * as fs from 'fs';
import path from "path";
import { Upload } from "server/models/upload";
import { Antrag } from "src/app/interfaces/antrag";
import { writeUploadJSON } from "./uploadsService";
import logger from "server/config/logger";

/**
 * Migration von Antrag zu Uploadinfo
 * (Struktur der JSON-Datein im jeweiligen Uploads-Ordner wird geupdatet)
 */
export const migrateFromAntragToUploadinfo = async (): Promise<void> => {
    const uploadsFolders = await fs.promises.readdir(UPLOADS_FOLDER_PATH);

    for (const folder of uploadsFolders) {
        try {
            const JSONPath = path.join(UPLOADS_FOLDER_PATH, folder, folder + '.json');
            const file = await fs.promises.readFile(JSONPath, 'utf8');
            const antrag: Antrag = JSON.parse(file) as Antrag;
            const upload: Upload = JSON.parse(file) as Upload;

            if (!upload.uploadID) upload.uploadID = folder;
            if (!upload.uploadDate) upload.uploadDate = antrag.datum;
            if (!upload.antragsart) upload.antragsart = antrag.title;

            writeUploadJSON(upload);
        } catch (error) {
            logger.error('Fehler beim Migration von Antrag zu Uploadinfo beim Ordner ' + folder + ': ', error);
        }
    }
}