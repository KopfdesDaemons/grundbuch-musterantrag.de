import logger from "server/config/logger";

export const amtsgerichtAusPLZ = async (plz: string): Promise<{ amtsgericht: string; straße: string; plz: string; ort: string }> => {
    try {
        const url = `https://www.justizadressen.nrw.de/de/justiz/gericht?ang=grundbuch&plz=${plz}&ort=`;
        const response = await fetch(url);
        const html = await response.text();

        const amtsgerichtRegex = /<h6>(.*?)<\/h6>/;
        const amtsgerichtMatch = amtsgerichtRegex.exec(html);
        const amtsgericht = amtsgerichtMatch && amtsgerichtMatch[1];

        const straßeRegex = /<strong>Lieferanschrift<\/strong><br>\s*([^<]*)<br>/s;
        const straßeMatch = straßeRegex.exec(html);
        const straße = straßeMatch && straßeMatch[1];

        const plzOrtRegex = new RegExp(straße + "<br>\\s*([^<]*?)<br>");
        const plzOrtMatch = plzOrtRegex.exec(html);
        const plzOrt = plzOrtMatch && plzOrtMatch[1];

        let [plzAmtsgericht, ort] = (plzOrt || '').split(/\s+/).filter(Boolean);

        if (!amtsgericht || !straße || !plzAmtsgericht || !ort) {
            throw new Error('Die Daten des Grundbuchamts konten nicht aus dem Justizportal geladen werden für die PLZ: ' + plz);
        }

        return ({ amtsgericht, straße, plz: plzAmtsgericht, ort });
    } catch (error: any) {
        logger.error('Fehler beim Scraping:', error);
        throw error;
    }
};
