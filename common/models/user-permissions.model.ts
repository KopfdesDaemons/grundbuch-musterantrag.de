import {
  BackupAction,
  Feature,
  LoggerAction,
  MigrationAction,
  SettingsAction,
  StatisticAction,
  UploadManagementAction,
  UserManagementAction,
  UserPermission,
  UserRoleManagementAction
} from 'common/interfaces/user-permission.interface';

export class UploadManagementPermission implements UserPermission {
  feature: Feature = Feature.UploadManagement;
  allowedActions: UploadManagementAction[];

  constructor(allowedActions: UploadManagementAction[]) {
    this.allowedActions = allowedActions;
  }
}

export class UserManagementPermission implements UserPermission {
  feature: Feature = Feature.UserManagement;
  allowedActions: UserManagementAction[];

  constructor(allowedActions: UserManagementAction[]) {
    this.allowedActions = allowedActions;
  }
}

export class StatisticPermission implements UserPermission {
  feature: Feature = Feature.Statistic;
  allowedActions: StatisticAction[];

  constructor(allowedActions: StatisticAction[]) {
    this.allowedActions = allowedActions;
  }
}

export class LoggerPermission implements UserPermission {
  feature: Feature = Feature.Logger;
  allowedActions: LoggerAction[];

  constructor(allowedActions: LoggerAction[]) {
    this.allowedActions = allowedActions;
  }
}

export class MigrationPermission implements UserPermission {
  feature: Feature = Feature.Migration;
  allowedActions: MigrationAction[];

  constructor(allowedActions: MigrationAction[]) {
    this.allowedActions = allowedActions;
  }
}

export class SettingsPermission implements UserPermission {
  feature: Feature = Feature.Settings;
  allowedActions: SettingsAction[];

  constructor(allowedActions: SettingsAction[]) {
    this.allowedActions = allowedActions;
  }
}

export class UserRoleManagementPermission implements UserPermission {
  feature: Feature = Feature.UserRoleManagement;
  allowedActions: UserRoleManagementAction[];

  constructor(allowedActions: UserRoleManagementAction[]) {
    this.allowedActions = allowedActions;
  }
}

export class BackupPermission implements UserPermission {
  feature: Feature = Feature.Backup;
  allowedActions: BackupAction[];

  constructor(allowedActions: BackupAction[]) {
    this.allowedActions = allowedActions;
  }
}
