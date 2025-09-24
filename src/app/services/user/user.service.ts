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
  private http = inject(HttpClient);
  private formBuilder = new FormBuilder();

  pageToLoad = signal<number>(1);

  usersResource = httpResource<UserData>(() => ({
    url: '/api/user-management',
    params: {
      page: this.pageToLoad()
    }
  }));

  users = linkedSignal<UserData | undefined, User[]>({
    source: () => (this.usersResource.hasValue() ? this.usersResource.value() : undefined),
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
        return previous.value.concat(source.files);
      }

      // Fallback
      return source.files;
    }
  });

  loadedPages = computed(() => {
    if (!this.usersResource.hasValue()) return 0;
    return this.usersResource.value().page;
  });

  totalPages = computed<number | undefined>(() => (this.usersResource.hasValue() ? this.usersResource.value()?.totalPages : undefined));
  totalFiles = computed<number | undefined>(() => (this.usersResource.hasValue() ? this.usersResource.value()?.totalUsers : undefined));

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
