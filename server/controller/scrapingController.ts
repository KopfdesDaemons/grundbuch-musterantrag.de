import { amtsgerichtAusPLZ } from "server/services/scrapingService";

export const getAmtsgerichtAusPLZ = async (req: any, res: any) => {
    try {
        const plz: string = req.query.plz;
        const amtsgericht = await amtsgerichtAusPLZ(plz);

        res.json(amtsgericht);
    } catch (error: any) {
        res.status(500).send(error.message || 'Fehler beim Laden der Daten aus der Webseite der Justiz.');
    }
};
