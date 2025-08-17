import { UserPermission } from './user-permission.interface';

export interface UserRole {
  userRoleID?: number;
  name: string;
  description: string;
  userPermissions: UserPermission[];
}
