import { Feature, LoggerAction, MigrationAction, SettingsAction, StatisticAction, UploadManagementAction, UserManagementAction, UserPermission, UserRoleManagementAction } from "server/interfaces/userPermission";

export class uploadManagementPermission implements UserPermission {
    feature: Feature = Feature.UploadManagement;
    allowedActions: UploadManagementAction[];

    constructor(allowedActions: UploadManagementAction[]) {
        this.allowedActions = allowedActions;
    }
}

export class userManagementPermission implements UserPermission {
    feature: Feature = Feature.UserManagement;
    allowedActions: UserManagementAction[];

    constructor(allowedActions: UserManagementAction[]) {
        this.allowedActions = allowedActions;
    }
}

export class statisticPermission implements UserPermission {
    feature: Feature = Feature.Statistic;
    allowedActions: StatisticAction[];

    constructor(allowedActions: StatisticAction[]) {
        this.allowedActions = allowedActions;
    }
}

export class loggerPermission implements UserPermission {
    feature: Feature = Feature.Logger;
    allowedActions: LoggerAction[];

    constructor(allowedActions: LoggerAction[]) {
        this.allowedActions = allowedActions;
    }
}

export class migrationPermission implements UserPermission {
    feature: Feature = Feature.Migration;
    allowedActions: MigrationAction[];

    constructor(allowedActions: MigrationAction[]) {
        this.allowedActions = allowedActions;
    }
}

export class settingsPermission implements UserPermission {
    feature: Feature = Feature.Settings;
    allowedActions: SettingsAction[];

    constructor(allowedActions: SettingsAction[]) {
        this.allowedActions = allowedActions;
    }
}

export class userRoleManagementPermission implements UserPermission {
    feature: Feature = Feature.UserRoleManagement;
    allowedActions: UserRoleManagementAction[];

    constructor(allowedActions: UserRoleManagementAction[]) {
        this.allowedActions = allowedActions;
    }
}