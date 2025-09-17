import { Component, inject, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { User } from 'src/app/models/user.model';
import { UserroleService } from 'src/app/services/user/userrole.service';
import { UserRoleOption } from 'src/app/models/user-role-option.model';
import { ProgressSpinnerComponent } from '../../../../components/progress-spinner/progress-spinner.component';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorDisplayComponent } from '../../../../components/error-display/error-display.component';

@Component({
  selector: 'app-users',
  imports: [FormsModule, ReactiveFormsModule, NgClass, ProgressSpinnerComponent, ErrorDisplayComponent],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit {
  userS = inject(UserService);
  userRoleS = inject(UserroleService);
  error: HttpErrorResponse | null = null;
  errorMessage: string = 'Fehler beim Laden der Benutzer';
  isLoading = false;
  rows: { isChecked: boolean; user: User; editMode: boolean; editForm: FormGroup | undefined }[] = [];
  userRoles: UserRoleOption[] = [];

  async ngOnInit(): Promise<void> {
    await Promise.all([this.loadUsers(), this.userRoleS.getAllUserRoles().then(userRoles => (this.userRoles = userRoles))]);
  }

  async loadUsers(): Promise<void> {
    try {
      this.error = null;
      this.isLoading = true;
      const users = await this.userS.getAllUsersJSON();
      this.rows = users.map(user => ({ isChecked: false, user: user, editMode: false, editForm: undefined }));
      this.isLoading = false;
    } catch (error) {
      this.isLoading = false;
      if (error instanceof HttpErrorResponse) {
        this.error = error;
      }
    }
  }

  async deleteUsers(): Promise<void> {
    try {
      this.error = null;
      const userIDs = this.rows
        .filter(row => row.isChecked)
        .map(row => row.user.userID)
        .filter((userID): userID is number => userID !== undefined);
      if (userIDs.length === 0) return;
      await this.userS.deleteUsers(userIDs);
      await this.loadUsers();
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        this.error = error;
      }
    }
  }

  toggleEditMode(row: { isChecked: boolean; user: User; editMode: boolean; editForm: FormGroup | undefined }): void {
    row.editMode = !row.editMode;
    row.editForm = this.userS.getEditUserFormGroup(row.user);
    row.editForm.get('userRole')?.setValue(row.user.userRole.name);
  }

  async saveUser(row: { isChecked: boolean; user: User; editMode: boolean; editForm: FormGroup | undefined }): Promise<void> {
    try {
      this.error = null;
      if (!row.user.userID) return;
      const newUsername = row.editForm?.get('username')?.value;
      const newPassword = row.editForm?.get('userPassword')?.value;
      const userRoleID = row.editForm?.get('userRoleID')?.value;
      if (newUsername) await this.userS.updateUsername(row.user.userID, newUsername);
      if (newPassword) await this.userS.setinitialpassword(row.user.userID, newPassword);
      if (userRoleID != row.user.userRole.userRoleID) await this.userS.updateUserRole(row.user.userID, userRoleID);
      await this.loadUsers();
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        this.error = error;
      }
    }
  }
}
