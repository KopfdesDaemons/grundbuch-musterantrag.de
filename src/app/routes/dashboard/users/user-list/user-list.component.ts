import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { UserroleService } from 'src/app/services/user/userrole.service';
import { ProgressSpinnerComponent } from '../../../../components/progress-spinner/progress-spinner.component';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorDisplayComponent } from '../../../../components/error-display/error-display.component';
import { UserRow } from 'src/app/interfaces/userRow';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-users',
  imports: [FormsModule, ReactiveFormsModule, NgClass, ProgressSpinnerComponent, ErrorDisplayComponent],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent {
  userS = inject(UserService);
  userRoleS = inject(UserroleService);
  error = signal<Error | null>(null);

  rows = computed<UserRow[]>(() => {
    if (this.userS.allUsers.isLoading() || this.userS.allUsers.error()) return [];
    const users = this.userS.allUsers.value() ?? [];
    return users.map(user => ({ isChecked: signal(false), user: user, editMode: false, editForm: undefined }));
  });

  selectedRows = computed<UserRow[]>(() => this.rows().filter(row => row.isChecked()));

  reload() {
    this.error.set(null);
    this.userS.allUsers.reload();
  }

  async deleteUsers(): Promise<void> {
    try {
      this.error.set(null);
      const userIDs = this.selectedRows()
        .map(row => row.user.userID)
        .filter((userID): userID is number => userID !== undefined);
      if (userIDs.length === 0) return;
      if (!confirm(`Soll wirklich ${userIDs.length} ausgewählte Benutzer gelöscht werden?`)) return;
      await this.userS.deleteUsers(userIDs);
      this.userS.allUsers.reload();
    } catch (error) {
      if (error instanceof Error || error instanceof HttpErrorResponse) {
        this.error.set(error);
      }
    }
  }

  toggleEditMode(row: UserRow): void {
    row.editMode = !row.editMode;
    row.editForm = this.userS.getEditUserFormGroup(row.user);
    row.editForm.get('userRole')?.setValue(row.user.userRole.name);
  }

  async saveUser(row: UserRow): Promise<void> {
    try {
      this.error.set(null);
      if (!row.user.userID) return;
      const newUsername = row.editForm?.get('username')?.value;
      const newPassword = row.editForm?.get('userPassword')?.value;
      const userRoleID = row.editForm?.get('userRoleID')?.value;
      if (newUsername !== row.user.username) await this.userS.updateUsername(row.user.userID, newUsername);
      if (newPassword) await this.userS.setinitialpassword(row.user.userID, newPassword);
      if (userRoleID != row.user.userRole.userRoleID) await this.userS.updateUserRole(row.user.userID, userRoleID);
      this.userS.allUsers.reload();
    } catch (error) {
      if (error instanceof Error || error instanceof HttpErrorResponse) {
        this.error.set(error);
      }
    }
  }
}
