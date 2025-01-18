import { UserRole } from "server/interfaces/userRole";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { UserPermission } from "server/interfaces/userPermission";

const scryptAsync = promisify(scrypt);

export class User {
    userID: number;
    username: string;
    private passwordHashFromDB?: string;
    userRole: UserRole;

    constructor(userID: number, username: string, userRole: UserRole) {
        this.userID = userID;
        this.username = username;
        this.userRole = userRole;
    }

    setPasswordHashFromDB = async (password: string): Promise<void> => {
        const salt = randomBytes(16).toString("hex");
        const buf = (await scryptAsync(password, salt, 64)) as Buffer;
        this.passwordHashFromDB = `${buf.toString("hex")}.${salt}`;
    }

    comparePassword = async (userPassword: string): Promise<boolean> => {
        if (!this.passwordHashFromDB) {
            throw new Error("No Password Hash from DB");
        }
        if (!userPassword) {
            throw new Error("No Password Hash from User");
        }
        const [hashedPassword, salt] = this.passwordHashFromDB.split(".");
        const hashedPasswordBuf = Buffer.from(hashedPassword, "hex");
        const suppliedPasswordBuf = (await scryptAsync(userPassword, salt, 64)) as Buffer;
        return timingSafeEqual(hashedPasswordBuf, suppliedPasswordBuf);
    }

    checkPermission = (permissionToCheck: UserPermission): boolean => {
        if (!this.userRole?.userPermissions || !Array.isArray(this.userRole.userPermissions)) {
            return false;
        }

        const permission = this.userRole.userPermissions.find(permission => permission.feature === permissionToCheck.feature);
        if (!permission || !Array.isArray(permission.allowedActions)) {
            return false;
        }

        // Überprüft, ob alle allowedActions im permission enthalten sind
        return permissionToCheck.allowedActions.every(action =>
            permission.allowedActions.includes(action)
        );
    }

}