import { User } from "server/models/user";
import { db } from "./databaseService";
import { Admin } from "server/models/userRoles";
import { DASHBOARD_ROOT_PASSWORD, DASHBOARD_ROOT_USER } from "server/config/config";
import logger from "server/config/logger";
import { getUserRole, addUserRole } from "./userRoleService";
import { RowDataPacket } from "mysql2/promise";

export const getUser = async (key: 'username' | 'userID', value: string | number): Promise<User | null> => {
    try {
        const queryStr = `SELECT userID, username, passwordHash, userRole, isInitialPassword, userRoleID FROM users WHERE ${key} = ?`;
        const [[userData]] = await db.execute<RowDataPacket[]>(queryStr, [value]);

        if (!userData) return null;

        const userRole = await getUserRole(userData["userRoleID"]);
        if (!userRole) throw new Error('Userrolle nicht gefunden');
        if (!userRole.userRoleID) throw new Error('Userrolle ID nicht gefunden');
        const user = new User(userData["username"], userRole, userRole.userRoleID)

        user.userID = userData["userID"];
        user.passwordHash = userData["passwordHash"];
        user.isInitialPassword = userData["isInitialPassword"];

        return user;
    } catch (error) {
        console.error('Fehler beim Abrufen des Benutzers:', error);
        return null;
    }
};

export const getUserByUsername = async (username: string): Promise<User | null> => {
    return getUser('username', username);
};

export const getUserByUserID = async (userID: number): Promise<User | null> => {
    return getUser('userID', userID);
};

export const addNewUser = async (user: User): Promise<number> => {
    if (!user.passwordHash) {
        throw new Error('No Password Hash');
    }
    const insertQuery = `INSERT INTO users (username, passwordHash, userRoleID) VALUES (?, ?, ?)`;
    await db.execute<RowDataPacket[]>(insertQuery, [user.username, user.passwordHash, user.userRoleID]);

    // Abrufen der letzten eingefügten ID
    const [result] = await db.execute<RowDataPacket[]>('SELECT LAST_INSERT_ID()');
    const lastID = result[0]['LAST_INSERT_ID()'];

    if (lastID && typeof lastID === 'number') {
        return lastID;
    } else {
        throw new Error('Failed to insert user and retrieve ID');
    }
};

export const deleteUser = async (userIDs: number[]): Promise<void> => {
    const placeholders = userIDs.map(() => '?').join(', ');
    const deleteQuery = `DELETE FROM users WHERE userID IN (${placeholders})`;
    await db.execute(deleteQuery, userIDs);
};

export const createRootUser = async (): Promise<void> => {
    const rootUserFromDB = await getUserByUsername(DASHBOARD_ROOT_USER);
    if (!rootUserFromDB) {
        const userRole = new Admin();
        const userRoleID = await addUserRole(userRole);
        const rootUser = new User(DASHBOARD_ROOT_USER, userRole, userRoleID);
        await rootUser.setPasswordHash(DASHBOARD_ROOT_PASSWORD);
        await addNewUser(rootUser);
        logger.info('Root User erfolgreich erstellt');
    }
}

export const getAllUsers = async (): Promise<User[]> => {
    const queryStr = `SELECT userID, username, userRoleID, isInitialPassword FROM users`;
    const [result] = await db.execute<RowDataPacket[]>(queryStr);
    return Promise.all(result.map(async (user) => {
        const userRole = await getUserRole(user["userRoleID"]);
        if (!userRole) throw new Error('Userrolle nicht gefunden');
        user["userRole"] = userRole;
        return user as User;
    }));
}

export const updateUsername = async (userID: number, newUsername: string): Promise<void> => {
    const updateQuery = `UPDATE users SET username = ? WHERE userID = ?`;
    await db.execute(updateQuery, [newUsername, userID]);
}

export const setNewInitalPassword = async (userID: number, newPasswordHash: string): Promise<void> => {
    const updateQuery = `UPDATE users SET passwordHash = ?, isInitialPassword = 1 WHERE userID = ?`;
    await db.execute(updateQuery, [newPasswordHash, userID]);
}

export const updatePassword = async (userID: number, newPasswordHash: string): Promise<void> => {
    const updateQuery = `UPDATE users SET passwordHash = ?, isInitialPassword = 0 WHERE userID = ?`;
    await db.execute(updateQuery, [newPasswordHash, userID]);
}

export const updateUserRole = async (userID: number, userRole: number): Promise<void> => {
    const updateQuery = `UPDATE users SET userRoleID = ? WHERE userID = ?`;
    await db.execute(updateQuery, [userRole, userID]);
}