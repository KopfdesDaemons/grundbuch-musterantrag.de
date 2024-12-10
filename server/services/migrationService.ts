import { UPLOADS_FOLDER_PATH } from "server/config/config";
import * as fs from 'fs';
import path from "path";
import { Upload } from "server/models/upload";
import { Antrag } from "src/app/interfaces/antrag";
import { writeUploadJSON } from "./uploadsService";
import logger from "server/config/logger";
import { checkFileExists } from "./directoryService";

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
            const upload: Upload = new Upload();


            // Nur gleichnamige Parameter übernehmen
            Object.keys(upload).forEach(key => {
                if (key in antrag) {
                    (upload as any)[key] = (antrag as any)[key];
                }
            });


            if (!upload.uploadID) upload.uploadID = folder;
            if (!upload.uploadDate) upload.uploadDate = antrag.datum;
            if (!upload.antragsart) upload.antragsart = antrag.title;

            if (!upload.docxFile) {
                upload.docxFile = await checkFileExists(path.join(UPLOADS_FOLDER_PATH, folder, folder + '.docx'));
            }

            if (!upload.pdfFile) {
                upload.pdfFile = await checkFileExists(path.join(UPLOADS_FOLDER_PATH, folder, folder + '.pdf'));
            }

            writeUploadJSON(upload);
        } catch (error) {
            logger.error('Fehler beim Migration von Antrag zu Uploadinfo beim Ordner ' + folder + ': ', error);
        }
    }
}