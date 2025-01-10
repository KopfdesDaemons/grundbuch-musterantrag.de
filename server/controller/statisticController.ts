import { Request, Response } from "express";
import { getStatistic } from "server/services/statisticService";
import logger from "server/config/logger";
import { Statistic } from "server/interfaces/statistic";


export const handleGetStatistic = async (req: Request, res: Response): Promise<void> => {
    try {
        const statistic: Statistic = await getStatistic();
        res.status(200).json(statistic);
    } catch (error) {
        logger.error("Fehler beim Abrufen der Statistik:", error);
        res.status(500).json({ error: "Fehler beim Abrufen der Statistik" });
    }
};
