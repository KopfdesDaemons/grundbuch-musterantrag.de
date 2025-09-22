import { User } from 'server/models/user.model';
import { addNewUser, deleteUser, getAllUsers, setNewInitalPassword, updateUsername, updateUserRole } from 'server/services/user.service';
import { Request, Response } from 'express';
import { validateAndGetUser, validateAndGetUserRole, validateNewUsername } from 'server/helpers/validation.helper';

export const handleCreateUser = async (req: Request, res: Response) => {
  const { username, password, userRoleID } = req.body;
  if (!username || !password || !userRoleID) {
    return res.status(400).json({ message: 'Unvollständige Anfrage' });
  }
  await validateNewUsername(username);

  const userRole = await validateAndGetUserRole(userRoleID);

  const newUser = new User(username, userRole, +userRoleID);
  await newUser.setPasswordHash(password);
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
  const users = await getAllUsers();
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

  await userFromDB.setPasswordHash(newPassword);
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
