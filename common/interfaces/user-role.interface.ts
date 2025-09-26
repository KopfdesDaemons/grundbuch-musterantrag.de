import { UserPermission } from 'common/interfaces/user-permission.interface';

export interface UserRole {
  userRoleID?: number;
  name: string;
  description: string;
  userPermissions: UserPermission[];
}
