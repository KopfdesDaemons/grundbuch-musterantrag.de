import { UserRole } from 'server/interfaces/user-role.interface';
import { addUserRole, deleteUserRole, getAllUserRoles, updateUserRole } from 'server/services/user-role.service';
import { Request, Response } from 'express';
import { validateAndGetUser, validateAndGetUserRole } from 'server/helpers/validation.helper';

export const handleGetAllUserRoles = async (req: Request, res: Response) => {
  const userRoles = await getAllUserRoles();
  return res.status(200).json(userRoles);
};

export const handleGetUserRole = async (req: Request, res: Response) => {
  const userRoleID = req.query['userRoleID'] as string;
  const userRole = await validateAndGetUserRole(userRoleID);
  return res.status(200).json(userRole);
};

export const handleUpdateUserRole = async (req: Request, res: Response) => {
  const { userRole } = req.body;
  await validateAndGetUserRole(userRole.userRoleID);
  await updateUserRole(userRole);
  return res.status(200).json({ message: 'Userrolle erfolgreich aktualisiert' });
};

export const handleCreateUserRole = async (req: Request, res: Response) => {
  const { userRole } = req.body;
  const newUserRole = userRole as UserRole;

  if (!newUserRole.name) {
    return res.status(400).json({ message: 'Der Name darf nicht leer sein' });
  }

  const userRoleID = await addUserRole(newUserRole);
  return res.status(200).json({ message: 'Userrolle erfolgreich erstellt', userRoleID });
};

export const handleDeleteUserRole = async (req: Request, res: Response) => {
  const { userRoleIDs } = req.body;

  if (!userRoleIDs || !Array.isArray(userRoleIDs)) {
    return res.status(400).json({ message: 'Unvollständige oder ungültige Anfrage, erwartet wird ein Array von IDs' });
  }

  for (const userRoleID of userRoleIDs) await validateAndGetUserRole(userRoleID);

  try {
    await deleteUserRole(userRoleIDs);
  } catch (error) {
    if (error instanceof Error && error?.message.includes('Es gibt noch Benutzer')) {
      return res.status(409).json({ message: error.message });
    } else throw error;
  }
  return res.status(200).json({ message: 'Userrollen erfolgreich gelöscht' });
};

export const handleGetOwnUserRoleName = async (req: Request, res: Response) => {
  const { jwtPayload } = req;
  if (!jwtPayload) {
    return res.status(400).json({ message: 'Kein JWT in der Anfrage' });
  }
  const userID = jwtPayload['userID'];
  const user = await validateAndGetUser(userID);
  const userRoleName = user.userRole.name;
  const userRoleDescription = user.userRole.description;
  return res.status(200).json({ message: 'Userrolle erfolgreich geladen', userRoleName, userRoleDescription });
};
