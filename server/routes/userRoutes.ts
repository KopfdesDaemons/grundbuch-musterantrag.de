import { handleCreateUser, handleDeleteUser, handleGetAllUsers } from "server/controller/userController";
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
