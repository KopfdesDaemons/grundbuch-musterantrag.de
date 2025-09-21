import { Request, Response } from 'express';
import { clearLogFile, readLogFile } from '../helpers/log-file.helper';

export const deleteLogFile = async (req: Request, res: Response) => {
  await clearLogFile();
  res.status(200).send({ message: 'LogFile.log gelöscht' });
};

export const getLogFile = async (req: Request, res: Response) => {
  const logs = await readLogFile();

  if (logs.length === 0) {
    return res.status(204).send('Keine Serverlogs');
  }

  return res.status(200).json(logs);
};
