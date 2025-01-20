import { handleCreateUser, handleDeleteUser, handleGetAllUsers } from "server/controller/userController";
import express from 'express';
import { UserPermission, Feature, PermissionAction } from "server/interfaces/userPermission";
import authMiddleware from "server/middleware/authMiddleware";
import { verifyRole } from "server/middleware/verifyUserRoleMiddleware";

export const userRoutes = express.Router();

userRoutes.get('/',
    authMiddleware,
    verifyRole(
        new UserPermission(Feature.UserManagement, [PermissionAction.Read])
    ),
    handleGetAllUsers
);

userRoutes.put('/',
    authMiddleware,
    verifyRole(
        new UserPermission(Feature.UserManagement, [PermissionAction.Create])
    ),
    handleCreateUser
);

userRoutes.delete('/',
    authMiddleware,
    verifyRole(
        new UserPermission(Feature.UserManagement, [PermissionAction.Delete])
    ),
    handleDeleteUser
);
