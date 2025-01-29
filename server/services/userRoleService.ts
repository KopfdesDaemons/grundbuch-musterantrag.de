import { UserRole } from "server/interfaces/userRole";
import { db } from "./databaseService";
import { Feature, UserPermission } from "server/interfaces/userPermission";
import { Guest } from "server/models/userRoles";
import logger from "server/config/logger";
import { RowDataPacket } from "mysql2/promise";

export const actionsTableMapping = {
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

    const connection = await db.getConnection();
    await connection.beginTransaction();
    try {
        const insertRoleQuery = `INSERT INTO user_roles (name, description) VALUES (?, ?)`;
        const [result]: any = await db.execute<RowDataPacket[]>(insertRoleQuery, [userRole.name, userRole.description]);
        const userRoleID = result.insertId as number;

        for (const permission of permissionsData) {
            const insertPermissionQuery = `INSERT INTO user_permissions (userRoleID, feature) VALUES (?, ?)`;
            const [result]: any = await db.execute<RowDataPacket[]>(insertPermissionQuery, [userRoleID, permission.feature]);
            const permissionId = result.insertId as number;

            const tableName = actionsTableMapping[permission.feature];
            if (!tableName) throw new Error(`Unknown feature: ${permission.feature}`);

            for (const action of permission.actions) {
                await db.execute(`INSERT INTO ${tableName} (userPermissionID, action_name) VALUES (?, ?)`, [permissionId, action]);
            }
        }

        await connection.commit();
        return userRoleID;
    } catch (error) {
        await connection.rollback();
        throw error;
    }
};

export const updateUserRole = async (userRole: UserRole): Promise<void> => {

    const connection = await db.getConnection();
    await connection.beginTransaction();
    try {
        if (!userRole.userRoleID) throw new Error('userRoleID ist nicht gesetzt');

        const userRoleFromDB = await getUserRole(userRole.userRoleID);

        // Namen und Beschreibung aktualisieren
        if (userRole.name !== userRoleFromDB?.name || userRole.description !== userRoleFromDB?.description) {
            const updateRoleQuery = `UPDATE user_roles SET name = ?, description = ? WHERE userRoleID = ?`;
            await db.execute(updateRoleQuery, [userRole.name, userRole.description, userRole.userRoleID]);
        }



        // todo: Permissions aktualisieren



        await connection.commit();
    } catch (error) {
        await connection.rollback();
        logger.error(error);
        throw error;
    }
};

export const getUserRole = async (roleId: number): Promise<UserRole | null> => {
    const roleQuery = `SELECT userRoleID, name, description FROM user_roles WHERE userRoleID = ?`;
    const [[role]] = await db.execute<RowDataPacket[]>(roleQuery, [roleId]);

    if (!role) return null;

    const permissionsQuery = `SELECT userPermissionID, feature FROM user_permissions WHERE userRoleID = ?`;
    const [permissions] = await db.execute<RowDataPacket[]>(permissionsQuery, [roleId]);

    const userPermissions = await Promise.all(permissions.map(async (perm) => {
        const tableName = actionsTableMapping[perm["feature"] as keyof typeof actionsTableMapping];
        if (!tableName) throw new Error(`Unknown feature: ${perm["feature"]}`);

        const actionsQuery = `SELECT action_name FROM ${tableName} WHERE userPermissionID = ?`;
        const [actions] = await db.execute<RowDataPacket[]>(actionsQuery, [perm["userPermissionID"]]);

        return {
            feature: perm["feature"],
            allowedActions: actions.map(action => action["action_name"] as UserPermission['allowedActions'][number]),
        };
    }));

    return { name: role["name"], description: role["description"], userPermissions, userRoleID: role["userRoleID"] };
};

export const getAllUserRoles = async (): Promise<{ userRoleID: number; name: string; description: string }> => {
    const selectQuery = `SELECT userRoleID, name, description FROM user_roles`;
    const [result]: any = await db.execute(selectQuery);
    return result as { userRoleID: number; name: string; description: string };
};

export const createGuestRole = async (): Promise<void> => {
    try {
        // Check if guest role already exists
        const userRoleQuery = `SELECT userRoleID FROM user_roles WHERE name = ?`;
        await db.execute(userRoleQuery, ['guest']);
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
    const [result] = await db.execute<RowDataPacket[]>(selectQuery, userRoleIDs);

    if (result.length > 0) {
        throw new Error('Es gibt noch Benutzer mit der Userrolle ' + result[0]["userID"]);
    }

    const deleteQuery = `DELETE FROM user_roles WHERE userRoleID IN (${placeholders})`;
    await db.execute(deleteQuery, userRoleIDs);
}
