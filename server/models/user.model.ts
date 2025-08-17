import { UserRole } from 'server/interfaces/user-role.interface';
import { scrypt, randomBytes, timingSafeEqual } from 'crypto';
import { promisify } from 'util';
import { UserPermission } from 'server/interfaces/user-permission.interface';

const scryptAsync = promisify(scrypt);

export class User {
  userID?: number;
  username: string;
  passwordHash?: string;
  isInitialPassword: boolean = true;
  userRole: UserRole;
  userRoleID: number;

  constructor(username: string, userRole: UserRole, userRoleID: number) {
    this.username = username;
    this.userRole = userRole;
    this.userRoleID = userRoleID;
  }

  setPasswordHash = async (password: string): Promise<void> => {
    const salt = randomBytes(16).toString('hex');
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;
    this.passwordHash = `${buf.toString('hex')}.${salt}`;
  };

  comparePassword = async (userPassword: string): Promise<boolean> => {
    if (!this.passwordHash) {
      throw new Error('No Password Hash from DB');
    }
    if (!userPassword) {
      throw new Error('No Password Hash from User');
    }
    const [hashedPassword, salt] = this.passwordHash.split('.');
    const hashedPasswordBuf = Buffer.from(hashedPassword, 'hex');
    const suppliedPasswordBuf = (await scryptAsync(userPassword, salt, 64)) as Buffer;
    return timingSafeEqual(hashedPasswordBuf, suppliedPasswordBuf);
  };

  checkPermission = (permissionToCheck: UserPermission): boolean => {
    if (!permissionToCheck?.allowedActions?.length) {
      return false;
    }

    if (!this.userRole?.userPermissions?.length) {
      return false;
    }

    const permission: UserPermission | undefined = this.userRole.userPermissions.find(perm => perm.feature === permissionToCheck.feature);

    if (!permission?.allowedActions?.length) {
      return false;
    }

    // Prüft, ob alle geforderten Aktionen in den vorhandenen Aktionen enthalten sind
    return permissionToCheck.allowedActions.every(action => permission.allowedActions.includes(action));
  };
}
