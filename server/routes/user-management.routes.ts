import {
  handleCreateUser,
  handleDeleteUser,
  handleGetAllUsers,
  handleSetInitialPassword,
  handleUpdateUsername,
  handleUpdateUserRole
} from 'server/controller/user-management.controller';
import express from 'express';
import { UserManagementAction } from 'server/interfaces/user-permission.interface';
import authMiddleware from 'server/middleware/auth.middleware';
import { verifyRole } from 'server/middleware/verify-user-role.middleware';
import { userManagementPermission } from 'server/models/user-permissons.model';
import { handleSetPassword } from 'server/controller/user-settings.controller';

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

userManagementRoutes.patch('/updatepassword', handleSetPassword);

userManagementRoutes.patch(
  '/userrole',
  authMiddleware,
  verifyRole(new userManagementPermission([UserManagementAction.UpdateUserRole])),
  handleUpdateUserRole
);
