import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { AuthService } from './auth.service';
import { UserRole } from 'server/interfaces/userRole';
import { UserRoleOption } from '../models/userRoleOption';
import { Feature, LoggerAction, MigrationAction, SettingsAction, StatisticAction, UploadManagementAction, UserManagementAction, UserPermission, UserRoleManagementAction } from 'server/interfaces/userPermission';
import { uploadManagementPermission, userManagementPermission, statisticPermission, loggerPermission, migrationPermission, settingsPermission, userRoleManagementPermission } from 'server/models/userPermissons';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class UserroleService {
  authS = inject(AuthService);
  http = inject(HttpClient);

  formBuilder = new FormBuilder();


  allPermissions: UserPermission[] = [
    new uploadManagementPermission(Object.values(UploadManagementAction)),
    new userManagementPermission(Object.values(UserManagementAction)),
    new statisticPermission(Object.values(StatisticAction)),
    new loggerPermission(Object.values(LoggerAction)),
    new migrationPermission(Object.values(MigrationAction)),
    new settingsPermission(Object.values(SettingsAction)),
    new userRoleManagementPermission(Object.values(UserRoleManagementAction))
  ];

  featuresNameMapping = {
    [Feature.UploadManagement]: 'Upload Management',
    [Feature.UserManagement]: 'User Management',
    [Feature.Statistic]: 'Statistic',
    [Feature.Logger]: 'Logger',
    [Feature.Migration]: 'Migration',
    [Feature.Settings]: 'Settings',
    [Feature.UserRoleManagement]: 'User Role Management'
  }

  actionsNameMapping = {
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
    [UserManagementAction.UpdateUserPassword]: 'Benutzerpasswort aktualisieren',
    [UserManagementAction.UpdateUserRole]: 'Benutzerrolle aktualisieren',
    [UserManagementAction.SetInitialPassword]: 'Initialpasswort setzen',

    [StatisticAction.ReadStatistic]: 'Statistik lesen',

    [LoggerAction.ReadLogFile]: 'Logfile lesen',
    [LoggerAction.ClearLogFile]: 'Logfile leeren',

    [MigrationAction.JSONToDatabaseMigration]: 'JSON zu Datenbankmigration',
    [MigrationAction.AntragToUploadinfoMigration]: 'Antrag zu Uploadinfo',

    [SettingsAction.ReadSettings]: 'Einstellungen lesen',
    [SettingsAction.UpdateSettings]: 'Einstellungen aktualisieren',

    [UserRoleManagementAction.CreateUserRole]: 'Benutzerrolle erstellen',
    [UserRoleManagementAction.ReadUserRoles]: 'Benutzerrolle lesen',
    [UserRoleManagementAction.DeleteUserRole]: 'Benutzerrolle löschen',
    [UserRoleManagementAction.UpdateUserRole]: 'Benutzerrolle aktualisieren'
  }

  async getAllUserRoles(): Promise<UserRoleOption[]> {
    try {
      const data = await lastValueFrom(
        this.http.get('/api/userrole/get-all-user-roles', {
          headers: new HttpHeaders({ 'Authorization': `Bearer ${this.authS.getToken()}` })
        })
      );
      return data as UserRoleOption[];
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async getUserRole(userRoleID: number): Promise<UserRole> {
    try {
      const data = await lastValueFrom(
        this.http.get('/api/userrole/', {
          headers: new HttpHeaders({ 'Authorization': `Bearer ${this.authS.getToken()}` }),
          params: new HttpParams().set('userRoleID', userRoleID)
        })
      );
      return data as UserRole;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async createUserRole(userRole: UserRole): Promise<void> {
    try {
      await lastValueFrom(
        this.http.put('/api/userrole/', { userRole: userRole }, {
          headers: new HttpHeaders({ 'Authorization': `Bearer ${this.authS.getToken()}` })
        })
      );
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async updateUserRole(userRole: UserRole): Promise<void> {
    try {
      await lastValueFrom(
        this.http.patch('/api/userrole/', { userRole: userRole }, {
          headers: new HttpHeaders({ 'Authorization': `Bearer ${this.authS.getToken()}` })
        })
      );
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  getFormGroup(userRole: UserRole = { name: '', description: '', userPermissions: [] }): FormGroup {
    const featureGroups: { [key: string]: FormGroup } = {};

    for (const permission of this.allPermissions) {
      const feature = permission.feature;
      const actions = permission.allowedActions;

      const actionControls: { [key: string]: boolean } = {};

      const userFeature = userRole.userPermissions.find(p => p.feature === feature);

      for (const action of actions) {
        actionControls[action] = userFeature
          ? userFeature.allowedActions.includes(action)
          : false;
      }

      featureGroups[feature] = this.formBuilder.group(actionControls);
    }

    return this.formBuilder.group({
      userRoleID: [{ value: userRole.userRoleID, disabled: true }],
      name: [userRole.name],
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
            allowedActions: allowedActions as (UploadManagementAction | UserManagementAction | StatisticAction | LoggerAction | MigrationAction | SettingsAction | UserRoleManagementAction)[]
          });
        }
      }
    }
    return userRole;
  }

  async deleteUserRole(userRoleIDs: number[]): Promise<void> {
    try {
      await lastValueFrom(
        this.http.delete('/api/userrole/', {
          headers: new HttpHeaders({ 'Authorization': `Bearer ${this.authS.getToken()}` }),
          body: { userRoleIDs: userRoleIDs }
        })
      );
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
