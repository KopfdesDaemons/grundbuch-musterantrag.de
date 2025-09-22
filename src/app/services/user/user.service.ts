import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private formBuilder = new FormBuilder();

  allUsers = httpResource<User[]>(() => ({
    url: '/api/user-management'
  }));

  async deleteUsers(userIDs: number[]): Promise<void> {
    await lastValueFrom(
      this.http.delete('/api/user-management', {
        body: { userIDs: userIDs }
      })
    );
  }

  async createUser(username: string, userRole: string, password: string, userRoleID: number): Promise<void> {
    await lastValueFrom(
      this.http.put('/api/user-management', {
        username: username,
        userRole: userRole,
        password: password,
        userRoleID: userRoleID
      })
    );
  }

  async updateUsername(userID: number, newUsername: string): Promise<void> {
    await lastValueFrom(
      this.http.patch('/api/user-management/username', {
        userID: userID,
        newUsername: newUsername
      })
    );
  }

  async setinitialpassword(userID: number, newPassword: string): Promise<void> {
    await lastValueFrom(
      this.http.patch('/api/user-management/setinitialpassword', {
        userID: userID,
        newPassword: newPassword
      })
    );
  }

  async updatePassword(username: string, oldPassword: string, newPassword: string): Promise<void> {
    await lastValueFrom(
      this.http.patch('/api/user-management/updatepassword', {
        username: username,
        oldPassword: oldPassword,
        newPassword: newPassword
      })
    );
  }

  async updateUserRole(userID: number, userRoleID: number): Promise<void> {
    await lastValueFrom(
      this.http.patch('/api/user-management/userrole', {
        userID: userID,
        userRoleID: userRoleID
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
      username: [user.username],
      userRoleID: [user.userRoleID],
      userPassword: ['']
    });
  }
}
