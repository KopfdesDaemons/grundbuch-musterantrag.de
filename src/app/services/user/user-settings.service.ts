import { inject, Injectable, resource } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserSettingsService {
  authS = inject(AuthService);
  http = inject(HttpClient);

  username = resource({
    loader: async () => await this.loadUsername()
  });

  userRole = resource({
    loader: async () => await this.loadUserRole()
  });

  private async loadUsername(): Promise<string> {
    const response = await lastValueFrom(
      this.http.get('/api/user-settings/username', {
        headers: this.authS.getAuthHeader()
      })
    );
    const data = response as { username: string };
    return data.username;
  }

  private async loadUserRole(): Promise<{ userRoleName: string; userRoleDescription: string }> {
    const response = await lastValueFrom(
      this.http.get('/api/user-settings/userrole', {
        headers: this.authS.getAuthHeader()
      })
    );
    const data = response as { userRoleName: string; userRoleDescription: string };
    return data;
  }

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
    this.username.set(newUsername);
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
