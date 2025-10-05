import { Request, Response } from 'express';
import {
  getRefreshTokenCookieOptions,
  getRefreshTokensByUserID,
  login,
  refreshAccessToken,
  revokeAllRefreshTokensByUserID,
  revokeRefreshToken
} from '../services/auth.service';
import { getUserByUsername } from 'server/services/user.service';
import { User } from 'common/models/user.model';
import { AuthError } from 'server/models/errors/auth-error.model';
import { AuthResponse } from 'common/interfaces/auth-response.interface';
import { validateAndGetUser } from 'server/helpers/validation.helper';
import { verifyToken } from 'server/helpers/jwt.helper';
import { ValidationError } from 'server/models/errors/validation-error.model';
import { PaginatedApiResponse } from 'common/interfaces/pagination-data.interface';
import { Session } from 'common/models/session.model';
import { getSystemTypeFromUserAgent } from 'server/helpers/useragent.helper';

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
  await validateAndGetUser(userID);
  await revokeAllRefreshTokensByUserID(userID);
  res.status(200).json({ message: 'Alle Refresh Tokens erfolgreich gelöscht' });
};

export const handleRevokeSessions = async (req: Request, res: Response) => {
  const { refreshTokensIDs } = req.body;
  if (!req.jwtPayload) throw new AuthError('Kein JWT in der Anfrage', 400);
  const { userID } = req.jwtPayload;
  await validateAndGetUser(userID);
  if (!refreshTokensIDs || !Array.isArray(refreshTokensIDs) || refreshTokensIDs.length === 0) {
    return res.status(400).json({ message: 'Keine RefreshTokensIDs in der Anfrage' });
  }
  for (const id of refreshTokensIDs) {
    if (isNaN(+id)) {
      throw new ValidationError('refreshTokensID muss eine Zahl sein', 400);
    }
    await revokeRefreshToken(+id, userID);
  }
  return res.status(200).json({ message: 'Sessions erfolgreich abgemeldet' });
};

export const handleGetSessions = async (req: Request, res: Response) => {
  if (!req.jwtPayload) throw new AuthError('Kein JWT in der Anfrage', 400);
  const { userID } = req.jwtPayload;
  const page = parseInt(req.query['page'] as string, 10) || 1;

  await validateAndGetUser(userID);
  const paginatedRefreshTokens = await getRefreshTokensByUserID(+userID!, page);
  const sessions = paginatedRefreshTokens.items.map(token => {
    const systemType = getSystemTypeFromUserAgent(token.userAgent);
    return new Session(token.tokenID!, systemType, token.ip, token.creationDate, token.expiryDate);
  });

  const paginatedSessions: PaginatedApiResponse<Session> = {
    page: paginatedRefreshTokens.page,
    totalPages: paginatedRefreshTokens.totalPages,
    totalItems: paginatedRefreshTokens.totalItems,
    items: sessions
  };
  return res.status(200).json(paginatedSessions);
};
