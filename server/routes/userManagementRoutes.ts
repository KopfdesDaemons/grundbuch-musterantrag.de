import { handleCreateUser, handleDeleteUser, handleGetAllUsers, handleSetInitialPassword, handleUpdateUsername, handleUpdateUserRole } from "server/controller/userManagementController";
import express from 'express';
import { UserManagementAction } from "server/interfaces/userPermission";
import authMiddleware from "server/middleware/authMiddleware";
import { verifyRole } from "server/middleware/verifyUserRoleMiddleware";
import { userManagementPermission } from "server/models/userPermissons";
import { handleSetPassword } from "server/controller/userSettingsController";

export const userManagementRoutes = express.Router();

userManagementRoutes.get('/',
    authMiddleware,
    verifyRole(
        new userManagementPermission([UserManagementAction.ReadUser])),
    handleGetAllUsers
);

userManagementRoutes.put('/',
    authMiddleware,
    verifyRole(
        new userManagementPermission([UserManagementAction.CreateUser])),
    handleCreateUser
);

userManagementRoutes.delete('/',
    authMiddleware,
    verifyRole(
        new userManagementPermission([UserManagementAction.DeleteUser])),
    handleDeleteUser
);

userManagementRoutes.patch('/username',
    authMiddleware,
    verifyRole(
        new userManagementPermission([UserManagementAction.UpdateUsername])),
    handleUpdateUsername
);

userManagementRoutes.patch('/setinitialpassword',
    authMiddleware,
    verifyRole(
        new userManagementPermission([UserManagementAction.SetInitialPassword])),
    handleSetInitialPassword
);

userManagementRoutes.patch('/updatepassword',
    handleSetPassword
);

userManagementRoutes.patch('/userrole',
    authMiddleware,
    verifyRole(
        new userManagementPermission([UserManagementAction.UpdateUserRole])),
    handleUpdateUserRole
);