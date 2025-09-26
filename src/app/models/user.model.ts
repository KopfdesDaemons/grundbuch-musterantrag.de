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
}
