import { inject, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { HttpClient, httpResource } from '@angular/common/http';
import { newPassowrdValidator } from 'src/app/validators/newPassword.validator';
import { AuthService } from './auth.service';

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
        password: ['', [Validators.required, newPassowrdValidator()]],
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
}
