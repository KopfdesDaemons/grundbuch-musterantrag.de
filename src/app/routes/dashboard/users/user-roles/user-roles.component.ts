import { ChangeDetectionStrategy, Component, inject, linkedSignal, signal } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserroleService } from 'src/app/services/user/userrole.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ProgressSpinnerComponent } from '../../../../components/progress-spinner/progress-spinner.component';
import { ErrorDisplayComponent } from '../../../../components/error-display/error-display.component';
import { UserSettingsService } from 'src/app/services/user/user-settings.service';
import { Feature, UserRoleManagementAction } from 'common/interfaces/user-permission.interface';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-user-roles',
  imports: [FormsModule, ReactiveFormsModule, ProgressSpinnerComponent, ErrorDisplayComponent],
  templateUrl: './user-roles.component.html',
  styleUrl: './user-roles.component.scss'
})
export class UserRolesComponent {
  private readonly userSettingsS = inject(UserSettingsService);
  protected readonly userRoleS = inject(UserroleService);
  protected readonly isNewUserRole = signal(false);
  protected readonly error = signal<Error | HttpErrorResponse | null>(null);
  protected readonly isLoading = signal(false);
  protected readonly selectedUserRoleID = this.userRoleS.userRoleInEditIDSignal;

  protected readonly userHasPermissionsDeleteUserRole = this.userSettingsS.getPermissionsSignal({
    feature: Feature.UserRoleManagement,
    allowedActions: [UserRoleManagementAction.DeleteUserRole]
  });

  protected readonly userHasPermissionsCreateUserRole = this.userSettingsS.getPermissionsSignal({
    feature: Feature.UserRoleManagement,
    allowedActions: [UserRoleManagementAction.CreateUserRole]
  });

  protected readonly userHasPermissionsUpdateUserRole = this.userSettingsS.getPermissionsSignal({
    feature: Feature.UserRoleManagement,
    allowedActions: [UserRoleManagementAction.UpdateUserRole]
  });

  protected readonly form = linkedSignal<FormGroup>(() => {
    if (this.isNewUserRole()) {
      return this.userRoleS.getFormGroup(false);
    }
    const isDisabled = !this.userHasPermissionsUpdateUserRole();
    const roleInEdit = this.userRoleS.userRoleInEdit.hasValue() ? this.userRoleS.userRoleInEdit.value() : undefined;
    return this.userRoleS.getFormGroup(isDisabled, roleInEdit);
  });

  selectUserRole(userRoleID: number | undefined): void {
    this.error.set(null);
    this.isNewUserRole.set(false);
    this.userRoleS.setUserRoleInEditID(userRoleID);
  }

  createNewUserRole(): void {
    this.error.set(null);
    this.isNewUserRole.set(true);
    this.userRoleS.setUserRoleInEditID(undefined);
  }

  async saveUserRole(): Promise<void> {
    try {
      if (this.form().invalid) return;
      this.isLoading.set(true);
      const userRoleInForm = this.userRoleS.getUserRoleFromFormGroup(this.form());
      let userRoleID;
      if (this.isNewUserRole()) {
        // Create new user role
        userRoleID = await this.userRoleS.createUserRole(userRoleInForm);
        this.isNewUserRole.set(false);
      } else {
        // Update existing user role
        userRoleID = userRoleInForm.userRoleID;
        await this.userRoleS.updateUserRole(userRoleInForm);
      }
      this.userRoleS.reloadUserRoleOptions();
      this.userRoleS.reloadUserRoleInEdit();
      this.userRoleS.setUserRoleInEditID(userRoleID);
    } catch (error) {
      if (error instanceof Error || error instanceof HttpErrorResponse) {
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
      this.userRoleS.setUserRoleInEditID(undefined);
      this.userRoleS.reloadUserRoleOptions();
    } catch (error) {
      if (error instanceof Error || error instanceof HttpErrorResponse) {
        this.error.set(error);
      }
    }
    this.isLoading.set(false);
  }
}
