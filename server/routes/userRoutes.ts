import { handleCreateUser, handleDeleteUser, handleGetAllUsers, handleGetOwnUsername, handleSetInitialPassword, handleSetPassword, handleUpdateUsername, handleUpdateUserRole } from "server/controller/userController";
import express from 'express';
import { UserManagementAction } from "server/interfaces/userPermission";
import authMiddleware from "server/middleware/authMiddleware";
import { verifyRole } from "server/middleware/verifyUserRoleMiddleware";
import { userManagementPermission } from "server/models/userPermissons";

export const userRoutes = express.Router();

userRoutes.get('/',
    authMiddleware,
    verifyRole(
        new userManagementPermission([UserManagementAction.ReadUser])),
    handleGetAllUsers
);

userRoutes.get('/own-username',
    authMiddleware,
    handleGetOwnUsername
);

userRoutes.put('/',
    authMiddleware,
    verifyRole(
        new userManagementPermission([UserManagementAction.CreateUser])),
    handleCreateUser
);

userRoutes.delete('/',
    authMiddleware,
    verifyRole(
        new userManagementPermission([UserManagementAction.DeleteUser])),
    handleDeleteUser
);

userRoutes.patch('/username',
    authMiddleware,
    verifyRole(
        new userManagementPermission([UserManagementAction.UpdateUsername])),
    handleUpdateUsername
);

userRoutes.patch('/setinitialpassword',
    authMiddleware,
    verifyRole(
        new userManagementPermission([UserManagementAction.SetInitialPassword])),
    handleSetInitialPassword
);

userRoutes.patch('/updatepassword',
    handleSetPassword
);

userRoutes.patch('/userrole',
    authMiddleware,
    verifyRole(
        new userManagementPermission([UserManagementAction.UpdateUserRole])),
    handleUpdateUserRole
);