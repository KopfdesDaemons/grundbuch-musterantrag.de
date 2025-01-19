/* eslint-disable no-unused-vars */

export enum PermissionAction {
    Create = 'create',
    Read = 'read',
    Update = 'update',
    Delete = 'delete'
}

export enum Feature {
    UploadManagement = 'uploadManagement',
    UserManagement = 'userManagement',
    Statistic = 'statistic',
    Logger = 'logger',
    Migration = 'migration',
    Settings = 'settings'
}

export class UserPermission {
    feature: Feature;
    allowedActions: PermissionAction[];

    constructor(feature: Feature, actions: PermissionAction[]) {
        this.feature = feature;
        this.allowedActions = actions;
    }
}