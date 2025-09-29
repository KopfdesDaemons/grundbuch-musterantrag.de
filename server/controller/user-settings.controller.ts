import { Request, Response } from 'express';
import { validateAndGetUser, validateNewPasswort, validateNewUsername } from 'server/helpers/validation.helper';
import { revokeAllRefreshTokensByUserID } from 'server/services/auth.service';
import { getUserByUsername, getUsername, updatePassword, updateUsername } from 'server/services/user.service';

export const handleGetOwnUsername = async (req: Request, res: Response) => {
  const { jwtPayload } = req;
  if (!jwtPayload) {
    return res.status(400).json({ message: 'Kein JWT in der Anfrage' });
  }
  const userID = jwtPayload['userID'];
  const username = await getUsername(userID);
  if (!username) {
    return res.status(400).json({ message: 'Benutzer nicht gefunden' });
  }
  return res.status(200).json({ message: 'Username erfolgreich geladen', username });
};

export const handleSetPasswordAfterInitalLogin = async (req: Request, res: Response) => {
  const { username, oldPassword, newPassword } = req.body;
  if (!username || !newPassword || !oldPassword) {
    return res.status(400).json({ message: 'Unvollständige Anfrage' });
  }
  const userFromDB = await getUserByUsername(username);
  if (!userFromDB) {
    return res.status(400).json({ message: 'Fehlerhafte Anfrage' });
  }
  const isCorrectPassword = await userFromDB.comparePassword(oldPassword);
  if (!isCorrectPassword) {
    return res.status(400).json({ message: 'Falsches Passwort' });
  }
  validateNewPasswort(newPassword);
  await userFromDB.setPasswordHash(newPassword);
  if (userFromDB.passwordHash) {
    if (userFromDB.userID) {
      await updatePassword(userFromDB.userID, userFromDB.passwordHash);
      return res.status(200).json({ message: 'Userpasswort erfolgreich aktualisiert' });
    }
  }
  throw new Error('Fehler beim Setzen des Passworts');
};

export const handleChangeOwnUsername = async (req: Request, res: Response) => {
  const { newUsername } = req.body;
  if (!newUsername) {
    return res.status(400).json({ message: 'Unvollständige Anfrage' });
  }
  if (!req.jwtPayload) {
    return res.status(401).json({ message: 'Nicht autorisiert' });
  }
  const { userID } = req.jwtPayload;
  await validateAndGetUser(userID);
  await validateNewUsername(newUsername);
  await updateUsername(userID, newUsername);
  return res.status(200).json({ message: 'Username erfolgreich aktualisiert' });
};

export const handleChangeOwnPassword = async (req: Request, res: Response) => {
  const { oldPassword, newPassword } = req.body;
  if (!newPassword || !oldPassword) {
    return res.status(400).json({ message: 'Unvollständige Anfrage' });
  }
  if (!req.jwtPayload) {
    return res.status(401).json({ message: 'Nicht autorisiert' });
  }
  const { userID } = req.jwtPayload;
  const userFromDB = await validateAndGetUser(userID);
  const isCorrectPassword = await userFromDB.comparePassword(oldPassword);
  if (!isCorrectPassword) {
    return res.status(400).json({ message: 'Falsches Passwort' });
  }
  validateNewPasswort(newPassword);
  await userFromDB.setPasswordHash(newPassword);

  await revokeAllRefreshTokensByUserID(userID);

  if (userFromDB.passwordHash) {
    if (userFromDB.userID) {
      await updatePassword(userFromDB.userID, userFromDB.passwordHash);
      return res.status(200).json({ message: 'Userpasswort erfolgreich aktualisiert' });
    }
  }
  throw new Error('Fehler beim Setzen des Passworts');
};
