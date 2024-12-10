import path from "path";
import * as fs from 'fs';
import { STATISTIC_JSON_PATH, UPLOADS_FOLDER_PATH } from "server/config/config";
import { checkFileExists } from "./directoryService";
import { Statistic } from "server/interfaces/statistic";
import { Upload } from "server/models/upload";
import { log } from "console";
import logger from "server/config/logger";

export const readStatisticJSON = async (): Promise<Statistic> => {
    let statistic: Statistic = {};

    // Überprüfe, ob die statistik.json existiert, und lese sie aus
    if (await checkFileExists(STATISTIC_JSON_PATH)) {
        const json = await fs.promises.readFile(STATISTIC_JSON_PATH, 'utf8');
        if (!json) return {};
        statistic = JSON.parse(json) as Statistic;
    }

    return statistic;
};

export const clearStatistic = async (): Promise<void> => {
    await fs.promises.writeFile(STATISTIC_JSON_PATH, '');
}

export const changeStatistic = async (antragsart: string, amount: number): Promise<void> => {
    const statistic: Statistic = await readStatisticJSON();

    // Erhöhe die Anzahl der angegebenen Antragsart
    statistic[antragsart] = (statistic[antragsart] || 0) + amount;

    // Schreibe die statistik.json neu
    const formattedData = JSON.stringify(statistic, null, 2);
    await fs.promises.writeFile(STATISTIC_JSON_PATH, formattedData, 'utf-8');
};

export const generateStatisticFromFiles = async (): Promise<void> => {
    const statistic: Statistic = {};

    const folderContent = await fs.promises.readdir(UPLOADS_FOLDER_PATH);

    for (const subFolder of folderContent) {
        const subfolderPath = path.join(UPLOADS_FOLDER_PATH, subFolder);
        const stat = await fs.promises.stat(subfolderPath);

        if (stat.isDirectory()) {
            const JSONPath = path.join(subfolderPath, subFolder + '.json');
            if (!await checkFileExists(JSONPath)) continue;
            const file = await fs.promises.readFile(JSONPath, 'utf8');
            const upload: Upload = JSON.parse(file) as Upload;
            statistic[upload.antragsart] = (statistic[upload.antragsart] || 0) + 1;
        }
    }

    // Schreibe die statistik.json neu
    const formattedData = JSON.stringify(statistic, null, 2);
    await fs.promises.writeFile(STATISTIC_JSON_PATH, formattedData, 'utf-8');
    logger.info('Statistik neu generiert');
};