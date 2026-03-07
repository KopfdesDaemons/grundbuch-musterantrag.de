import { computed, inject, Injectable, Signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { HttpClient, httpResource } from '@angular/common/http';
import { newPasswordValidator } from 'src/app/validators/newPassword.validator';
import { AuthService } from './auth.service';
import { UserPermission } from 'common/interfaces/user-permission.interface';

@Injectable({
  providedIn: 'root'
})
export class UserSettingsService {
  private readonly http = inject(HttpClient);
  private readonly formBuilder = inject(FormBuilder);
  private readonly authS = inject(AuthService);

  private readonly _usernameResource = httpResource<{ username: string }>(() => ({
    url: '/api/user-settings/username'
  }));

  readonly usernameResource = this._usernameResource.asReadonly();

  reloadUsername() {
    this._usernameResource.reload();
  }

  private readonly _userRoleResource = httpResource<{
    userRoleName: string;
    userRoleDescription: string;
    userRolePermissions: UserPermission[];
  }>(() => ({
    url: '/api/user-settings/userrole'
  }));

  readonly userRoleResource = this._userRoleResource.asReadonly();

  reloadUserRole() {
    this._userRoleResource.reload();
  }

  getNewPasswordGroup(): FormGroup {
    const formBuilder = this.formBuilder;
    return formBuilder.group(
      {
        oldPassword: ['', Validators.required],
        password: ['', [Validators.required, newPasswordValidator()]],
        confirmPassword: ['', Validators.required]
      },
      { updateOn: 'submit' }
    );
  }

  async changeUsername(newUsername: string): Promise<void> {
    await lastValueFrom(this.http.patch('/api/user-settings/username', { newUsername: newUsername }));
    this._usernameResource.set({ username: newUsername });
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    await lastValueFrom(
      this.http.patch('/api/user-settings/password', {
        oldPassword: oldPassword,
        newPassword: newPassword
      })
    );
    if (!this.usernameResource.hasValue()) return;
    await this.authS.login(this.usernameResource.value().username, newPassword);
  }

  getPermissionsSignal(userPermission: UserPermission): Signal<boolean> {
    return computed(() => {
      const userPermissions = this.userRoleResource.hasValue() ? this.userRoleResource.value().userRolePermissions : [];
      const permissions = userPermissions.find(permission => permission.feature === userPermission.feature);
      if (!permissions) return false;
      let hasAllActions = true;
      for (const action of userPermission.allowedActions) {
        if (!permissions.allowedActions.includes(action)) {
          hasAllActions = false;
          break;
        }
      }
      if (hasAllActions) return true;
      return false;
    });
  }
}
