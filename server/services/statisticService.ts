import { Statistic } from "server/interfaces/statistic";
import { query } from "./databaseService";

export const getStatistic = async (): Promise<Statistic> => {
    let statistic: Statistic = {};

    const readQuery = 'SELECT antragsart, anzahl FROM statistic';
    const result: { antragsart: string; anzahl: number }[] = await query<{ antragsart: string; anzahl: number }[]>(readQuery, []);

    result.forEach(row => {
        statistic[row.antragsart] = row.anzahl;
    });

    return statistic;
};

export const updateStatistic = async (antragsart: string, numberOfDifferences: number): Promise<void> => {

    const exists = await query<{ antragsart: string; anzahl: number }[]>(
        'SELECT antragsart, anzahl FROM statistic WHERE antragsart = ?',
        [antragsart]
    );

    if (exists.length > 0) {
        // Statistik aktualisieren
        const currentCount = exists[0].anzahl;
        const updateQuery = `UPDATE statistic SET anzahl = ? WHERE antragsart = ?`;
        await query(updateQuery, [currentCount + numberOfDifferences, antragsart]);
    } else {
        // Statistik einfügen
        if (numberOfDifferences < 0) numberOfDifferences = 0;
        const insertQuery = `INSERT INTO statistic (antragsart, anzahl) VALUES (?, ?)`;
        await query(insertQuery, [antragsart, numberOfDifferences]);
    }
};

export const clearStatistic = async (): Promise<void> => {
    await query('DELETE FROM statistic', []);
};
