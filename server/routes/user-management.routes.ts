import {
  handleCreateUser,
  handleDeleteUser,
  handleGetAllUsers,
  handleGetUserSessions,
  handleSetInitialPassword,
  handleUpdateUsername,
  handleUpdateUserRole
} from 'server/controller/user-management.controller';
import express from 'express';
import { UserManagementAction } from 'common/interfaces/user-permission.interface';
import { authMiddleware } from 'server/middleware/auth.middleware';
import { verifyRole } from 'server/middleware/verify-user-role.middleware';
import { userManagementPermission } from 'common/models/user-permissons.model';
import { handleSetPasswordAfterInitalLogin } from 'server/controller/user-settings.controller';

export const userManagementRoutes = express.Router();

userManagementRoutes.get('/', authMiddleware, verifyRole(new userManagementPermission([UserManagementAction.ReadUser])), handleGetAllUsers);

userManagementRoutes.put('/', authMiddleware, verifyRole(new userManagementPermission([UserManagementAction.CreateUser])), handleCreateUser);

userManagementRoutes.delete('/', authMiddleware, verifyRole(new userManagementPermission([UserManagementAction.DeleteUser])), handleDeleteUser);

userManagementRoutes.patch(
  '/username',
  authMiddleware,
  verifyRole(new userManagementPermission([UserManagementAction.UpdateUsername])),
  handleUpdateUsername
);

userManagementRoutes.patch(
  '/setinitialpassword',
  authMiddleware,
  verifyRole(new userManagementPermission([UserManagementAction.SetInitialPassword])),
  handleSetInitialPassword
);

userManagementRoutes.patch('/updatepassword', handleSetPasswordAfterInitalLogin);

userManagementRoutes.patch(
  '/userrole',
  authMiddleware,
  verifyRole(new userManagementPermission([UserManagementAction.UpdateUserRole])),
  handleUpdateUserRole
);

userManagementRoutes.get(
  '/sessions',
  authMiddleware,
  verifyRole(new userManagementPermission([UserManagementAction.ReadUser])),
  handleGetUserSessions
);
