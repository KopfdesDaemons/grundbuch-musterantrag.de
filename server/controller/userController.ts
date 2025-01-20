import logger from "server/config/logger";
import { UserRole } from "server/interfaces/userRole";
import { User } from "server/models/user";
import { Admin, Guest } from "server/models/userRoles";
import { addNewUser, deleteUser, getAllUsers, getUserByUserID, getUserByUsername } from "server/services/userService";
import { Request, Response } from 'express';


export const handleCreateUser = async (req: Request, res: Response) => {
    const { username, password, userRole } = req.body;
    try {
        if (!username || !password || !userRole) {
            return res.status(400).json({ error: 'Unvollständige Anfrage' });
        }
        const userFromDB = await getUserByUsername(username);
        if (userFromDB) {
            return res.status(400).json({ error: 'Anfrage unzulässig' });
        }

        const newUserUserRole: UserRole = userRole === 'admin' ? new Admin() : new Guest();

        const newUser = new User(username, newUserUserRole);
        await newUser.setPasswordHash(password);
        await addNewUser(newUser);
        return res.status(201).json({ message: 'User ' + username + ' erfolgreich erstellt' });
    } catch (error) {
        logger.error('Fehler beim Erstellen des Users ' + username, error);
        return res.status(500).json({ error: 'Fehler beim Erstellen des Users ' + username });
    }
}

export const handleDeleteUser = async (req: Request, res: Response) => {
    const userID = req.query['userID'] as string;
    try {
        if (!userID) {
            return res.status(400).json({ error: 'Keine UserID in der Anfrage' });
        }
        if (isNaN(+userID)) {
            return res.status(400).json({ error: 'UserID muss eine Zahl sein' });
        }
        const userFromDB = await getUserByUserID(+userID);
        if (!userFromDB) {
            return res.status(400).json({ error: 'UserID ' + userID + ' existiert nicht' });
        }
        await deleteUser(+userID);
        return res.status(200).json({ message: 'User ' + userID + ' erfolgreich gelöscht' });
    } catch (error) {
        logger.error('Fehler beim Löschen des Users ' + userID, error);
        return res.status(500).json({ error: 'Fehler beim Löschen des Users ' + userID });
    }
}

export const handleGetAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await getAllUsers();
        return res.status(200).json(users);
    } catch (error) {
        logger.error('Fehler beim Abrufen aller Users', error);
        return res.status(500).json({ error: 'Fehler beim Abrufen aller Users' });
    }
}