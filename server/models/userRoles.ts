import { LoggerAction, MigrationAction, SettingsAction, StatisticAction, UploadManagementAction, UserManagementAction, UserPermission } from 'server/interfaces/userPermission';
import { UserRole } from 'server/interfaces/userRole';
import { loggerPermission, migrationPermission, settingsPermission, statisticPermission, uploadManagementPermission, userManagementPermission } from './userPermissons';

export class Admin implements UserRole {
    name: string = 'admin';
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
            UserManagementAction.DeleteUser
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
        ])
    ];
}

export class Guest implements UserRole {
    name: string = 'guest';
    description: string = 'Gast nur mit Lesenrechten';
    userPermissions: UserPermission[] = [
        new uploadManagementPermission([
            UploadManagementAction.ReadUploadData,
        ]),
        new userManagementPermission([
            UserManagementAction.ReadUser,
        ]),
        new statisticPermission([
            StatisticAction.ReadStatistic
        ]),
        new settingsPermission([
            SettingsAction.ReadSettings,
        ]),
        new loggerPermission([
            LoggerAction.ReadLogFile,
        ])
    ];
}
