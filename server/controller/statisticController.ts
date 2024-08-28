import { Request, Response } from "express";
import { generateStatisticFromFiles, readStatisticJSON } from "server/services/statisticService";
import logger from "server/config/logger";
import { Statistic } from "server/interfaces/statistic";


export const generateStatistic = async (req: Request, res: Response): Promise<void> => {
    try {
        generateStatisticFromFiles();
        res.status(200).json();
    } catch (error) {
        logger.error('Fehler bei der Generierung ders Statistik aus den Dateien:', error);
        res.status(500).json({ error: 'Fehler bei der Generierung ders Statistik aus den Dateien' });
    }
};

export const getStatistic = async (req: Request, res: Response): Promise<void> => {
    try {
        const statistic: Statistic = await readStatisticJSON();
        res.status(200).json(statistic);
    } catch (error) {
        logger.error("Fehler beim Abrufen der Statistik:", error);
        res.status(500).json({ error: "Fehler beim Abrufen der Statistik" });
    }
};
