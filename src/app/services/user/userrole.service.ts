import { HttpClient, HttpParams, httpResource } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { UserRole } from 'server/interfaces/user-role.interface';
import { UserRoleOption } from '../../models/user-role-option.model';
import {
  Feature,
  LoggerAction,
  MigrationAction,
  SettingsAction,
  StatisticAction,
  UploadManagementAction,
  UserManagementAction,
  UserPermission,
  UserRoleManagementAction
} from 'server/interfaces/user-permission.interface';
import {
  uploadManagementPermission,
  userManagementPermission,
  statisticPermission,
  loggerPermission,
  migrationPermission,
  settingsPermission,
  userRoleManagementPermission
} from 'server/models/user-permissons.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class UserroleService {
  private readonly http = inject(HttpClient);
  private readonly formBuilder = inject(FormBuilder);

  private readonly _allPermissions: UserPermission[] = [
    new uploadManagementPermission(Object.values(UploadManagementAction)),
    new userManagementPermission(Object.values(UserManagementAction)),
    new statisticPermission(Object.values(StatisticAction)),
    new loggerPermission(Object.values(LoggerAction)),
    new migrationPermission(Object.values(MigrationAction)),
    new settingsPermission(Object.values(SettingsAction)),
    new userRoleManagementPermission(Object.values(UserRoleManagementAction))
  ];

  get allPermissions(): UserPermission[] {
    return [...this._allPermissions];
  }

  private readonly _featuresNameMapping = {
    [Feature.UploadManagement]: 'Upload Management',
    [Feature.UserManagement]: 'User Management',
    [Feature.Statistic]: 'Statistic',
    [Feature.Logger]: 'Logger',
    [Feature.Migration]: 'Migration',
    [Feature.Settings]: 'Settings',
    [Feature.UserRoleManagement]: 'User Role Management'
  };

  get featuresNameMapping() {
    return { ...this._featuresNameMapping };
  }

  private readonly _actionsNameMapping = {
    [UploadManagementAction.ReadUploadData]: 'Lesen der Upload-Daten',
    [UploadManagementAction.GetFiles]: 'Herunterladen der Upload-Dateien',
    [UploadManagementAction.DeleteUpload]: 'Löschen einzelner Uploads',
    [UploadManagementAction.DeleteAllUploads]: 'Löschen aller Uploads',
    [UploadManagementAction.DeleteGeneratedFiles]: 'Löschen der generierten Dateien',
    [UploadManagementAction.DeleteAllGeneratedFiles]: 'Löschen aller generierten Dateien',

    [UserManagementAction.CreateUser]: 'Benutzer erstellen',
    [UserManagementAction.ReadUser]: 'Benutzer lesen',
    [UserManagementAction.DeleteUser]: 'Benutzer löschen',
    [UserManagementAction.UpdateUsername]: 'Benutzername aktualisieren',
    [UserManagementAction.UpdateUserRole]: 'Benutzerrolle aktualisieren',
    [UserManagementAction.SetInitialPassword]: 'Initialpasswort setzen',

    [StatisticAction.ReadStatistic]: 'Statistik lesen',

    [LoggerAction.ReadLogFile]: 'Logfile lesen',
    [LoggerAction.ClearLogFile]: 'Logfile leeren',

    [MigrationAction.JSONToDatabaseMigration]: 'JSON zu Datenbankmigration',
    [MigrationAction.AntragToUploadinfoMigration]: 'Antrag zu Uploadinfo',
    [MigrationAction.DocxToOdtMigration]: 'Docx zu Odt',

    [SettingsAction.ReadSettings]: 'Einstellungen lesen',
    [SettingsAction.UpdateSettings]: 'Einstellungen aktualisieren',

    [UserRoleManagementAction.CreateUserRole]: 'Benutzerrolle erstellen',
    [UserRoleManagementAction.ReadUserRoles]: 'Benutzerrolle lesen',
    [UserRoleManagementAction.DeleteUserRole]: 'Benutzerrolle löschen',
    [UserRoleManagementAction.UpdateUserRole]: 'Benutzerrolle aktualisieren'
  };

  get actionsNameMapping() {
    return { ...this._actionsNameMapping };
  }

  private readonly _userRoleOptions = httpResource<UserRoleOption[]>(() => ({
    url: '/api/userrole/get-all-user-roles'
  }));

  readonly userRoleOptions = this._userRoleOptions.asReadonly();

  reloadUserRoleOptions() {
    this._userRoleOptions.reload();
  }

  readonly firstUserRoleID = computed<number | undefined>(() => {
    if (!this.userRoleOptions.hasValue()) return undefined;
    const options = this.userRoleOptions.value();
    return options && options.length > 0 ? options[0].userRoleID : undefined;
  });

  private readonly userRoleInEditID = signal<number | undefined>(undefined);
  readonly userRoleInEditIDSignal = this.userRoleInEditID.asReadonly();

  setUserRoleInEditID(value: number | undefined) {
    this.userRoleInEditID.set(value);
  }

  private readonly _userRoleInEdit = httpResource<UserRole>(() => {
    const userRoleID = this.userRoleInEditID();
    return userRoleID
      ? {
          url: '/api/userrole/',
          params: { userRoleID: userRoleID }
        }
      : undefined;
  });

  reloadUserRoleInEdit() {
    this._userRoleInEdit.reload();
  }

  readonly userRoleInEdit = this._userRoleInEdit.asReadonly();

  async getUserRole(userRoleID: number): Promise<UserRole> {
    const data = await lastValueFrom(
      this.http.get('/api/userrole/', {
        params: new HttpParams().set('userRoleID', userRoleID)
      })
    );
    return data as UserRole;
  }

  async createUserRole(userRole: UserRole): Promise<number> {
    const data = await lastValueFrom(this.http.put('/api/userrole/', { userRole: userRole }));
    const { userRoleID } = data as { userRoleID: number };
    return userRoleID;
  }

  async updateUserRole(userRole: UserRole): Promise<void> {
    await lastValueFrom(this.http.patch('/api/userrole/', { userRole: userRole }));
  }

  getFormGroup(userRole: UserRole = { name: '', description: '', userPermissions: [] }): FormGroup {
    const featureGroups: { [key: string]: FormGroup } = {};

    for (const permission of this.allPermissions) {
      const feature = permission.feature;
      const actions = permission.allowedActions;

      const actionControls: { [key: string]: boolean } = {};

      const userFeature = userRole.userPermissions.find(p => p.feature === feature);

      for (const action of actions) {
        actionControls[action] = userFeature ? userFeature.allowedActions.includes(action) : false;
      }

      featureGroups[feature] = this.formBuilder.group(actionControls);
    }

    return this.formBuilder.group({
      userRoleID: [{ value: userRole.userRoleID, disabled: true }],
      name: [userRole.name, Validators.required],
      description: [userRole.description],
      features: this.formBuilder.group(featureGroups)
    });
  }

  getUserRoleFromFormGroup(form: FormGroup): UserRole {
    const userRole: UserRole = {
      userRoleID: form.get('userRoleID')?.value,
      name: form.get('name')?.value,
      description: form.get('description')?.value,
      userPermissions: []
    };

    const featureFormGroups = form.get('features')?.value;
    if (featureFormGroups) {
      for (const feature in featureFormGroups) {
        const actionControls = featureFormGroups[feature];
        const allowedActions = Object.keys(actionControls).filter(action => actionControls[action]);

        if (allowedActions.length > 0) {
          userRole.userPermissions.push({
            feature: feature as Feature,
            allowedActions: allowedActions as (
              | UploadManagementAction
              | UserManagementAction
              | StatisticAction
              | LoggerAction
              | MigrationAction
              | SettingsAction
              | UserRoleManagementAction
            )[]
          });
        }
      }
    }
    return userRole;
  }

  async deleteUserRole(userRoleIDs: number[]): Promise<void> {
    await lastValueFrom(
      this.http.delete('/api/userrole/', {
        params: new HttpParams().set('userRoleIDs', userRoleIDs.toString())
      })
    );
  }
}
