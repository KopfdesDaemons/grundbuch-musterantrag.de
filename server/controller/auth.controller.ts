import { Request, Response } from 'express';
import { getRefreshTokenCookieOptions, login, refreshAccessToken, revokeAllRefreshTokensByUserID } from '../services/auth.service';
import { getUserByUsername } from 'server/services/user.service';
import { User } from 'server/models/user.model';
import { AuthError } from 'server/models/errors/auth-error.model';
import { AuthResponse } from 'common/interfaces/auth-response.interface';
import { validateAndGetUser } from 'server/helpers/validation.helper';
import { verifyToken } from 'server/helpers/jwt.helper';

export const handleLogin = async (req: Request, res: Response) => {
  const { username, password, userAgent } = req.body;
  if (!username || !password || !userAgent) throw new AuthError('Anmeldedaten unvollständig', 401);

  const ip = req.ip;
  if (!ip) throw new AuthError('IP-Adresse nicht gefunden', 500);

  const user: User | null = await getUserByUsername(username);
  if (!user) throw new AuthError('Ungültige Anmeldedaten', 401);

  if (user.isInitialPassword) {
    return res.status(401).json({ message: 'Passwortänderung erforderlich', userName: user.username });
  }

  const { accessToken, refreshToken, accessTokenExpiryDate, refreshTokenExpiryDate } = await login(user, password, userAgent, ip);

  const response: AuthResponse = {
    accessToken: accessToken,
    accessTokenExpiryDate: accessTokenExpiryDate,
    refreshTokenExpiryDate: refreshTokenExpiryDate
  };

  res.cookie('refresh_token', refreshToken, getRefreshTokenCookieOptions());
  return res.json(response);
};

export const handleRefreshToken = async (req: Request, res: Response) => {
  const oldRefreshToken = req.cookies['refresh_token'];
  const userAgent = req.query['userAgent'] as string;

  const { userID } = await verifyToken(oldRefreshToken);
  const user = await validateAndGetUser(userID);

  const ip = req.ip;

  if (!oldRefreshToken) throw new AuthError('Refresh Token fehlt. Bitte neu anmelden.', 401);
  if (!ip) throw new AuthError('IP-Adresse nicht gefunden', 500);
  if (!userAgent) throw new AuthError('User Agent fehlt', 400);

  const { accessToken, refreshToken, accessTokenExpiryDate, refreshTokenExpiryDate } = await refreshAccessToken(oldRefreshToken, user, userAgent, ip);

  res.cookie('refresh_token', refreshToken, getRefreshTokenCookieOptions());

  const authResponse: AuthResponse = {
    accessToken: accessToken,
    accessTokenExpiryDate: accessTokenExpiryDate,
    refreshTokenExpiryDate: refreshTokenExpiryDate
  };

  return res.json(authResponse);
};

export const handleLogoutEverywhere = async (req: Request, res: Response) => {
  if (!req.jwtPayload) throw new AuthError('Kein JWT in der Anfrage', 400);
  const { userID } = req.jwtPayload;
  if (!userID) throw new AuthError('UserID fehlt', 400);
  await revokeAllRefreshTokensByUserID(userID);
  res.status(200).json({ message: 'Alle Refresh Tokens erfolgreich gelöscht' });
};
