import { SETTINGS_JSON_PATH } from "server/config/config";
import * as fs from 'fs';
import { checkFileExists } from "./directoryService";
import { Settings } from "server/models/settings";


export class SettingsService {
    private static settings: Settings = new Settings();

    private static getSettingsFromJSON = async (): Promise<Settings | null> => {
        if (await checkFileExists(SETTINGS_JSON_PATH)) {
            const json = await fs.promises.readFile(SETTINGS_JSON_PATH, 'utf8');
            const settings = new Settings();
            Object.assign(settings, JSON.parse(json));
            return settings;
        };
        return null;
    };

    static saveSettings = async (settings: Settings): Promise<void> => {
        const formattedData = JSON.stringify(settings, null, 2);
        this.settings = settings;
        await fs.promises.writeFile(SETTINGS_JSON_PATH, formattedData, 'utf-8');
    };

    static initSettings = async (): Promise<void> => {
        const savedSettings = await this.getSettingsFromJSON();
        if (savedSettings) this.settings = savedSettings;
    }

    static getSettings = (): Settings => {
        return this.settings;
    }

    static getSetting = (settingName: string): string => {
        return (this.settings as any)[settingName];
    }
}
