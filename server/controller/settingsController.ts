import { Request, Response } from 'express';
import logger from 'server/config/logger';
import { Settings } from 'server/models/settings';
import { SettingsService } from 'server/services/settingsService';


export const handleSaveSettings = async (req: Request, res: Response) => {
    try {
        if (!req.body || !req.body.settings) {
            return res.status(400).send('Keine Settings in der Anfrage gesendet');
        }

        const settings: Settings = req.body.settings;
        await SettingsService.saveSettings(settings);


        return res.status(200).json(settings);
    } catch (error) {
        logger.error('Fehler beim Speichern der Einstellungen:', error);
        return res.status(500).send('Interner Serverfehler');
    }
};

export const handleGetSettings = async (req: Request, res: Response) => {
    try {
        const settings = SettingsService.getSettings();
        return res.status(200).json(settings);
    } catch (error) {
        logger.error('Fehler beim Laden der Einstellungen:', error);
        return res.status(500).send('Interner Serverfehler');
    }
};