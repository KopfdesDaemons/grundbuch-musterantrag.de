import { User } from 'common/models/user.model';
import { addNewUser, deleteUser, getAllUsers, setNewInitalPassword, updateUsername, updateUserRole } from 'server/services/user.service';
import { Request, Response } from 'express';
import { validateAndGetUser, validateAndGetUserRole, validateNewUsername } from 'server/helpers/validation.helper';
import { getHashFromString } from 'server/helpers/hash.helper';
import { getRefreshTokensByUserID, revokeAllRefreshTokensByUserID, revokeRefreshToken } from 'server/services/auth.service';
import { Session } from 'common/models/session.model';
import { PaginatedApiResponse } from 'common/interfaces/pagination-data.interface';
import { getSystemTypeFromUserAgent } from 'server/helpers/useragent.helper';
import { ValidationError } from 'server/models/errors/validation-error.model';

export const handleCreateUser = async (req: Request, res: Response) => {
  const { username, password, userRoleID } = req.body;
  if (!username || !password || !userRoleID) {
    return res.status(400).json({ message: 'Unvollständige Anfrage' });
  }
  await validateNewUsername(username);

  const userRole = await validateAndGetUserRole(userRoleID);

  const newUser = new User(username, userRole, +userRoleID);
  newUser.passwordHash = await getHashFromString(password);
  await addNewUser(newUser);
  return res.status(201).json({ message: `User ${username} erfolgreich erstellt` });
};

export const handleDeleteUser = async (req: Request, res: Response) => {
  const { userIDs } = req.body;
  if (!userIDs || !Array.isArray(userIDs) || userIDs.length === 0) {
    return res.status(400).json({ message: 'Keine UserIDs in der Anfrage' });
  }

  for (const userID of userIDs) {
    await validateAndGetUser(userID);
  }

  await deleteUser(userIDs.map(id => +id));
  return res.status(200).json({ message: `User ${userIDs.toString()} erfolgreich gelöscht` });
};

export const handleGetAllUsers = async (req: Request, res: Response) => {
  const page = parseInt(req.query['page'] as string, 10) || 1;

  const users = await getAllUsers(page);
  return res.status(200).json(users);
};

export const handleUpdateUsername = async (req: Request, res: Response) => {
  const { userID, newUsername } = req.body;
  if (!userID || !newUsername) {
    return res.status(400).json({ message: 'Unvollständige Anfrage' });
  }

  await validateAndGetUser(userID);
  await validateNewUsername(newUsername);

  await updateUsername(+userID, newUsername);
  return res.status(200).json({ message: 'Username erfolgreich aktualisiert' });
};

export const handleSetInitialPassword = async (req: Request, res: Response) => {
  const { userID, newPassword } = req.body;
  if (!userID || !newPassword) {
    return res.status(400).json({ message: 'Unvollständige Anfrage' });
  }

  const userFromDB = await validateAndGetUser(userID);

  userFromDB.passwordHash = await getHashFromString(newPassword);
  if (userFromDB.passwordHash) {
    await setNewInitalPassword(+userID, userFromDB.passwordHash);
    return res.status(200).json({ message: 'Initialpasswort erfolgreich aktualisiert' });
  }
  throw new Error('Fehler beim Setzen des Initialpasswords');
};

export const handleUpdateUserRole = async (req: Request, res: Response) => {
  const { userID, userRoleID } = req.body;
  if (!userID || !userRoleID) {
    return res.status(400).json({ message: 'Unvollständige Anfrage' });
  }

  await validateAndGetUser(userID);
  await validateAndGetUserRole(userRoleID);

  await updateUserRole(+userID, +userRoleID);
  return res.status(200).json({ message: 'Userrolle erfolgreich aktualisiert' });
};

export const handleGetUserSessions = async (req: Request, res: Response) => {
  const userID = req.query['userID'];
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

export const handleRevokeAllSessions = async (req: Request, res: Response) => {
  const { userID } = req.body;
  await validateAndGetUser(userID);
  await revokeAllRefreshTokensByUserID(+userID!);
  return res.status(200).json({ message: 'Alle Sessions erfolgreich abgemeldet' });
};

export const handleRevokeSessions = async (req: Request, res: Response) => {
  const { refreshTokensIDs, userID } = req.body;
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
