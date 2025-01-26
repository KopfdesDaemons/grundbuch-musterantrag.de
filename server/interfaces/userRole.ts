import { UserPermission } from "./userPermission";

export interface UserRole {
    userRoleID?: number;
    name: string;
    description: string;
    userPermissions: UserPermission[];
}