import { amtsgerichtAusPLZ } from 'server/services/scraping.service';
import { Request, Response } from 'express';

export const getAmtsgerichtAusPLZ = async (req: Request, res: Response) => {
  const plz: string = req.query['plz'] as string;
  const amtsgericht = await amtsgerichtAusPLZ(plz);
  return res.json(amtsgericht);
};
