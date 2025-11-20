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
import { userRoleManagementPermission } from 'common/models/user-permissions.model';

export const userRoleRoutes = express.Router();

userRoleRoutes.get('/get-all-user-roles', authMiddleware, handleGetAllUserRoles);

userRoleRoutes.put(
  '/',
  authMiddleware,
  verifyRole(new userRoleManagementPermission([UserRoleManagementAction.CreateUserRole])),
  handleCreateUserRole
);

userRoleRoutes.patch(
  '/',
  authMiddleware,
  verifyRole(new userRoleManagementPermission([UserRoleManagementAction.UpdateUserRole])),
  handleUpdateUserRole
);

userRoleRoutes.get('/', authMiddleware, verifyRole(new userRoleManagementPermission([UserRoleManagementAction.ReadUserRoles])), handleGetUserRole);

userRoleRoutes.delete(
  '/',
  authMiddleware,
  verifyRole(new userRoleManagementPermission([UserRoleManagementAction.DeleteUserRole])),
  handleDeleteUserRole
);
