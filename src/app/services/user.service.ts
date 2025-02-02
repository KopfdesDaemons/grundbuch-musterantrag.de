import { HttpClient, HttpHeaders } from '@angular/common/http';
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
        headers: new HttpHeaders({ 'Authorization': `Bearer ${this.authS.authToken}` })
      })
    );
    return data as [];
  }

  async deleteUsers(userIDs: number[]): Promise<void> {
    await lastValueFrom(
      this.http.delete('/api/user', {
        headers: new HttpHeaders({ 'Authorization': `Bearer ${this.authS.authToken}` }),
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
        headers: new HttpHeaders({ 'Authorization': `Bearer ${this.authS.authToken}` })
      })
    );
  }

  async updateUsername(userID: number, newUsername: string): Promise<void> {
    await lastValueFrom(
      this.http.patch('/api/user/username', {
        userID: userID,
        newUsername: newUsername
      }, {
        headers: new HttpHeaders({ 'Authorization': `Bearer ${this.authS.authToken}` })
      })
    );
  }

  async setinitialpassword(userID: number, newPassword: string): Promise<void> {
    await lastValueFrom(
      this.http.patch('/api/user/setinitialpassword', {
        userID: userID,
        newPassword: newPassword
      }, {
        headers: new HttpHeaders({ 'Authorization': `Bearer ${this.authS.authToken}` })
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
        headers: new HttpHeaders({ 'Authorization': `Bearer ${this.authS.authToken}` })
      })
    );
  }

  async updateUserRole(userID: number, userRoleID: number): Promise<void> {
    await lastValueFrom(
      this.http.patch('/api/user/userrole', {
        userID: userID,
        userRoleID: userRoleID
      }, {
        headers: new HttpHeaders({ 'Authorization': `Bearer ${this.authS.authToken}` })
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