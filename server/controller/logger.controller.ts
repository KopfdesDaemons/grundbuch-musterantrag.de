import { Request, Response } from 'express';
import { clearLogFile } from '../helpers/log-file.helper';
import { getLogs } from 'server/services/logger.service';

export const deleteLogFile = async (req: Request, res: Response) => {
  await clearLogFile();
  res.status(200).send({ message: 'LogFile.log gelöscht' });
};

export const getLogFile = async (req: Request, res: Response) => {
  const page = parseInt(req.query['page'] as string, 10) || 1;
  const level = typeof req.query['level'] === 'string' ? req.query['level'] : undefined;
  const search = typeof req.query['search'] === 'string' ? req.query['search'] : undefined;
  const grouped = req.query['grouped'] === 'true';

  const logs = await getLogs(page, { level, search, grouped });

  return res.status(200).json(logs);
};
