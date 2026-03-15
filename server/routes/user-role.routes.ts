import express from 'express';
import {
  handleCreateUserRole,
  handleDeleteUserRole,
  handleGetAllUserRoles,
  handleGetUserRole,
  handleUpdateUserRole
} from 'server/controller/user-roles.controller';
import { UserRoleManagementAction } from 'common/interfaces/user-permission.interface';
import { authMiddleware } from 'server/middleware/auth.middleware';
import { verifyRole } from 'server/middleware/verify-user-role.middleware';
import { UserRoleManagementPermission } from 'common/models/user-permissions.model';

export const userRoleRoutes = express.Router();

userRoleRoutes.get('/get-all-user-roles', authMiddleware, handleGetAllUserRoles);

userRoleRoutes.put(
  '/',
  authMiddleware,
  verifyRole(new UserRoleManagementPermission([UserRoleManagementAction.CreateUserRole])),
  handleCreateUserRole
);

userRoleRoutes.patch(
  '/',
  authMiddleware,
  verifyRole(new UserRoleManagementPermission([UserRoleManagementAction.UpdateUserRole])),
  handleUpdateUserRole
);

userRoleRoutes.get('/', authMiddleware, verifyRole(new UserRoleManagementPermission([UserRoleManagementAction.ReadUserRoles])), handleGetUserRole);

userRoleRoutes.delete(
  '/',
  authMiddleware,
  verifyRole(new UserRoleManagementPermission([UserRoleManagementAction.DeleteUserRole])),
  handleDeleteUserRole
);
