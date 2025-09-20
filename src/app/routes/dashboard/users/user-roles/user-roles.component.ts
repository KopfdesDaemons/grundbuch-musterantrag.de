import { Component, WritableSignal, effect, inject, signal } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserroleService } from 'src/app/services/user/userrole.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ProgressSpinnerComponent } from '../../../../components/progress-spinner/progress-spinner.component';
import { ErrorDisplayComponent } from '../../../../components/error-display/error-display.component';

@Component({
  selector: 'app-user-roles',
  imports: [FormsModule, ReactiveFormsModule, ProgressSpinnerComponent, ErrorDisplayComponent],
  templateUrl: './user-roles.component.html',
  styleUrl: './user-roles.component.scss'
})
export class UserRolesComponent {
  userRoleS = inject(UserroleService);
  form = signal<FormGroup>(this.userRoleS.getFormGroup());
  isNewUserRole = false;
  error = signal<HttpErrorResponse | null>(null);
  isLoading = signal(false);
  selectedUserRoleID: WritableSignal<number | undefined> = signal(undefined);

  constructor() {
    effect(this.setupUserRoleOptions.bind(this));
    effect(this.handleSelectedUserRoleIDChange.bind(this));
    effect(this.handleUserRoleInEditChange.bind(this));
  }

  private setupUserRoleOptions(): void {
    const firstId = this.userRoleS.firstUserRoleID();
    if (firstId !== undefined && this.selectedUserRoleID() === undefined && !this.isNewUserRole) {
      this.selectedUserRoleID.set(firstId);
    }
  }

  private handleSelectedUserRoleIDChange(): void {
    this.error.set(null);
    this.userRoleS.userRoleInEditID.set(this.selectedUserRoleID());
  }

  private handleUserRoleInEditChange(): void {
    const resource = this.userRoleS.userRoleInEdit;
    if (resource.error()) {
      this.isNewUserRole = false;
      return;
    }
    if (resource.value()) {
      this.isNewUserRole = false;
      this.form.set(this.userRoleS.getFormGroup(resource.value()));
    }
  }

  createNewUserRole(): void {
    this.error.set(null);
    this.isNewUserRole = true;
    this.selectedUserRoleID.set(undefined);
    this.form.set(this.userRoleS.getFormGroup());
  }

  async saveUserRole(): Promise<void> {
    try {
      if (this.form().invalid) return;
      this.isLoading.set(true);
      const userRoleInForm = this.userRoleS.getUserRoleFromFormGroup(this.form());
      let userRoleID;
      if (this.isNewUserRole) {
        // Create new user role
        userRoleID = await this.userRoleS.createUserRole(userRoleInForm);
        this.isNewUserRole = false;
      } else {
        // Update existing user role
        userRoleID = userRoleInForm.userRoleID;
        await this.userRoleS.updateUserRole(userRoleInForm);
      }
      this.userRoleS.userRoleOptions.reload();
      this.userRoleS.userRoleInEdit.reload();
      this.selectedUserRoleID.set(userRoleID);
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        this.error.set(error);
      }
    }
    this.isLoading.set(false);
  }

  async deleteUserRole(): Promise<void> {
    try {
      const userRoleID = this.selectedUserRoleID();
      if (!userRoleID) return;
      this.error.set(null);
      this.isLoading.set(true);
      await this.userRoleS.deleteUserRole([userRoleID]);
      this.selectedUserRoleID.set(undefined);
      this.userRoleS.userRoleOptions.reload();
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        this.error.set(error);
      }
    }
    this.isLoading.set(false);
  }
}
