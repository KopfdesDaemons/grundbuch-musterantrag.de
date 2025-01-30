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
            if (!tableName) throw new Error(`Unbekanntes Feature: ${permission.feature}`);

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

        // Update name and description
        if (userRole.name !== userRoleFromDB?.name || userRole.description !== userRoleFromDB?.description) {
            const updateRoleQuery = `UPDATE user_roles SET name = ?, description = ? WHERE userRoleID = ?`;
            await connection.execute(updateRoleQuery, [userRole.name, userRole.description, userRole.userRoleID]);
        }

        const permissions = userRole.userPermissions;
        const permissionsDB = userRoleFromDB?.userPermissions

        const newPermissions = permissions.filter(permission => !permissionsDB?.some(p => p.feature === permission.feature));
        const deletedPermissions = permissionsDB?.filter(permission => !permissions.some(p => p.feature === permission.feature));
        const existingPermissions = permissions.filter(permission => permissionsDB?.some(p => p.feature === permission.feature));
        const existingPermissionsDB = permissionsDB?.filter(permission => permissions.some(p => p.feature === permission.feature));

        // Add new Permissions
        for (const permission of newPermissions) {
            const insertPermissionQuery = `INSERT INTO user_permissions (userRoleID, feature) VALUES (?, ?)`;
            const [result]: any = await connection.execute<RowDataPacket[]>(insertPermissionQuery, [userRole.userRoleID, permission.feature]);
            const permissionId = result.insertId as number;

            const tableName = actionsTableMapping[permission.feature];
            if (!tableName) throw new Error(`Unbekanntes Feature: ${permission.feature}`);

            for (const action of permission.allowedActions) {
                await connection.execute(`INSERT INTO ${tableName} (userPermissionID, action_name) VALUES (?, ?)`, [permissionId, action]);
            }
        }

        // delete Permissions
        if (deletedPermissions) {
            for (const permission of deletedPermissions) {
                logger.info(`Permission ${permission.feature} geloescht`);
                const deletePermissionQuery = `DELETE FROM user_permissions WHERE userRoleID = ? AND feature = ?`;
                await connection.execute(deletePermissionQuery, [userRole.userRoleID, permission.feature]);
            }
        }

        // update Permissions
        if (existingPermissionsDB) {
            for (const permission of existingPermissions) {
                const actions = permission.allowedActions;
                const actionsDB = existingPermissionsDB.find(p => p.feature === permission.feature)?.allowedActions;
                const newActions = actions.filter(action => !existingPermissionsDB.some(p => p.allowedActions.includes(action)));
                const deletedActions = actionsDB?.filter(action => !actions.includes(action));

                // get permissionID
                const permissionQuery = `SELECT userPermissionID FROM user_permissions WHERE userRoleID = ? AND feature = ?`;
                const [result]: any = await connection.execute<RowDataPacket[]>(permissionQuery, [userRole.userRoleID, permission.feature]);
                const permissionId = result[0]["userPermissionID"] as number;

                // add new actions
                if (newActions.length > 0) {
                    const tableName = actionsTableMapping[permission.feature];
                    if (!tableName) throw new Error(`Unbekanntes Feature: ${permission.feature}`);

                    const placeholders = newActions.map(() => "(?, ?)").join(", ");
                    const values = newActions.flatMap(action => [permissionId, action]);
                    await connection.execute(`INSERT INTO ${tableName} (userPermissionID, action_name) VALUES ${placeholders}`, values);
                }

                // remove deleted actions
                if (deletedActions) {
                    const tableName = actionsTableMapping[permission.feature];
                    if (!tableName) throw new Error(`Unbekanntes Feature: ${permission.feature}`);

                    for (const action of deletedActions) {
                        await connection.execute(`DELETE FROM ${tableName} WHERE userPermissionID = ? AND action_name = ?`, [permissionId, action]);
                    }
                }
            }
        }

        await connection.commit();
    } catch (error) {
        await connection.rollback();
        logger.error(error);
        throw error;
    } finally {
        connection.release();
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
        if (!tableName) throw new Error(`Unbekanntes Feature: ${perm["feature"]}`);

        const actionsQuery = `SELECT action_name FROM ${tableName} WHERE userPermissionID = ?`;
        const [actions] = await db.execute<RowDataPacket[]>(actionsQuery, [perm["userPermissionID"]]);

        return {
            feature: perm["feature"],
            allowedActions: actions.map(action => action["action_name"] as UserPermission['allowedActions'][number]),
        };
    }));

    return { name: role["name"], description: role["description"], userPermissions, userRoleID: role["userRoleID"] };
};

export const getAllUserRoles = async (): Promise<{ userRoleID: number; name: string; description: string }[]> => {
    const selectQuery = `SELECT userRoleID, name, description FROM user_roles`;
    const [result]: any = await db.execute(selectQuery);
    const userRoles = result as { userRoleID: number; name: string; description: string }[];
    const sortedUserRoles = userRoles.sort((a, b) => a.name.localeCompare(b.name));
    return sortedUserRoles;
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
