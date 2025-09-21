import { Request, Response } from 'express';
import logger from 'server/config/logger.config';
import { Settings } from 'server/models/settings.model';
import { SettingsService } from 'server/services/settings.service';

export const handleSaveSettings = async (req: Request, res: Response) => {
  if (!req.body || !req.body.settings) {
    return res.status(400).send({ message: 'Keine Settings in der Anfrage gesendet' });
  }

  const settings: Settings = req.body.settings;
  await SettingsService.saveSettings(settings);

  return res.status(200).json(settings);
};

export const handleGetSettings = async (req: Request, res: Response) => {
  const settings = await SettingsService.getSettings();
  return res.status(200).json(settings);
};

export const handleGetPrimaryColor = async (req: Request, res: Response) => {
  const primaryColor = await SettingsService.getSetting('primaryColor');
  if (!primaryColor) logger.info('Setting primaryColor nicht gefunden');
  return res.status(200).json({ primaryColor });
};
