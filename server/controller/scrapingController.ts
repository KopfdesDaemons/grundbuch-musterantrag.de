import { amtsgerichtAusPLZ } from "server/services/scrapingService";

export const getAmtsgerichtAusPLZ = async (req: any, res: any) => {
    const plz: string = req.query.plz;
    try {
        const amtsgericht = await amtsgerichtAusPLZ(plz);

        res.json(amtsgericht);
    } catch (error: any) {
        res.status(500).send(error.message || 'Fehler beim Laden des Grundbuchamts aus dem Justizportal für die PLZ:' + plz);
    }
};
