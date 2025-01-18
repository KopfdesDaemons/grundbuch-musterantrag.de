import { User } from "server/models/user";
import { Admin } from "server/models/userRoles";

export const getUser = (username: string): User => {
    // TODO: Datenbankzugriff

    // Testdaten
    if (username === 'Rico') {
        return new User(1, username, new Admin());
    }
    throw new Error('Benutzer nicht gefunden');
}