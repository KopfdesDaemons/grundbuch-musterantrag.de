import { inject, Injectable } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { AuthService } from './auth.service';
import { HttpClient, httpResource } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserSettingsService {
  authS = inject(AuthService);
  http = inject(HttpClient);

  usernameResource = httpResource<{ username: string }>(() => ({
    url: '/api/user-settings/username',
    headers: this.authS.getAuthHeader()
  }));

  userRoleResource = httpResource<{ userRoleName: string; userRoleDescription: string }>(() => ({
    url: '/api/user-settings/userrole',
    headers: this.authS.getAuthHeader()
  }));

  getNewPasswordGroup(): FormGroup {
    const formBuilder = new FormBuilder();
    return formBuilder.group({
      oldPassword: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  async changeUsername(newUsername: string): Promise<void> {
    await lastValueFrom(
      this.http.patch(
        '/api/user-settings/username',
        { newUsername: newUsername },
        {
          headers: this.authS.getAuthHeader()
        }
      )
    );
    this.usernameResource.set({ username: newUsername });
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    await lastValueFrom(
      this.http.patch(
        '/api/user-settings/password',
        {
          oldPassword: oldPassword,
          newPassword: newPassword
        },
        {
          headers: this.authS.getAuthHeader()
        }
      )
    );
  }
}
