import { UserRole } from "server/interfaces/userRole";

export class User {
    userID?: number;
    username: string;
    passwordHash?: string;
    isInitialPassword: boolean = true;
    userRole: UserRole;

    constructor(username: string, userRole: UserRole) {
        this.username = username;
        this.userRole = userRole;
    }
}