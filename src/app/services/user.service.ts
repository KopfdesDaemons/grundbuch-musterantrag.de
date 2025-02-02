import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { AuthService } from './auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  http = inject(HttpClient);
  authS = inject(AuthService);
  formBuilder = new FormBuilder();


  async getAllUsersJSON(): Promise<[]> {
    const data = await lastValueFrom(
      this.http.get('/api/user', {
        headers: this.authS.getAuthHeader()
      })
    );
    return data as [];
  }

  async deleteUsers(userIDs: number[]): Promise<void> {
    await lastValueFrom(
      this.http.delete('/api/user', {
        headers: this.authS.getAuthHeader(),
        body: { userIDs: userIDs }
      })
    );
  }

  async createUser(username: string, userRole: string, password: string, userRoleID: number): Promise<void> {
    await lastValueFrom(
      this.http.put('/api/user', {
        username: username,
        userRole: userRole,
        password: password,
        userRoleID: userRoleID
      }, {
        headers: this.authS.getAuthHeader()
      })
    );
  }

  async updateUsername(userID: number, newUsername: string): Promise<void> {
    await lastValueFrom(
      this.http.patch('/api/user/username', {
        userID: userID,
        newUsername: newUsername
      }, {
        headers: this.authS.getAuthHeader()
      })
    );
  }

  async setinitialpassword(userID: number, newPassword: string): Promise<void> {
    await lastValueFrom(
      this.http.patch('/api/user/setinitialpassword', {
        userID: userID,
        newPassword: newPassword
      }, {
        headers: this.authS.getAuthHeader()
      })
    );
  }

  async updatePassword(username: string, oldPassword: string, newPassword: string): Promise<void> {
    await lastValueFrom(
      this.http.patch('/api/user/updatepassword', {
        username: username,
        oldPassword: oldPassword,
        newPassword: newPassword
      }, {
        headers: this.authS.getAuthHeader()
      })
    );
  }

  async updateUserRole(userID: number, userRoleID: number): Promise<void> {
    await lastValueFrom(
      this.http.patch('/api/user/userrole', {
        userID: userID,
        userRoleID: userRoleID
      }, {
        headers: this.authS.getAuthHeader()
      })
    );
  }

  getNewUserFormGroup(defaultUserRoleID: number | undefined = undefined): FormGroup {
    return this.formBuilder.group({
      username: ['', Validators.required],
      userRoleID: [defaultUserRoleID, Validators.required],
      userPassword: ['', Validators.required]
    });
  }

  getEditUserFormGroup(user: User): FormGroup {
    return this.formBuilder.group({
      username: [''],
      userRoleID: [user.userRoleID],
      userPassword: ['']
    });
  }
}