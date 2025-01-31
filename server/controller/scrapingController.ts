import logger from "server/config/logger";
import { amtsgerichtAusPLZ } from "server/services/scrapingService";

export const getAmtsgerichtAusPLZ = async (req: any, res: any) => {
    const plz: string = req.query.plz;
    try {
        const amtsgericht = await amtsgerichtAusPLZ(plz);
        res.json(amtsgericht);
    } catch (error) {
        logger.error('Fehler beim Laden des Grundbuchamts aus dem Justizportal:', error);
        const message = 'Fehler beim Laden des Grundbuchamts aus dem Justizportal für die PLZ:' + plz;
        res.status(500).send({ message: message });
    }
};
