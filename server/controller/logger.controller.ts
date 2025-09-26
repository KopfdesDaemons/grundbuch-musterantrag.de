import { Request, Response } from 'express';
import { clearLogFile } from '../helpers/log-file.helper';
import { getLogs } from 'server/services/logger.service';

export const deleteLogFile = async (req: Request, res: Response) => {
  await clearLogFile();
  res.status(200).send({ message: 'LogFile.log gelöscht' });
};

export const getLogFile = async (req: Request, res: Response) => {
  const page = parseInt(req.query['page'] as string, 10) || 1;

  const logs = await getLogs(page);

  if (!logs) {
    return res.status(204).send('Keine Serverlogs');
  }

  return res.status(200).json(logs);
};
