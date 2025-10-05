import { createToken } from 'server/helpers/jwt.helper';
import { AuthError } from 'server/models/errors/auth-error.model';
import { RefreshToken } from 'server/models/refresh-token.model';
import { User } from 'common/models/user.model';
import { db } from './database.service';
import { IS_PRODUCTION } from 'server/config/env.config';
import { RowDataPacket } from 'mysql2';
import { compareStringsAndHash, getHashFromString } from 'server/helpers/hash.helper';
import { PaginatedApiResponse } from 'common/interfaces/pagination-data.interface';

const refreshTokenLifetimeInMS = 21 * 24 * 60 * 60 * 1000; // 21 days
const accessTokenLifetimeInMS = 5 * 60 * 1000; // 5 minutes

export const login = async (
  user: User,
  password: string,
  userAgent: string,
  ip: string
): Promise<{ accessToken: string; refreshToken: string; accessTokenExpiryDate: Date; refreshTokenExpiryDate: Date }> => {
  if (!user.passwordHash) throw new AuthError('Ungültige Anmeldedaten', 401);
  const passwordIsCorrect = await compareStringsAndHash(password, user.passwordHash);
  if (!passwordIsCorrect) throw new AuthError('Ungültige Anmeldedaten', 401);
  if (!user.userID) throw new AuthError('Ungültige Anmeldedaten', 401);

  const refreshToken = await createAndSaveRefreshToken(user, userAgent, ip);
  const accessToken = getNewAccessToken(user);
  const accessTokenExpiryDate = new Date(Date.now() + accessTokenLifetimeInMS);
  const refreshTokenExpiryDate = new Date(Date.now() + refreshTokenLifetimeInMS);

  return {
    accessToken: accessToken,
    refreshToken: refreshToken,
    accessTokenExpiryDate: accessTokenExpiryDate,
    refreshTokenExpiryDate: refreshTokenExpiryDate
  };
};

const getNewAccessToken = (user: User): string => {
  if (!user.userID) throw new Error('No User ID');
  return createToken({ userID: user.userID, userRoleID: user.userRoleID }, accessTokenLifetimeInMS.toString());
};

const createAndSaveRefreshToken = async (user: User, userAgent: string, ip: string): Promise<string> => {
  if (!user.userID) throw new Error('No User ID');
  const expireDate = new Date(Date.now() + refreshTokenLifetimeInMS);
  const refreshToken = new RefreshToken(user.userID, '', new Date(), expireDate, userAgent, ip);
  const token = createToken({ userID: user.userID }, refreshTokenLifetimeInMS.toString());
  refreshToken.tokenHash = await getHashFromString(token);
  await saveRefreshToken(refreshToken);
  return token;
};

export const updateRefreshToken = async (token: RefreshToken): Promise<void> => {
  const query = 'UPDATE refresh_tokens SET tokenHash = ?, userAgent = ?, ip = ?, creationDate = ?, expiryDate = ?, isRevoked = ? WHERE tokenID = ?';
  await db.execute(query, [token.tokenHash, token.userAgent, token.ip, token.creationDate, token.expiryDate, token.isRevoked, token.tokenID]);
};

export const saveRefreshToken = async (token: RefreshToken): Promise<void> => {
  const query =
    'INSERT INTO refresh_tokens (tokenID, userID, tokenHash, userAgent, ip, creationDate, expiryDate, isRevoked) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?)';
  await db.execute(query, [token.userID, token.tokenHash, token.userAgent, token.ip, token.creationDate, token.expiryDate, token.isRevoked]);
};

export const getRefreshTokenCookieOptions = (): { httpOnly: boolean; secure: boolean; sameSite: 'lax'; expires: Date } => {
  return {
    httpOnly: IS_PRODUCTION,
    secure: IS_PRODUCTION,
    sameSite: 'lax',
    expires: new Date(Date.now() + refreshTokenLifetimeInMS)
  };
};

export const getRefreshTokensByUserID = async (userID: number, page: number = 1): Promise<PaginatedApiResponse<RefreshToken>> => {
  if (page < 1) throw new Error('Die Seitennummer muss größer oder gleich 1 sein.');
  const pageSize: number = 30;
  const offset = (page - 1) * pageSize;

  const query = `SELECT tokenID, userID, tokenHash, userAgent, ip, creationDate, expiryDate, isRevoked FROM refresh_tokens WHERE isRevoked = 0 AND userID = ? ORDER BY tokenID DESC LIMIT ${pageSize} OFFSET ${offset}`;
  const [rows] = await db.execute<RowDataPacket[]>(query, [userID]);

  const tokens: RefreshToken[] = rows.map(token => {
    const refreshToken = new RefreshToken(
      token['userID'],
      token['tokenHash'],
      new Date(token['creationDate']),
      new Date(token['expiryDate']),
      token['userAgent'],
      token['ip']
    );
    refreshToken.tokenID = token['tokenID'];
    refreshToken.isRevoked = token['isRevoked'];
    refreshToken.tokenHash = token['tokenHash'];
    return refreshToken;
  });

  // Gesamtanzahl der Dateien berechnen
  const countQuery = `SELECT COUNT(*) AS totalFiles FROM refresh_tokens WHERE isRevoked = 0 AND userID = ?`;
  const [countResult] = await db.execute<RowDataPacket[]>(countQuery, [userID]);
  const totalItems = countResult[0]['totalFiles'] as number;
  const totalPages = Math.ceil(totalItems / pageSize);

  return {
    page: page,
    totalPages: totalPages,
    totalItems: totalItems,
    items: tokens
  };
};

export const revokeAllRefreshTokensByUserID = async (userID: number): Promise<void> => {
  const query = 'UPDATE refresh_tokens SET isRevoked = 1 WHERE userID = ?';
  await db.execute(query, [userID]);
};

export const refreshAccessToken = async (
  oldRefreshTokenString: string,
  user: User,
  userAgent: string,
  ip: string
): Promise<{ accessToken: string; refreshToken: string; accessTokenExpiryDate: Date; refreshTokenExpiryDate: Date }> => {
  if (!user.userID) throw new Error('No User ID');

  let matchedToken: RefreshToken | undefined;
  let currentPage = 1;
  let totalPages = 1;

  do {
    const paginatedResponse = await getRefreshTokensByUserID(user.userID, currentPage);
    if (paginatedResponse.totalItems === 0 && currentPage === 1) {
      throw new AuthError('Keine aktiven Sessions gefunden. Bitte neu anmelden.', 401);
    }
    totalPages = paginatedResponse.totalPages;

    for (const token of paginatedResponse.items) {
      if (await compareStringsAndHash(oldRefreshTokenString, token.tokenHash!)) {
        matchedToken = token;
        break;
      }
    }
    currentPage++;
  } while (currentPage <= totalPages && !matchedToken);

  if (!matchedToken) {
    throw new AuthError('Ungültiges Refresh Token. Bitte neu anmelden.', 401);
  }
  matchedToken.isRevoked = true;
  await updateRefreshToken(matchedToken);

  // Create new tokens
  const newAccessToken = getNewAccessToken(user);
  const newAccessTokenExpiryDate = new Date(Date.now() + accessTokenLifetimeInMS);
  const newRefreshToken = await createAndSaveRefreshToken(user, userAgent, ip);
  const newRefreshTokenExpiryDate = new Date(Date.now() + refreshTokenLifetimeInMS);

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    accessTokenExpiryDate: newAccessTokenExpiryDate,
    refreshTokenExpiryDate: newRefreshTokenExpiryDate
  };
};

export const revokeRefreshToken = async (refreshTokenID: number, userID: number): Promise<void> => {
  const query = 'UPDATE refresh_tokens SET isRevoked = 1 WHERE tokenID = ? AND userID = ?';
  await db.execute(query, [refreshTokenID, userID]);
};
