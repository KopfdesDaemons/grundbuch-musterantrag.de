import { UserRole } from 'server/interfaces/user-role.interface';
import { ValidationError } from 'server/models/errors/validation-error.model';
import { User } from 'server/models/user.model';
import { getUserRole } from 'server/services/user-role.service';
import { getUserByUserID, getUserByUsername } from 'server/services/user.service';

export const validateAndGetUserRole = async (userRoleID: any): Promise<UserRole> => {
  if (isNaN(+userRoleID)) {
    throw new ValidationError('userRoleID muss eine Zahl sein');
  }
  const userRole = await getUserRole(+userRoleID);
  if (!userRole) {
    throw new ValidationError(`Userrolle ${userRoleID} existiert nicht`, 404);
  }
  return userRole;
};

export const validateNewUsername = async (username: any): Promise<void> => {
  if (typeof username !== 'string' || username.trim().length === 0) {
    throw new ValidationError('Username darf nicht nur aus Leerzeichen bestehen.');
  }
  const userFromDB = await getUserByUsername(username);
  if (userFromDB) {
    throw new ValidationError(`User ${username} existiert bereits`, 409);
  }
};

export const validateAndGetUser = async (userID: any): Promise<User> => {
  if (isNaN(+userID)) {
    throw new ValidationError('UserID muss eine Zahl sein');
  }
  const user = await getUserByUserID(+userID);
  if (!user) {
    throw new ValidationError(`UserID ${userID} existiert nicht`, 404);
  }
  return user;
};
