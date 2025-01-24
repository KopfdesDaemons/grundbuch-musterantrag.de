import logger from "server/config/logger";
import { UserRole } from "server/interfaces/userRole";
import { User } from "server/models/user";
import { Admin, Guest } from "server/models/userRoles";
import { addNewUser, deleteUser, getAllUsers, getUserByUserID, getUserByUsername, updatePassword, updateUsername, updateUserRole } from "server/services/userService";
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
    const { userIDs } = req.body
    try {
        if (!userIDs) {
            return res.status(400).json({ error: 'Keine UserID in der Anfrage' });
        }
        for (const userID of userIDs) {
            if (isNaN(+userID)) {
                return res.status(400).json({ error: 'UserID muss eine Zahl sein' });
            }
            const userFromDB = await getUserByUserID(+userID);
            if (!userFromDB) {
                return res.status(400).json({ error: 'UserID ' + userID + ' existiert nicht' });
            }
        }

        await deleteUser(userIDs);
        return res.status(200).json({ message: 'User ' + userIDs.toString() + ' erfolgreich gelöscht' });
    } catch (error) {
        logger.error('Fehler beim Löschen der User ' + userIDs.toString(), error);
        return res.status(500).json({ error: 'Fehler beim Löschen des Users ' + userIDs.toString() });
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

export const handleUpdateUsername = async (req: Request, res: Response) => {
    const { userID, newUsername } = req.body
    try {
        if (!userID || !newUsername) {
            return res.status(400).json({ error: 'Unvollständige Anfrage' });
        }
        if (isNaN(+userID)) {
            return res.status(400).json({ error: 'UserID muss eine Zahl sein' });
        }
        const userFromDB = await getUserByUserID(+userID);
        if (!userFromDB) {
            return res.status(400).json({ error: 'UserID ' + userID + ' existiert nicht' });
        }
        await updateUsername(+userID, newUsername);
        return res.status(200).json({ message: 'Username erfolgreich aktualisiert' });

    } catch (error) {
        logger.error('Fehler beim Aktualisieren des Usernamens', error);
        return res.status(500).json({ error: 'Fehler beim Aktualisieren des Usernamens' });
    }
}

export const handleUpdatePassword = async (req: Request, res: Response) => {
    const { userID, newPassword } = req.body
    try {
        if (!userID || !newPassword) {
            return res.status(400).json({ error: 'Unvollständige Anfrage' });
        }
        if (isNaN(+userID)) {
            return res.status(400).json({ error: 'UserID muss eine Zahl sein' });
        }
        const userFromDB = await getUserByUserID(+userID);
        if (!userFromDB) {
            return res.status(400).json({ error: 'UserID ' + userID + ' existiert nicht' });
        }
        await userFromDB.setPasswordHash(newPassword);
        if (userFromDB.passwordHash) {
            await updatePassword(userID, userFromDB.passwordHash);
            return res.status(200).json({ message: 'Userpasswort erfolgreich aktualisiert' });
        }
        throw new Error('Fehler beim Aktualisieren des Userpassworts');
    } catch (error) {
        logger.error('Fehler beim Aktualisieren des Userpassworts', error);
        return res.status(500).json({ error: 'Fehler beim Aktualisieren des Userpassworts' });
    }
}

export const handleUpdateUserRole = async (req: Request, res: Response) => {
    const { userID, newUserRole } = req.body
    try {
        if (!userID || !newUserRole) {
            return res.status(400).json({ error: 'Unvollständige Anfrage' });
        }
        if (isNaN(+userID)) {
            return res.status(400).json({ error: 'UserID muss eine Zahl sein' });
        }
        if (newUserRole !== 'admin' && newUserRole !== 'guest') {
            return res.status(400).json({ error: 'Userrolle nicht vorhanden' });
        }
        const userFromDB = await getUserByUserID(+userID);
        if (!userFromDB) {
            return res.status(400).json({ error: 'UserID ' + userID + ' existiert nicht' });
        }
        await updateUserRole(userID, newUserRole);
        return res.status(200).json({ message: 'Userrolle erfolgreich aktualisiert' });
    } catch (error) {
        logger.error('Fehler beim Aktualisieren der Userrolle', error);
        return res.status(500).json({ error: 'Fehler beim Aktualisieren der Userrolle' });
    }
}