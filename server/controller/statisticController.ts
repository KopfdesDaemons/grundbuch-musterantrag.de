import path from "path";
import { fileURLToPath } from "url";
import { checkFileExists } from "./directoryController";
import { Request, Response } from "express";
import * as fs from 'fs';

const SERVER_DIST_FOLDER = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_FOLDER_PATH = path.join(SERVER_DIST_FOLDER, '/uploads');
const STATISTIC_JSON_PATH = path.join(SERVER_DIST_FOLDER, 'statistic.json');

interface Statistic {
    [key: string]: number;
}

export const readStatisticJSON = async (): Promise<Statistic> => {
    try {
        let statistic: Statistic = {};

        // Überprüfe, ob die statistik.json existiert, und lese sie aus
        if (await checkFileExists(STATISTIC_JSON_PATH)) {
            const json = await fs.promises.readFile(STATISTIC_JSON_PATH, 'utf8');
            if (!json) return {};
            statistic = JSON.parse(json) as Statistic;
        }

        return statistic;
    } catch (error: any) {
        throw new Error("Fehler beim Lesen der Statistikdatei: " + error.message);
    }
};

export const changeStatistic = async (req: Request, res: Response, antragsart: string, amount: number): Promise<void> => {
    try {
        const statistic: Statistic = await readStatisticJSON();

        // Erhöhe die Anzahl der angegebenen Antragsart
        statistic[antragsart] = (statistic[antragsart] || 0) + amount;

        // Schreibe die statistik.json neu
        const formattedData = JSON.stringify(statistic, null, 2);
        await fs.promises.writeFile(STATISTIC_JSON_PATH, formattedData, 'utf-8');

    } catch (error) {
        req.logger.error("Fehler beim Ändern der Statistik:", error);
    }
};

export const getStatistic = async (req: Request, res: Response): Promise<void> => {
    try {
        const statistic: Statistic = await readStatisticJSON();
        res.status(200).json(statistic);
    } catch (error) {
        req.logger.error("Fehler beim Abrufen der Statistik:", error);
        res.status(500).json({ error: "Fehler beim Abrufen der Statistik" });
    }
};

export const generateStatisticFromFiles = async (req: Request, res: Response): Promise<void> => {
    const statistic: Statistic = {};

    try {
        await searchFiles();

        // Schreibe die statistik.json neu
        const formattedData = JSON.stringify(statistic, null, 2);
        await fs.promises.writeFile(STATISTIC_JSON_PATH, formattedData, 'utf-8');
        res.status(200).json(statistic);
    } catch (error) {
        req.logger.error('Fehler beim Durchsuchen der Dateien:', error);
        res.status(500).json({ error: 'Fehler beim Durchsuchen der Dateien' });
    }

    async function searchFiles(): Promise<void> {
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
    };
};
