import { UserRole } from 'common/interfaces/user-role.interface';
import {
  LoggerAction,
  MigrationAction,
  SettingsAction,
  StatisticAction,
  UploadManagementAction,
  UserManagementAction,
  UserPermission,
  UserRoleManagementAction
} from 'common/interfaces/user-permission.interface';
import {
  loggerPermission,
  migrationPermission,
  settingsPermission,
  statisticPermission,
  uploadManagementPermission,
  userManagementPermission,
  userRoleManagementPermission
} from './user-permissons.model';

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
    new statisticPermission([StatisticAction.ReadStatistic]),
    new settingsPermission([SettingsAction.ReadSettings, SettingsAction.UpdateSettings]),
    new loggerPermission([LoggerAction.ReadLogFile, LoggerAction.ClearLogFile]),
    new migrationPermission([
      MigrationAction.JSONToDatabaseMigration,
      MigrationAction.AntragToUploadinfoMigration,
      MigrationAction.DocxToOdtMigration
    ]),
    new userRoleManagementPermission([
      UserRoleManagementAction.CreateUserRole,
      UserRoleManagementAction.DeleteUserRole,
      UserRoleManagementAction.ReadUserRoles,
      UserRoleManagementAction.UpdateUserRole
    ])
  ];
}

export class Guest implements UserRole {
  name: string = 'Gast';
  description: string = 'Gast nur mit Lesenrechten';
  userPermissions: UserPermission[] = [
    new uploadManagementPermission([UploadManagementAction.ReadUploadData]),
    new userManagementPermission([UserManagementAction.ReadUser]),
    new statisticPermission([StatisticAction.ReadStatistic]),
    new settingsPermission([SettingsAction.ReadSettings]),
    new loggerPermission([LoggerAction.ReadLogFile]),
    new userRoleManagementPermission([UserRoleManagementAction.ReadUserRoles])
  ];
}
