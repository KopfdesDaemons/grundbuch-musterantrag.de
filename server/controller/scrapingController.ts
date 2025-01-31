import logger from "server/config/logger";
import { amtsgerichtAusPLZ } from "server/services/scrapingService";
import { Request, Response } from 'express';

export const getAmtsgerichtAusPLZ = async (req: Request, res: Response) => {
    const plz: string = req.query["plz"] as string;
    try {
        const amtsgericht = await amtsgerichtAusPLZ(plz);
        return res.json(amtsgericht);
    } catch (error) {
        logger.error('Fehler beim Laden des Grundbuchamts aus dem Justizportal:', error);
        const message = 'Fehler beim Laden des Grundbuchamts aus dem Justizportal für die PLZ:' + plz;
        return res.status(500).send({ message: message });
    }
};
