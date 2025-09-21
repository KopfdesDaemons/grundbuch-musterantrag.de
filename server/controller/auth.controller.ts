import { Request, Response } from 'express';
import { login, verifyToken } from '../services/auth.service';
import { getUserByUsername } from 'server/services/user.service';
import { User } from 'server/models/user.model';

export const handleLogin = async (req: Request, res: Response): Promise<any> => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(401).json({ message: 'Anmeldedaten unvollständig' });
  }

  const user: User | null = await getUserByUsername(username);
  if (!user) {
    return res.status(403).json({ message: 'Ungültige Anmeldedaten' });
  }

  let token: string;
  try {
    token = await login(user, password);
  } catch (error) {
    if (error instanceof Error && error.message === 'Ungültige Anmeldedaten') {
      return res.status(403).json({ message: 'Ungültige Anmeldedaten' });
    } else throw error;
  }

  if (user.isInitialPassword) {
    return res.status(401).json({ message: 'Passwortänderung erforderlich', userName: user.username });
  }

  return res.json({ token: token, username: user.username, userRoleName: user.userRole.name });
};

export const checkToken = async (req: Request, res: Response) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401).send({ message: 'Unauthorized' });

  try {
    await verifyToken(token);
    return res.status(200).send({ message: 'Authorized' });
  } catch (error) {
    if (error instanceof Error && error.message === 'Token ungültig') {
      return res.sendStatus(403);
    } else throw error;
  }
};
