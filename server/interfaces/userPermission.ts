/* eslint-disable no-unused-vars */

export enum Feature {
    UploadManagement = 'uploadManagement',
    UserManagement = 'userManagement',
    Statistic = 'statistic',
    Logger = 'logger',
    Migration = 'migration',
    Settings = 'settings',
    UserRoleManagement = 'userRoleManagement'
}

export interface UserPermission {
    feature: Feature;
    allowedActions: (UploadManagementAction | UserManagementAction | StatisticAction | LoggerAction | MigrationAction | SettingsAction | UserRoleManagementAction)[];
}

export enum UploadManagementAction {
    ReadUploadData = 'ReadUploadData',
    DeleteUpload = 'DeleteUpload',
    DeleteAllUploads = 'DeleteAllUploads',
    DeleteGeneratedFiles = 'DeleteGeneratedFiles',
    DeleteAllGeneratedFiles = 'DeleteAllGeneratedFiles',
    GetFiles = 'GetFiles'
}

export enum UserManagementAction {
    CreateUser = 'CreateUser',
    ReadUser = 'ReadUser',
    DeleteUser = 'DeleteUser',
    UpdateUsername = 'UpdateUsername',
    SetInitialPassword = 'SetInitialPassword',
    UpdateUserPassword = 'UpdateUserPassword',
    UpdateUserRole = 'updateUserRole',
}

export enum StatisticAction {
    ReadStatistic = 'ReadStatistic',
}

export enum LoggerAction {
    ReadLogFile = 'ReadLogFile',
    ClearLogFile = 'ClearLogFile'
}

export enum MigrationAction {
    JSONToDatabaseMigration = 'JSONToDatabaseMigration',
    AntragToUploadinfoMigration = 'AntragToUploadinfoMigration'
}

export enum SettingsAction {
    ReadSettings = 'ReadSettings',
    UpdateSettings = 'UpdateSettings'
}

export enum UserRoleManagementAction {
    CreateUserRole = 'CreateUserRole',
    DeleteUserRole = 'DeleteUserRole'
}