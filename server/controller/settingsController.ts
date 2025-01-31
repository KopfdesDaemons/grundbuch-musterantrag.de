import { Request, Response } from 'express';
import logger from 'server/config/logger';
import { Settings } from 'server/models/settings';
import { SettingsService } from 'server/services/settingsService';


export const handleSaveSettings = async (req: Request, res: Response) => {
    try {
        if (!req.body || !req.body.settings) {
            return res.status(400).send({ message: 'Keine Settings in der Anfrage gesendet' });
        }

        const settings: Settings = req.body.settings;
        await SettingsService.saveSettings(settings);


        return res.status(200).json(settings);
    } catch (error) {
        logger.error('Fehler beim Speichern der Einstellungen:', error);
        return res.status(500).send({ message: 'Interner Serverfehler' });
    }
};

export const handleGetSettings = async (req: Request, res: Response) => {
    try {
        const settings = await SettingsService.getSettings();
        return res.status(200).json(settings);
    } catch (error) {
        logger.error('Fehler beim Laden der Einstellungen:', error);
        return res.status(500).send({ message: 'Interner Serverfehler' });
    }
};

export const handleGetPrimaryColor = async (req: Request, res: Response) => {
    try {
        const setting = await SettingsService.getSetting('primaryColor');
        if (!setting) logger.info('Setting primaryColor nicht gefunden');
        return res.status(200).send(setting);
    } catch (error) {
        logger.error('Fehler beim Laden der Primärfarbe:', error);
        return res.status(500).send({ message: 'Interner Serverfehler' });
    }
}