import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, linkedSignal, signal, viewChild } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { UserroleService } from 'src/app/services/user/userrole.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorDisplayComponent } from '../../../../components/error-display/error-display.component';
import { User } from 'src/app/models/user.model';
import { UserRow } from 'src/app/interfaces/user-row';
import { ProgressSpinnerComponent } from 'src/app/components/progress-spinner/progress-spinner.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-user-list',
  imports: [FormsModule, ReactiveFormsModule, NgClass, ErrorDisplayComponent, ProgressSpinnerComponent],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent {
  readonly userS = inject(UserService);
  readonly userRoleS = inject(UserroleService);
  readonly selectAllinput = viewChild<ElementRef>('selectAllInput');
  protected readonly error = signal<Error | null>(null);

  private readonly rowsMap = new Map<string, UserRow>();
  protected readonly rows = linkedSignal<User[], UserRow[]>({
    source: () => this.userS.users(),
    computation: (users, previous) => {
      if (!users) {
        return previous?.value ?? [];
      }
      return users.map(user => {
        const userID = user.userID?.toString() ?? '0';
        if (this.rowsMap.has(userID)) {
          return this.rowsMap.get(userID)!;
        }
        const newRow: UserRow = {
          isChecked: signal(false),
          user: user,
          editMode: false,
          editForm: undefined
        };
        this.rowsMap.set(userID, newRow);
        return newRow;
      });
    }
  });

  protected readonly selectedRows = computed<UserRow[]>(() => this.rows().filter(row => row.isChecked()));

  scroll(element: any) {
    if (element.scrollTop > element.scrollHeight - element.clientHeight - 150) {
      if (!this.userS.userData.isLoading()) this.loadPage(this.userS.loadedPages() + 1);
    }
  }

  private loadPage(pageNumber: number) {
    if (!this.userS.totalPages()) return;
    if (pageNumber > this.userS.totalPages()!) return;
    this.userS.setPageToLoad(pageNumber);
    this.userS.loadUsers();
  }

  reload() {
    this.error.set(null);
    this.userS.resetUsers();
    this.rowsMap.clear();
    this.userS.setPageToLoad(1);
    this.userS.loadUsers();
    if (this.selectAllinput()) {
      this.selectAllinput()!.nativeElement.checked = false;
    }
  }

  selectAll(value: boolean) {
    this.rows().forEach(row => row.isChecked.set(value));
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
      this.reload();
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
      this.reload();
    } catch (error) {
      if (error instanceof Error || error instanceof HttpErrorResponse) {
        this.error.set(error);
      }
    }
  }
}
