import { Settings } from "server/models/settings";
import { query } from "./databaseService";

export class SettingsService {

    static saveSettings = async (settings: Settings): Promise<void> => {
        const upsertQuery = `
        INSERT INTO settings (name, value)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE value = VALUES(value)
        `;

        const settingsArray = Object.entries(settings);
        for (const [name, value] of settingsArray) {
            await query(upsertQuery, [name, value]);
        }
    };

    static getSettings = async (): Promise<Settings> => {
        const selectQuery = `SELECT name, value FROM settings`;
        const result = await query<{ name: string; value: string }[]>(selectQuery);

        const settings = new Settings();
        result.forEach(row => {
            switch (row.name) {
                case "deleteGeneratedFilesAfterResponse":
                    settings.deleteGeneratedFilesAfterResponse = row.value === "1";
                    break;
                case "primaryColor":
                    settings.primaryColor = row.value;
                    break;
            }
        });
        return settings;
    };

    static getSetting = async (settingName: string): Promise<string | undefined> => {
        const selectQuery = `SELECT value FROM settings WHERE name = ?`;
        const result = await query<{ value: string }[]>(selectQuery, [settingName]);
        return result.length > 0 ? result[0].value : undefined;
    };
}