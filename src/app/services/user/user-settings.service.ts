import { inject, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { HttpClient, httpResource } from '@angular/common/http';
import { newPassowrdValidator } from 'src/app/validators/newPassword.validator';

@Injectable({
  providedIn: 'root'
})
export class UserSettingsService {
  private http = inject(HttpClient);

  usernameResource = httpResource<{ username: string }>(() => ({
    url: '/api/user-settings/username'
  }));

  userRoleResource = httpResource<{
    userRoleName: string;
    userRoleDescription: string;
  }>(() => ({
    url: '/api/user-settings/userrole'
  }));

  getNewPasswordGroup(): FormGroup {
    const formBuilder = new FormBuilder();
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
    this.usernameResource.set({ username: newUsername });
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    await lastValueFrom(
      this.http.patch('/api/user-settings/password', {
        oldPassword: oldPassword,
        newPassword: newPassword
      })
    );
  }
}
