import { UserPermission } from 'common/interfaces/user-permission.interface';
import { UserRole } from 'common/interfaces/user-role.interface';

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
