import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PaginatedDataService } from '../data/paginated-data.service';
import { User } from 'common/models/user.model';
import { UserManagementAction, UserPermission } from 'common/interfaces/user-permission.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly formBuilder = inject(FormBuilder);
  private readonly paginatedDataService = new PaginatedDataService<User>();

  constructor() {
    this.paginatedDataService.init('/api/user-management', user => user.userID!);
  }

  setPageToLoad = this.paginatedDataService.setPageToLoad.bind(this.paginatedDataService);
  loadUsers = this.paginatedDataService.loadData.bind(this.paginatedDataService);
  resetUsers = this.paginatedDataService.resetItems.bind(this.paginatedDataService);

  readonly userData = this.paginatedDataService.data;
  readonly users = this.paginatedDataService.items;
  readonly loadedPages = this.paginatedDataService.loadedPages;
  readonly totalPages = this.paginatedDataService.totalPages;
  readonly totalUsers = this.paginatedDataService.totalItems;

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

  async setInitialPassword(userID: number, newPassword: string): Promise<void> {
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

  getNewUserFormGroup(isDisabled: boolean, defaultUserRoleID: number | undefined = undefined): FormGroup {
    return this.formBuilder.group({
      username: [{ value: '', disabled: isDisabled }, Validators.required],
      userRoleID: [{ value: defaultUserRoleID, disabled: isDisabled }, Validators.required],
      userPassword: [{ value: '', disabled: isDisabled }, Validators.required]
    });
  }

  getEditUserFormGroup(permissions: UserPermission, user: User): FormGroup {
    return this.formBuilder.group({
      username: [
        { value: user.username, disabled: permissions.allowedActions.includes(UserManagementAction.UpdateUsername) ? false : true },
        Validators.required
      ],
      userRoleID: [{ value: user.userRoleID, disabled: permissions.allowedActions.includes(UserManagementAction.UpdateUserRole) ? false : true }],
      userPassword: [{ value: '', disabled: permissions.allowedActions.includes(UserManagementAction.SetInitialPassword) ? false : true }]
    });
  }
}
