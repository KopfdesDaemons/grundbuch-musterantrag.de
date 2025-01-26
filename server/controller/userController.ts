import logger from "server/config/logger";
import { User } from "server/models/user";
import { addNewUser, deleteUser, getAllUsers, getUserByUserID, getUserByUsername, setNewInitalPassword, updatePassword, updateUsername, updateUserRole } from "server/services/userService";
import { Request, Response } from 'express';
import { getUserRole } from "server/services/userRoleService";


export const handleCreateUser = async (req: Request, res: Response) => {
    const { username, password, userRoleID } = req.body;
    try {
        if (!username || !password || !userRoleID) {
            return res.status(400).json({ error: 'Unvollständige Anfrage' });
        }
        if (isNaN(+userRoleID)) {
            return res.status(400).json({ error: 'userRoleID muss eine Zahl sein' });
        }
        const userFromDB = await getUserByUsername(username);
        if (userFromDB) {
            return res.status(400).json({ error: 'Anfrage unzulässig' });
        }
        const userRole = await getUserRole(userRoleID);
        if (!userRole) {
            return res.status(400).json({ error: 'Anfrage unzulässig' });
        }

        const newUser = new User(username, userRole, userRoleID);
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

export const handleSetInitialPassword = async (req: Request, res: Response) => {
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
            return res.status(400).json({ error: 'Fehlerhafte Anfrage' });
        }
        await userFromDB.setPasswordHash(newPassword);
        if (userFromDB.passwordHash) {
            await setNewInitalPassword(userID, userFromDB.passwordHash);
            return res.status(200).json({ message: 'Initialpasswort erfolgreich aktualisiert' });
        }
        throw new Error('Fehler beim Setzen des Initialpasswords');
    } catch (error) {
        logger.error('Fehler beim Setzen des Initialpasswords', error);
        return res.status(500).json({ error: 'Fehler beim Setzen des Initialpasswords' });
    }
}


export const handleSetPassword = async (req: Request, res: Response) => {
    const { username, oldPassword, newPassword } = req.body
    try {
        if (!username || !newPassword || !oldPassword) {
            return res.status(400).json({ error: 'Unvollständige Anfrage' });
        }
        const userFromDB = await getUserByUsername(username);
        if (!userFromDB) {
            return res.status(400).json({ error: 'Fehlerhafte Anfrage' });
        }
        const isCorrectPassword = await userFromDB.comparePassword(oldPassword);
        if (!isCorrectPassword) {
            return res.status(400).json({ error: 'Falsches Passwort' });
        }
        await userFromDB.setPasswordHash(newPassword);
        if (userFromDB.passwordHash) {
            if (userFromDB.userID) {
                await updatePassword(userFromDB.userID, userFromDB.passwordHash);
                return res.status(200).json({ message: 'Userpasswort erfolgreich aktualisiert' });
            }
        }
        throw new Error('Fehler beim Setzen des Passworts');
    } catch (error) {
        logger.error('Fehler beim Setzen des Passworts', error);
        return res.status(500).json({ error: 'Fehler beim Setzen des Passworts' });
    }
}

export const handleUpdateUserRole = async (req: Request, res: Response) => {
    const { userID, userRoleID } = req.body
    try {
        if (!userID || !userRoleID) {
            return res.status(400).json({ error: 'Unvollständige Anfrage' });
        }
        if (isNaN(+userID)) {
            return res.status(400).json({ error: 'UserID muss eine Zahl sein' });
        }
        if (isNaN(+userRoleID)) {
            return res.status(400).json({ error: 'userRoleID muss eine Zahl sein' });
        }
        const userFromDB = await getUserByUserID(+userID);
        if (!userFromDB) {
            return res.status(400).json({ error: 'UserID ' + userID + ' existiert nicht' });
        }
        await updateUserRole(userID, userRoleID);
        return res.status(200).json({ message: 'Userrolle erfolgreich aktualisiert' });
    } catch (error) {
        logger.error('Fehler beim Aktualisieren der Userrolle', error);
        return res.status(500).json({ error: 'Fehler beim Aktualisieren der Userrolle' });
    }
}