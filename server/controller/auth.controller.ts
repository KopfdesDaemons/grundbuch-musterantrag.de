import { Request, Response } from 'express';
import { login, verifyToken } from '../services/auth.service';
import { getUserByUsername } from 'server/services/user.service';
import { User } from 'server/models/user.model';
import { AuthError } from 'server/models/errors/auth-error.model';

export const handleLogin = async (req: Request, res: Response): Promise<any> => {
  const { username, password } = req.body;
  if (!username || !password) throw new AuthError('Anmeldedaten unvollständig', 401);

  const user: User | null = await getUserByUsername(username);
  if (!user) throw new AuthError('Ungültige Anmeldedaten', 401);

  const token = await login(user, password);

  if (user.isInitialPassword) {
    return res.status(401).json({ message: 'Passwortänderung erforderlich', userName: user.username });
  }

  return res.json({ token: token, username: user.username, userRoleName: user.userRole.name });
};

export const checkToken = async (req: Request, res: Response) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) throw new AuthError('Unauthorized', 401);

  await verifyToken(token);
  return res.status(200).send({ message: 'Authorized' });
};
