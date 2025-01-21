import { User } from "server/models/user";
import { query } from "./databaseService";
import { Admin, Guest } from "server/models/userRoles";
import { DASHBOARD_ROOT_PASSWORD, DASHBOARD_ROOT_USER } from "server/config/config";
import logger from "server/config/logger";

export const getUser = async (key: 'username' | 'userID', value: string | number): Promise<User | null> => {
    try {
        const queryStr = `SELECT userID, username, passwordHash, userRole FROM users WHERE ${key} = ?`;
        const [userData] = await query<{ userID: number, username: string, passwordHash: string, userRole: string }[]>(queryStr, [value]);

        if (!userData) return null;

        const userRole = userData.userRole === 'admin' ? new Admin() : new Guest();
        const user = new User(userData.username, userRole);

        user.userID = userData.userID;
        user.passwordHash = userData.passwordHash;

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
    const insertQuery = `INSERT INTO users (username, passwordHash, userRole) VALUES (?, ?, ?)`;
    await query(insertQuery, [user.username, user.passwordHash, user.userRole.name]);

    // Abrufen der letzten eingefügten ID
    const result = await query<{ 'LAST_INSERT_ID()': number }[]>('SELECT LAST_INSERT_ID()');
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
    await query(deleteQuery, userIDs);
};

export const createRootUser = async (): Promise<void> => {
    try {
        await getUserByUsername(DASHBOARD_ROOT_USER);
    } catch {
        const rootUser = new User(DASHBOARD_ROOT_USER, new Admin());
        await rootUser.setPasswordHash(DASHBOARD_ROOT_PASSWORD);
        await addNewUser(rootUser);
        logger.info('Root-User erstellt');
    }
}

export const getAllUsers = async (): Promise<User[]> => {
    const queryStr = `SELECT userID, username, userRole FROM users`;
    const result = await query<{ userID: number, username: string, userRole: string }[]>(queryStr);
    return result.map((user) => {
        const readedUser = new User(user.username, user.userRole === 'admin' ? new Admin() : new Guest());
        readedUser.userID = user.userID;
        return readedUser;
    });
}