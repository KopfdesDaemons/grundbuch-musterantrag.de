import * as fs from 'fs';
import { LOG_FILE_PATH } from '../config/path.config';
import { Log } from 'common/models/log.model';
import { isLogEntry } from './type-guards.helper';

export const clearLogFile = async (): Promise<void> => {
  await fs.promises.writeFile(LOG_FILE_PATH, '');
};

export const readLogFile = async (): Promise<Log[]> => {
  const data = await fs.promises.readFile(LOG_FILE_PATH, 'utf8');

  if (data === '') {
    return [];
  }

  // Trenne die JSON-Zeilen und füge sie zu einem Array zusammen
  const logs = data
    .trim()
    .split('\n')
    .map(line => {
      try {
        const object: unknown = JSON.parse(line);
        if (isLogEntry(object)) {
          return new Log(object.level, object.message, new Date(object.timestamp), object.stack, object.route);
        }
        return null;
      } catch (error) {
        console.error('Invalid JSON:', line, error);
        return null;
      }
    })
    .filter(log => log !== null);

  return logs.reverse();
};
