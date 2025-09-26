import { Settings } from 'common/models/settings.model';
import { db } from './database.service';
import { RowDataPacket } from 'mysql2/promise';

export class SettingsService {
  static saveSettings = async (settings: Settings): Promise<void> => {
    const upsertQuery = `
        INSERT INTO settings (name, value)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE value = VALUES(value)
        `;

    const settingsArray = Object.entries(settings);
    for (const [name, value] of settingsArray) {
      await db.execute(upsertQuery, [name, value]);
    }
  };

  static getSettings = async (): Promise<Settings> => {
    const selectQuery = `SELECT name, value FROM settings`;
    const [results] = await db.execute<RowDataPacket[]>(selectQuery);

    const settings = new Settings();
    results.forEach((row: RowDataPacket) => {
      switch (row['name']) {
        case 'deleteGeneratedFilesAfterResponse':
          settings.deleteGeneratedFilesAfterResponse = row['value'] === '1';
          break;
        case 'primaryColor':
          settings.primaryColor = row['value'];
          break;
      }
    });
    return settings;
  };

  static getSetting = async (settingName: string): Promise<string | undefined> => {
    const selectQuery = `SELECT value FROM settings WHERE name = ?`;
    const [result] = await db.execute<RowDataPacket[]>(selectQuery, [settingName]);
    return result.length > 0 ? (result[0]['value'] as string) : undefined;
  };
}
