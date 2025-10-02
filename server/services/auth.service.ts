import { createToken } from 'server/helpers/jwt.helper';
import { AuthError } from 'server/models/errors/auth-error.model';
import { RefreshToken } from 'server/models/refresh-token.model';
import { User } from 'server/models/user.model';
import { db } from './database.service';
import { IS_PRODUCTION } from 'server/config/env.config';
import { RowDataPacket } from 'mysql2';

const refreshTokenLifetimeInMS = 21 * 24 * 60 * 60 * 1000; // 21 days
const accessTokenLifetimeInMS = 5 * 60 * 1000; // 5 minutes

export const login = async (
  user: User,
  password: string,
  userAgent: string,
  ip: string
): Promise<{ accessToken: string; refreshToken: string; accessTokenExpiryDate: Date; refreshTokenExpiryDate: Date }> => {
  const passwordIsCorrect = await user.comparePassword(password);
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
  await refreshToken.setTokenHash(token);
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

export const getRefreshTokensByUserID = async (userID: number): Promise<RefreshToken[]> => {
  const query =
    'SELECT tokenID, userID, tokenHash, userAgent, ip, creationDate, expiryDate, isRevoked FROM refresh_tokens WHERE isRevoked = 0 AND userID = ?';
  const [tokens] = await db.execute<RowDataPacket[]>(query, [userID]);

  if (!tokens || tokens.length === 0) return [];

  return tokens.map(token => {
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

  const activeRefreshTokens = await getRefreshTokensByUserID(user.userID);
  if (activeRefreshTokens.length === 0) throw new AuthError('Keine aktiven Sessions gefunden. Bitte neu anmelden.', 401);

  let matchedToken: RefreshToken | undefined;

  for (const token of activeRefreshTokens) {
    if (await token.compareTokens(oldRefreshTokenString)) {
      matchedToken = token;
      break;
    }
  }

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
