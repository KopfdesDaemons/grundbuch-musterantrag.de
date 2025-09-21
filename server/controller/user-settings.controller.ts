import { Request, Response } from 'express';
import logger from 'server/config/logger.config';
import { ValidationError, validateNewUsername } from 'server/helpers/validation.helper';
import { getUserByUserID, getUserByUsername, getUsername, updatePassword, updateUsername } from 'server/services/user.service';

export const handleGetOwnUsername = async (req: Request, res: Response) => {
  try {
    const { jwtPayload } = req;
    if (!jwtPayload) {
      return res.status(400).json({ message: 'Kein JWT in der Anfrage' });
    }
    const userID = jwtPayload.userID;
    const username = await getUsername(userID);
    if (!username) {
      return res.status(400).json({ message: 'Kein Benutzer gefunden' });
    }
    return res.status(200).json({ message: 'Username erfolgreich geladen', username });
  } catch (error) {
    logger.error('Fehler beim Abrufen des eigenen Usernamens:', error);
    return res.status(500).json({ message: 'Fehler beim Abrufen des eigenen Usernamens' });
  }
};

export const handleSetPassword = async (req: Request, res: Response) => {
  const { username, oldPassword, newPassword } = req.body;
  try {
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
    await userFromDB.setPasswordHash(newPassword);
    if (userFromDB.passwordHash) {
      if (userFromDB.userID) {
        await updatePassword(userFromDB.userID, userFromDB.passwordHash);
        return res.status(200).json({ message: 'Userpasswort erfolgreich aktualisiert' });
      }
    }
    throw new Error('Fehler beim Setzen des Passworts');
  } catch (error) {
    logger.error('Fehler beim Setzen des Passworts', error);
    return res.status(500).json({ message: 'Fehler beim Setzen des Passworts' });
  }
};

export const handleChangeOwnUsername = async (req: Request, res: Response) => {
  const { newUsername } = req.body;
  try {
    if (!newUsername) {
      return res.status(400).json({ message: 'Unvollständige Anfrage' });
    }
    const { userID } = req.jwtPayload;
    const userFromDB = await getUserByUserID(userID);
    if (!userFromDB) {
      return res.status(400).json({ message: 'User nicht gefunden' });
    }
    await validateNewUsername(newUsername);
    await updateUsername(userID, newUsername);
    return res.status(200).json({ message: 'Username erfolgreich aktualisiert' });
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    logger.error('Fehler beim Aktualisieren des Usernamens', error);
    return res.status(500).json({ message: 'Fehler beim Aktualisieren des Usernamens' });
  }
};

export const handleChangeOwnPassword = async (req: Request, res: Response) => {
  const { oldPassword, newPassword } = req.body;
  try {
    if (!newPassword || !oldPassword) {
      return res.status(400).json({ message: 'Unvollständige Anfrage' });
    }
    const { userID } = req.body.jwtPayload;
    const userFromDB = await getUserByUserID(userID);
    if (!userFromDB) {
      return res.status(400).json({ message: 'User nicht gefunden' });
    }
    const isCorrectPassword = await userFromDB.comparePassword(oldPassword);
    if (!isCorrectPassword) {
      return res.status(400).json({ message: 'Falsches Passwort' });
    }
    await userFromDB.setPasswordHash(newPassword);
    if (userFromDB.passwordHash) {
      if (userFromDB.userID) {
        await updatePassword(userFromDB.userID, userFromDB.passwordHash);
        return res.status(200).json({ message: 'Userpasswort erfolgreich aktualisiert' });
      }
    }
    throw new Error('Fehler beim Setzen des Passworts');
  } catch (error) {
    logger.error('Fehler beim Setzen des Passworts', error);
    return res.status(500).json({ message: 'Fehler beim Setzen des Passworts' });
  }
};
