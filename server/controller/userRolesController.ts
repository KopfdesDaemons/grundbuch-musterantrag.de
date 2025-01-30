import logger from "server/config/logger";
import { UserRole } from "server/interfaces/userRole";
import { addUserRole, deleteUserRole, getAllUserRoles, getUserRole, updateUserRole } from "server/services/userRoleService";
import { Request, Response } from 'express';

export const handleGetAllUserRoles = async (req: Request, res: Response) => {
    try {
        const userRoles = await getAllUserRoles();
        return res.status(200).json(userRoles);
    } catch (error) {
        logger.error("Fehler beim Abrufen aller Userrollen:", error);
        return res.status(500).json({ error: "Fehler beim Abrufen aller Userrollen" });
    }
};

export const handleGetUserRole = async (req: Request, res: Response) => {
    const userRoleID = req.query['userRoleID'] as string;
    try {
        if (isNaN(+userRoleID)) {
            return res.status(400).json({ error: "userRoleID muss eine Zahl sein" });
        }
        const userRole: UserRole | null = await getUserRole(+userRoleID);
        if (!userRole) {
            return res.status(404).json({ error: "Userrolle nicht gefunden" });
        }
        return res.status(200).json(userRole);
    } catch (error) {
        logger.error("Fehler beim Abrufen aller Userrollen:", error);
        return res.status(500).json({ error: "Fehler beim Abrufen aller Userrollen" });
    }
};

export const handleUpdateUserRole = async (req: Request, res: Response) => {
    const { userRole } = req.body;
    try {
        if (isNaN(+userRole.userRoleID)) {
            return res.status(400).json({ error: "userRoleID muss eine Zahl sein" });
        }
        const userRoleFromDB: UserRole | null = await getUserRole(+userRole.userRoleID);
        if (!userRoleFromDB) {
            return res.status(404).json({ error: "Userrolle nicht gefunden" });
        }
        await updateUserRole(userRole);
        return res.status(200).json({ message: "Userrolle erfolgreich aktualisiert" });
    } catch (error) {
        logger.error("Fehler beim Aktualisieren der Userrolle:", error);
        return res.status(500).json({ error: "Fehler beim Aktualisieren der Userrollen" });
    }
};

export const handleCreateUserRole = async (req: Request, res: Response) => {
    const { userRole } = req.body;
    try {
        const newUserRole = userRole as UserRole;

        if (!newUserRole.name) {
            return res.status(400).json({ error: "Der Name darf nicht leer sein" });
        }

        const userRoleID = await addUserRole(newUserRole);
        return res.status(200).json({ message: "Userrolle erfolgreich erstellt", userRoleID });
    } catch (error) {
        logger.error("Fehler beim Erstellen einer neuen Userrolle:", error);
        return res.status(500).json({ error: "Fehler beim Erstellen einer neuen Userrolle" });
    }
};

export const handleDeleteUserRole = async (req: Request, res: Response) => {
    const { userRoleIDs } = req.body;

    try {
        if (!userRoleIDs || !Array.isArray(userRoleIDs)) {
            return res.status(400).json({ error: 'Unvollständige oder ungültige Anfrage, erwartet wird ein Array von IDs' });
        }

        // Überprüfen, ob alle Elemente im Array Zahlen sind
        if (!userRoleIDs.every(id => typeof id === 'number' && !isNaN(id))) {
            return res.status(400).json({ error: 'Alle userRoleIDs müssen gültige Zahlen sein' });
        }

        await deleteUserRole(userRoleIDs);
        return res.status(200).json({ message: "Userrollen erfolgreich gelöscht" });

    } catch (error) {
        logger.error("Fehler beim Löschen einer oder mehrerer Userrollen:", error);
        return res.status(500).json({ error: "Fehler beim Löschen einer oder mehrerer Userrollen" });
    }
};
