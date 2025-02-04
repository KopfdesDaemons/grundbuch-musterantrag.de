import express from 'express';
import { handleCreateUserRole, handleDeleteUserRole, handleGetAllUserRoles, handleGetUserRole, handleUpdateUserRole } from "server/controller/userRolesController";
import { UserRoleManagementAction } from 'server/interfaces/userPermission';
import authMiddleware from 'server/middleware/authMiddleware';
import { verifyRole } from 'server/middleware/verifyUserRoleMiddleware';
import { userRoleManagementPermission } from 'server/models/userPermissons';

export const userRoleRoutes = express.Router();

userRoleRoutes.get('/get-all-user-roles',
    authMiddleware,
    handleGetAllUserRoles
);

userRoleRoutes.put('/',
    authMiddleware,
    verifyRole(
        new userRoleManagementPermission([UserRoleManagementAction.CreateUserRole])
    ),
    handleCreateUserRole
);

userRoleRoutes.patch('/',
    authMiddleware,
    verifyRole(
        new userRoleManagementPermission([UserRoleManagementAction.UpdateUserRole])
    ),
    handleUpdateUserRole
);


userRoleRoutes.get('/',
    authMiddleware,
    verifyRole(
        new userRoleManagementPermission([UserRoleManagementAction.ReadUserRoles])
    ),
    handleGetUserRole
);

userRoleRoutes.delete('/',
    authMiddleware,
    verifyRole(
        new userRoleManagementPermission([UserRoleManagementAction.DeleteUserRole])
    ),
    handleDeleteUserRole
);