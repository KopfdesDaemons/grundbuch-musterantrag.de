
exports.amtsgerichtausplz = async (req, res) => {
    try {
        const plzSuche = req.query.plz;

        const url = `https://www.justizadressen.nrw.de/de/justiz/gericht?ang=grundbuch&plz=${plzSuche}&ort=`;
        const page = await fetch(url);
        const html = await page.text();

        const amtsgerichtRegex = /<h6>(.*?)<\/h6>/;
        const amtsgerichtMatch = amtsgerichtRegex.exec(html);
        const amtsgericht = amtsgerichtMatch && amtsgerichtMatch[1];

        const straßeRegex = /<strong>Lieferanschrift<\/strong><br>\s*([^<]*)<br>/s;
        const straßeMatch = straßeRegex.exec(html);
        const straße = straßeMatch && straßeMatch[1];

        const plzOrtRegex = new RegExp(straße + "<br>\\s*([^<]*?)<br>");
        const plzOrtMatch = plzOrtRegex.exec(html);
        const plzOrt = plzOrtMatch && plzOrtMatch[1];

        let [plz, ort] = (plzOrt || '').split(/\s+/).filter(Boolean);

        if (!amtsgericht || !straße || !plz || !ort) {
            throw new Error('Die benötigten Informationen konnten nicht aus der Webseite der Justiz extrahiert werden.');
        }

        res.send({ amtsgericht, straße, plz, ort });
    } catch (error) { res.status(500).send(error.message || 'Ein Fehler bei Laden der Daten aus der Webseite der Justiz.'); }
};