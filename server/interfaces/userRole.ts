import { UserPermission } from "./userPermission";

export interface UserRole {
    name: string;
    description: string;
    userPermissions: UserPermission[];
}