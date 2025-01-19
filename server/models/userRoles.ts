import { Feature, PermissionAction, UserPermission } from 'server/interfaces/userPermission';
import { UserRole } from 'server/interfaces/userRole';

export class Admin implements UserRole {
    name: string = 'admin';
    description: string = 'Administrator mit unlimitierten Rechten';
    userPermissions: UserPermission[] = [
        new UserPermission(Feature.UploadManagement, [
            PermissionAction.Create,
            PermissionAction.Read,
            PermissionAction.Update,
            PermissionAction.Delete,
        ]),
        new UserPermission(Feature.UserManagement, [
            PermissionAction.Create,
            PermissionAction.Read,
            PermissionAction.Update,
            PermissionAction.Delete,
        ]),
        new UserPermission(Feature.Statistic, [
            PermissionAction.Create,
            PermissionAction.Read,
            PermissionAction.Update,
            PermissionAction.Delete,
        ]),
        new UserPermission(Feature.Settings, [
            PermissionAction.Create,
            PermissionAction.Read,
            PermissionAction.Update,
            PermissionAction.Delete,
        ]),
        new UserPermission(Feature.Logger, [
            PermissionAction.Create,
            PermissionAction.Read,
            PermissionAction.Update,
            PermissionAction.Delete,
        ]),
        new UserPermission(Feature.Migration, [
            PermissionAction.Create,
            PermissionAction.Read,
            PermissionAction.Update,
            PermissionAction.Delete,
        ]),
    ];
}

export class Guest implements UserRole {
    name: string = 'guest';
    description: string = 'Gast nur mit Lesenrechten';
    userPermissions: UserPermission[] = [
        new UserPermission(Feature.UploadManagement, [PermissionAction.Read]),
        new UserPermission(Feature.UserManagement, [PermissionAction.Read]),
        new UserPermission(Feature.Statistic, [PermissionAction.Read]),
        new UserPermission(Feature.Settings, [PermissionAction.Read]),
        new UserPermission(Feature.Logger, [PermissionAction.Read]),
        new UserPermission(Feature.Migration, [PermissionAction.Read]),
    ];
}
