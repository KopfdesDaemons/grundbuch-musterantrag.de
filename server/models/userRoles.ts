import { LoggerAction, MigrationAction, SettingsAction, StatisticAction, UploadManagementAction, UserManagementAction, UserPermission, UserRoleManagementAction } from 'server/interfaces/userPermission';
import { UserRole } from 'server/interfaces/userRole';
import { loggerPermission, migrationPermission, settingsPermission, statisticPermission, uploadManagementPermission, userManagementPermission, userRoleManagementPermission } from './userPermissons';

export class Admin implements UserRole {
    name: string = 'Admin';
    description: string = 'Administrator mit unlimitierten Rechten';
    userPermissions: UserPermission[] = [
        new uploadManagementPermission([
            UploadManagementAction.ReadUploadData,
            UploadManagementAction.GetFiles,
            UploadManagementAction.DeleteUpload,
            UploadManagementAction.DeleteGeneratedFiles,
            UploadManagementAction.DeleteAllUploads,
            UploadManagementAction.DeleteAllGeneratedFiles
        ]),
        new userManagementPermission([
            UserManagementAction.CreateUser,
            UserManagementAction.ReadUser,
            UserManagementAction.DeleteUser,
            UserManagementAction.UpdateUsername,
            UserManagementAction.UpdateUserRole,
            UserManagementAction.SetInitialPassword
        ]),
        new statisticPermission([
            StatisticAction.ReadStatistic
        ]),
        new settingsPermission([
            SettingsAction.ReadSettings,
            SettingsAction.UpdateSettings
        ]),
        new loggerPermission([
            LoggerAction.ReadLogFile,
            LoggerAction.ClearLogFile
        ]),
        new migrationPermission([
            MigrationAction.JSONToDatabaseMigration,
            MigrationAction.AntragToUploadinfoMigration
        ]),
        new userRoleManagementPermission([
            UserRoleManagementAction.CreateUserRole,
            UserRoleManagementAction.DeleteUserRole,
            UserRoleManagementAction.ReadUserRoles
        ])
    ];
}

export class Guest implements UserRole {
    name: string = 'Gast';
    description: string = 'Gast nur mit Lesenrechten';
    userPermissions: UserPermission[] = [
        new uploadManagementPermission([
            UploadManagementAction.ReadUploadData
        ]),
        new userManagementPermission([
            UserManagementAction.ReadUser
        ]),
        new statisticPermission([
            StatisticAction.ReadStatistic
        ]),
        new settingsPermission([
            SettingsAction.ReadSettings
        ]),
        new loggerPermission([
            LoggerAction.ReadLogFile
        ]),
        new userRoleManagementPermission([
            UserRoleManagementAction.ReadUserRoles
        ])
    ];
}
