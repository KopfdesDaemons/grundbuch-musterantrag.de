import { AfterViewInit, Component, inject } from '@angular/core';
import { User } from 'server/models/user';
import { UserService } from 'src/app/services/user.service';
import { faTrash, faRotateRight, faEdit } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-users',
  imports: [FaIconComponent, FormsModule, ReactiveFormsModule, NgClass],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements AfterViewInit {
  userS = inject(UserService);
  error: boolean = false;
  rows: { isChecked: boolean, user: User, editMode: boolean, editForm: FormGroup | undefined }[] = [];

  faTrash = faTrash;
  faRotateRight = faRotateRight;
  faEdit = faEdit;

  async ngAfterViewInit(): Promise<void> {
    await this.loadUsers()
  }

  async loadUsers(): Promise<void> {
    try {
      this.error = false;
      const users = await this.userS.getAllUsersJSON();
      this.rows = users.map(user => ({ isChecked: false, user: user, editMode: false, editForm: undefined }));
    } catch {
      this.error = true;
    }
  }

  async deleteUsers(): Promise<void> {
    const userIDs = this.rows
      .filter(row => row.isChecked)
      .map(row => row.user.userID)
      .filter((userID): userID is number => userID !== undefined);
    if (userIDs.length === 0) return;
    await this.userS.deleteUsers(userIDs);
    await this.loadUsers();
  }

  toggleEditMode(row: { isChecked: boolean, user: User, editMode: boolean, editForm: FormGroup | undefined }): void {
    row.editMode = !row.editMode;
    row.editForm = this.userS.getEditUserFormGroup();
    row.editForm.get('userRole')?.setValue(row.user.userRole.name);
  }

  async saveUser(row: { isChecked: boolean, user: User, editMode: boolean, editForm: FormGroup | undefined }): Promise<void> {
    try {
      if (!row.user.userID) return;
      const newUsername = row.editForm?.get('username')?.value;
      const newPassword = row.editForm?.get('userPassword')?.value;
      const userRole = row.editForm?.get('userRole')?.value;
      if (newUsername) await this.userS.updateUsername(row.user.userID, newUsername);
      if (newPassword) await this.userS.updateUserpassword(row.user.userID, newPassword);
      if (userRole != row.user.userRole.name) await this.userS.updateUserRole(row.user.userID, userRole);
      await this.loadUsers();
    } catch (err) {
      console.error(err);
    }
  }
}
