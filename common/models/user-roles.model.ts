import { UserRole } from 'common/interfaces/user-role.interface';
import {
  BackupAction,
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
  LoggerPermission,
  MigrationPermission,
  SettingsPermission,
  StatisticPermission,
  UploadManagementPermission,
  UserManagementPermission,
  UserRoleManagementPermission,
  BackupPermission
} from './user-permissions.model';

export class Admin implements UserRole {
  name: string = 'Admin';
  description: string = 'Administrator mit unlimitierten Rechten';
  userPermissions: UserPermission[] = [
    new UploadManagementPermission([
      UploadManagementAction.ReadUploadData,
      UploadManagementAction.GetFiles,
      UploadManagementAction.DeleteUpload,
      UploadManagementAction.DeleteGeneratedFiles,
      UploadManagementAction.DeleteAllUploads,
      UploadManagementAction.DeleteAllGeneratedFiles
    ]),
    new UserManagementPermission([
      UserManagementAction.CreateUser,
      UserManagementAction.ReadUser,
      UserManagementAction.DeleteUser,
      UserManagementAction.UpdateUsername,
      UserManagementAction.UpdateUserRole,
      UserManagementAction.SetInitialPassword
    ]),
    new StatisticPermission([StatisticAction.ReadStatistic]),
    new SettingsPermission([SettingsAction.ReadSettings, SettingsAction.UpdateSettings]),
    new LoggerPermission([LoggerAction.ReadLogFile, LoggerAction.ClearLogFile]),
    new MigrationPermission([
      MigrationAction.JSONToDatabaseMigration,
      MigrationAction.AntragToUploadinfoMigration,
      MigrationAction.DocxToOdtMigration
    ]),
    new UserRoleManagementPermission([
      UserRoleManagementAction.CreateUserRole,
      UserRoleManagementAction.DeleteUserRole,
      UserRoleManagementAction.ReadUserRoles,
      UserRoleManagementAction.UpdateUserRole
    ]),
    new BackupPermission([BackupAction.CreateBackup, BackupAction.RestoreBackup])
  ];
}

export class Guest implements UserRole {
  name: string = 'Gast';
  description: string = 'Gast nur mit Lesenrechten';
  userPermissions: UserPermission[] = [
    new UploadManagementPermission([UploadManagementAction.ReadUploadData]),
    new UserManagementPermission([UserManagementAction.ReadUser]),
    new StatisticPermission([StatisticAction.ReadStatistic]),
    new SettingsPermission([SettingsAction.ReadSettings]),
    new LoggerPermission([LoggerAction.ReadLogFile]),
    new UserRoleManagementPermission([UserRoleManagementAction.ReadUserRoles])
  ];
}
