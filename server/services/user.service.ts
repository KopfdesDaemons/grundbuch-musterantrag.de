import { User } from 'common/models/user.model';
import { db } from './database.service';
import logger from 'server/config/logger.config';
import { getUserRole, addUserRole } from './user-role.service';
import { RowDataPacket } from 'mysql2/promise';
import { DASHBOARD_ROOT_USER, DASHBOARD_ROOT_PASSWORD } from 'server/config/env.config';
import { Admin } from 'common/models/user-roles.model';
import { PaginatedApiResponse } from 'common/interfaces/pagination-data.interface';
import { getHashFromString } from 'server/helpers/hash.helper';

export const getUser = async (key: 'username' | 'userID', value: string | number): Promise<User | null> => {
  const queryStr = `SELECT userID, username, passwordHash, isInitialPassword, userRoleID FROM users WHERE ${key} = ?`;
  const [[userData]] = await db.execute<RowDataPacket[]>(queryStr, [value]);

  if (!userData) return null;

  const userRole = await getUserRole(userData['userRoleID']);
  if (!userRole) throw new Error('Userrolle nicht gefunden');
  if (!userRole.userRoleID) throw new Error('Userrolle ID nicht gefunden');
  const user = new User(userData['username'], userRole, userRole.userRoleID);

  user.userID = userData['userID'];
  user.passwordHash = userData['passwordHash'];
  user.isInitialPassword = userData['isInitialPassword'];

  return user;
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
    rootUser.passwordHash = await getHashFromString(DASHBOARD_ROOT_PASSWORD);
    await addNewUser(rootUser);
    logger.info('Root User erfolgreich erstellt');
  }
};

const pageSize: number = 10;

export const getAllUsers = async (page: number = 1): Promise<PaginatedApiResponse<User>> => {
  if (page < 1) throw new Error('Die Seitennummer muss größer oder gleich 1 sein.');
  const offset = (page - 1) * pageSize;

  const queryStr = `SELECT userID, username, userRoleID, isInitialPassword FROM users ORDER BY userID ASC LIMIT ${pageSize} OFFSET ${offset}`;
  const [result] = await db.execute<RowDataPacket[]>(queryStr);

  const userPromises = result.map(async user => {
    const userRole = await getUserRole(user['userRoleID']);
    if (!userRole) throw new Error('Userrolle nicht gefunden');
    const newUser = new User(user['username'], userRole, user['userRoleID']);
    newUser.userID = user['userID'];
    newUser.isInitialPassword = user['isInitialPassword'];
    return newUser;
  });

  const items: User[] = await Promise.all(userPromises);
  // Gesamtanzahl der Dateien berechnen
  const countQuery = `SELECT COUNT(*) AS totalFiles FROM users`;
  const [countResult] = await db.execute<RowDataPacket[]>(countQuery);
  const totalItems = countResult[0]['totalFiles'] as number;
  const totalPages = Math.ceil(totalItems / pageSize);

  return {
    page,
    totalPages,
    totalItems,
    items
  };
};

export const updateUsername = async (userID: number, newUsername: string): Promise<void> => {
  const updateQuery = `UPDATE users SET username = ? WHERE userID = ?`;
  await db.execute(updateQuery, [newUsername, userID]);
};

export const setNewInitalPassword = async (userID: number, newPasswordHash: string): Promise<void> => {
  const updateQuery = `UPDATE users SET passwordHash = ?, isInitialPassword = 1 WHERE userID = ?`;
  await db.execute(updateQuery, [newPasswordHash, userID]);
};

export const updatePassword = async (userID: number, newPasswordHash: string): Promise<void> => {
  const updateQuery = `UPDATE users SET passwordHash = ?, isInitialPassword = 0 WHERE userID = ?`;
  await db.execute(updateQuery, [newPasswordHash, userID]);
};

export const updateUserRole = async (userID: number, userRole: number): Promise<void> => {
  const updateQuery = `UPDATE users SET userRoleID = ? WHERE userID = ?`;
  await db.execute(updateQuery, [userRole, userID]);
};

export const getUsername = async (userID: number): Promise<string> => {
  const queryStr = `SELECT username FROM users WHERE userID = ?`;
  const [result] = await db.execute<RowDataPacket[]>(queryStr, [userID]);
  return result[0]['username'] as string;
};
