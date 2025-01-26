import { UserRole } from "server/interfaces/userRole";
import { query } from "./databaseService";
import { InsertResult } from "server/interfaces/insertResult";
import { Feature, UserPermission } from "server/interfaces/userPermission";
import { Guest } from "server/models/userRoles";
import logger from "server/config/logger";

export const tableMapping = {
    [Feature.UploadManagement]: 'upload_management_actions',
    [Feature.UserManagement]: 'user_management_actions',
    [Feature.Statistic]: 'statistic_actions',
    [Feature.Logger]: 'logger_actions',
    [Feature.Migration]: 'migration_actions',
    [Feature.Settings]: 'settings_actions',
    [Feature.UserRoleManagement]: 'user_role_management_actions',
};

export const addUserRole = async (userRole: UserRole): Promise<number> => {

    const permissionsData = userRole.userPermissions.map(permission => ({
        feature: permission.feature,
        actions: permission.allowedActions,
    }));

    await query("START TRANSACTION");
    try {
        const insertRoleQuery = `INSERT INTO user_roles (name, description) VALUES (?, ?)`;
        const { insertId: userRoleID } = await query<InsertResult>(insertRoleQuery, [userRole.name, userRole.description]);

        for (const permission of permissionsData) {
            const insertPermissionQuery = `INSERT INTO user_permissions (userRoleID, feature) VALUES (?, ?)`;
            const { insertId: permissionId } = await query<InsertResult>(insertPermissionQuery, [userRoleID, permission.feature]);

            const tableName = tableMapping[permission.feature];
            if (!tableName) throw new Error(`Unknown feature: ${permission.feature}`);

            for (const action of permission.actions) {
                await query(`INSERT INTO ${tableName} (userPermissionID, action_name) VALUES (?, ?)`, [permissionId, action]);
            }
        }

        await query("COMMIT");
        return userRoleID;
    } catch (error) {
        await query("ROLLBACK");
        throw error;
    }
};

export const getUserRole = async (roleId: number): Promise<UserRole | null> => {
    const roleQuery = `SELECT userRoleID, name, description FROM user_roles WHERE userRoleID = ?`;
    const [role] = await query<UserRole[]>(roleQuery, [roleId]);

    if (!role) return null;

    const permissionsQuery = `SELECT userPermissionID, feature FROM user_permissions WHERE userRoleID = ?`;
    const permissions = await query<{ userPermissionID: number; feature: Feature }[]>(permissionsQuery, [roleId]);

    const userPermissions = await Promise.all(permissions.map(async (perm) => {
        const tableName = tableMapping[perm.feature];
        if (!tableName) throw new Error(`Unknown feature: ${perm.feature}`);

        const actionsQuery = `SELECT action_name FROM ${tableName} WHERE userPermissionID = ?`;
        const actions = await query<{ action_name: string }[]>(actionsQuery, [perm.userPermissionID]);

        return {
            feature: perm.feature,
            allowedActions: actions.map(action => action.action_name as UserPermission['allowedActions'][number]),
        };
    }));

    return { name: role.name, description: role.description, userPermissions, userRoleID: role.userRoleID };
};

export const getAllUserRoles = async (): Promise<UserRole[]> => {
    const selectQuery = `SELECT userRoleID, name, description FROM user_roles`;
    const result = await query<UserRole[]>(selectQuery);
    return result;
};

export const createGuestRole = async (): Promise<void> => {
    // Check if guest role already exists
    try {
        const userRoleQuery = `SELECT userRoleID FROM user_roles WHERE name = guest`;
        await query<{ userRoleID: number }[]>(userRoleQuery);
    } catch {
        // Create guest role
        const userRole = new Guest();
        await addUserRole(userRole);
        logger.info('Gast-Userrolle erfolgreich erstellt');
    }
}

export const deleteUserRole = async (userRoleIDs: number[]): Promise<void> => {
    if (userRoleIDs.length === 0) {
        throw new Error('Keine Rollen-IDs angegeben');
    }

    const placeholders = userRoleIDs.map(() => '?').join(', ');
    const selectQuery = `SELECT userID FROM users WHERE userRoleID IN (${placeholders})`;
    const result = await query<{ userID: number }[]>(selectQuery, userRoleIDs);

    if (result.length > 0) {
        throw new Error('Es gibt noch Benutzer mit einer dieser Rollen');
    }

    const deleteQuery = `DELETE FROM user_roles WHERE userRoleID IN (${placeholders})`;
    await query(deleteQuery, userRoleIDs);
}
