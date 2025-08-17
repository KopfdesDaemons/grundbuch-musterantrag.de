import logger from 'server/config/logger.config';
import { User } from 'server/models/user.model';
import {
  addNewUser,
  deleteUser,
  getAllUsers,
  getUserByUserID,
  getUserByUsername,
  setNewInitalPassword,
  updateUsername,
  updateUserRole
} from 'server/services/user.service';
import { Request, Response } from 'express';
import { getUserRole } from 'server/services/user-role.service';

export const handleCreateUser = async (req: Request, res: Response) => {
  const { username, password, userRoleID } = req.body;
  try {
    if (!username || !password || !userRoleID) {
      return res.status(400).json({ message: 'Unvollständige Anfrage' });
    }
    if (isNaN(+userRoleID)) {
      return res.status(400).json({ message: 'userRoleID muss eine Zahl sein' });
    }
    const userFromDB = await getUserByUsername(username);
    if (userFromDB) {
      return res.status(400).json({ message: 'User ' + username + ' existiert bereits' });
    }
    const userRole = await getUserRole(userRoleID);
    if (!userRole) {
      return res.status(400).json({ message: 'Userrolle ' + userRoleID + ' existiert nicht' });
    }

    const newUser = new User(username, userRole, userRoleID);
    await newUser.setPasswordHash(password);
    await addNewUser(newUser);
    return res.status(201).json({ message: 'User ' + username + ' erfolgreich erstellt' });
  } catch (error) {
    logger.error('Fehler beim Erstellen des Users ' + username, error);
    return res.status(500).json({ message: 'Fehler beim Erstellen des Users ' + username });
  }
};

export const handleDeleteUser = async (req: Request, res: Response) => {
  const { userIDs } = req.body;
  try {
    if (!userIDs) {
      return res.status(400).json({ message: 'Keine UserID in der Anfrage' });
    }
    for (const userID of userIDs) {
      if (isNaN(+userID)) {
        return res.status(400).json({ message: 'UserID muss eine Zahl sein' });
      }
      const userFromDB = await getUserByUserID(+userID);
      if (!userFromDB) {
        return res.status(400).json({ message: 'UserID ' + userID + ' existiert nicht' });
      }
    }

    await deleteUser(userIDs);
    return res.status(200).json({ message: 'User ' + userIDs.toString() + ' erfolgreich gelöscht' });
  } catch (error) {
    logger.error('Fehler beim Löschen der User ' + userIDs.toString(), error);
    return res.status(500).json({ message: 'Fehler beim Löschen des Users ' + userIDs.toString() });
  }
};

export const handleGetAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    return res.status(200).json(users);
  } catch (error) {
    logger.error('Fehler beim Abrufen aller Users', error);
    return res.status(500).json({ message: 'Fehler beim Abrufen aller User' });
  }
};

export const handleUpdateUsername = async (req: Request, res: Response) => {
  const { userID, newUsername } = req.body;
  try {
    if (!userID || !newUsername) {
      return res.status(400).json({ message: 'Unvollständige Anfrage' });
    }
    if (isNaN(+userID)) {
      return res.status(400).json({ message: 'UserID muss eine Zahl sein' });
    }
    const userFromDB = await getUserByUserID(+userID);
    if (!userFromDB) {
      return res.status(400).json({ message: 'UserID ' + userID + ' existiert nicht' });
    }
    const userFromDBwithNewUsername = await getUserByUsername(newUsername);
    if (userFromDBwithNewUsername) {
      return res.status(400).json({ message: 'Username ' + newUsername + ' existiert bereits' });
    }
    await updateUsername(+userID, newUsername);
    return res.status(200).json({ message: 'Username erfolgreich aktualisiert' });
  } catch (error) {
    logger.error('Fehler beim Aktualisieren des Usernamens', error);
    return res.status(500).json({ message: 'Fehler beim Aktualisieren des Usernamens' });
  }
};

export const handleSetInitialPassword = async (req: Request, res: Response) => {
  const { userID, newPassword } = req.body;
  try {
    if (!userID || !newPassword) {
      return res.status(400).json({ message: 'Unvollständige Anfrage' });
    }
    if (isNaN(+userID)) {
      return res.status(400).json({ message: 'UserID muss eine Zahl sein' });
    }
    const userFromDB = await getUserByUserID(+userID);
    if (!userFromDB) {
      return res.status(400).json({ message: 'Fehlerhafte Anfrage' });
    }
    await userFromDB.setPasswordHash(newPassword);
    if (userFromDB.passwordHash) {
      await setNewInitalPassword(userID, userFromDB.passwordHash);
      return res.status(200).json({ message: 'Initialpasswort erfolgreich aktualisiert' });
    }
    throw new Error('Fehler beim Setzen des Initialpasswords');
  } catch (error) {
    logger.error('Fehler beim Setzen des Initialpasswords', error);
    return res.status(500).json({ message: 'Fehler beim Setzen des Initialpasswords' });
  }
};

export const handleUpdateUserRole = async (req: Request, res: Response) => {
  const { userID, userRoleID } = req.body;
  try {
    if (!userID || !userRoleID) {
      return res.status(400).json({ message: 'Unvollständige Anfrage' });
    }
    if (isNaN(+userID)) {
      return res.status(400).json({ message: 'UserID muss eine Zahl sein' });
    }
    if (isNaN(+userRoleID)) {
      return res.status(400).json({ message: 'userRoleID muss eine Zahl sein' });
    }
    const userFromDB = await getUserByUserID(+userID);
    if (!userFromDB) {
      return res.status(400).json({ message: 'UserID ' + userID + ' existiert nicht' });
    }
    await updateUserRole(userID, userRoleID);
    return res.status(200).json({ message: 'Userrolle erfolgreich aktualisiert' });
  } catch (error) {
    logger.error('Fehler beim Aktualisieren der Userrolle', error);
    return res.status(500).json({ message: 'Fehler beim Aktualisieren der Userrolle' });
  }
};
