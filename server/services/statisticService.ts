import path from "path";
import * as fs from 'fs';
import { STATISTIC_JSON_PATH, UPLOADS_FOLDER_PATH } from "server/config/config";
import { checkFileExists } from "./directoryService";
import { Statistic } from "server/interfaces/statistic";

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

    for (const content of folderContent) {
        const filePath = path.join(UPLOADS_FOLDER_PATH, content);
        const stat = await fs.promises.stat(filePath);

        if (stat.isDirectory()) {
            // Prüfen, ob eine JSON-Datei mit dem Namen des Ordners existiert
            const jsonFilePath = path.join(filePath, `${content}.json`);
            if (fs.existsSync(jsonFilePath)) {
                const data = JSON.parse(await fs.promises.readFile(jsonFilePath, 'utf-8'));
                const title = data.title;
                if (title) {
                    statistic[title] = (statistic[title] || 0) + 1;
                }
            }
        }
    }

    // Schreibe die statistik.json neu
    const formattedData = JSON.stringify(statistic, null, 2);
    await fs.promises.writeFile(STATISTIC_JSON_PATH, formattedData, 'utf-8');
};