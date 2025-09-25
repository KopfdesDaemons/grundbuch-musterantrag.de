import { HttpClient, httpResource } from '@angular/common/http';
import { computed, inject, Injectable, linkedSignal, signal } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from '../../models/user.model';
import { UserData } from 'src/app/interfaces/userData';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly formBuilder = inject(FormBuilder);

  private readonly pageToLoad = signal<number>(1);

  setPageToLoad(value: number) {
    this.pageToLoad.set(value);
  }

  private readonly _userData = httpResource<UserData>(() => ({
    url: '/api/user-management',
    params: {
      page: this.pageToLoad()
    }
  }));

  readonly userData = this._userData.asReadonly();

  loadUsers() {
    this._userData.reload();
  }

  private readonly _users = linkedSignal<UserData | undefined, User[]>({
    source: () => (this.userData.hasValue() ? this.userData.value() : undefined),
    computation: (source, previous) => {
      if (!source) {
        return previous?.value ?? [];
      }

      // When loading page 1, start a new list.
      if (source.page === 1) {
        return source.files;
      }

      // For subsequent pages, we append to the existing list.
      if (previous?.value && Array.isArray(previous.value)) {
        const existingIds = new Set(previous.value.map(u => u.userID));
        const newUsers = source.files.filter(u => !existingIds.has(u.userID));
        if (newUsers.length === 0) return previous.value;
        return previous.value.concat(newUsers);
      }

      // Fallback
      return source.files;
    }
  });

  readonly users = this._users.asReadonly();

  resetUsers() {
    this._users.set([]);
  }

  readonly loadedPages = computed(() => {
    if (!this.userData.hasValue()) return 0;
    return this.userData.value().page;
  });

  readonly totalPages = computed<number | undefined>(() => (this.userData.hasValue() ? this.userData.value()?.totalPages : undefined));
  readonly totalUsers = linkedSignal<UserData | undefined, number | undefined>({
    source: () => (this.userData.hasValue() ? this.userData.value() : undefined),
    computation: (source, previous) => {
      return source ? source.totalUsers : previous?.value;
    }
  }).asReadonly();

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
