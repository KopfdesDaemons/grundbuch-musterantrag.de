import { ChangeDetectionStrategy, Component, WritableSignal, effect, inject, signal } from '@angular/core';
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
  protected readonly form = signal<FormGroup>(new FormGroup({}));
  protected isNewUserRole = false;
  protected readonly error = signal<Error | HttpErrorResponse | null>(null);
  protected readonly isLoading = signal(false);
  protected readonly selectedUserRoleID: WritableSignal<number | undefined> = signal(undefined);

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

  constructor() {
    this.form.set(this.userRoleS.getFormGroup(!this.userHasPermissionsUpdateUserRole()));
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
    this.userRoleS.setUserRoleInEditID(this.selectedUserRoleID());
  }

  private handleUserRoleInEditChange(): void {
    const resource = this.userRoleS.userRoleInEdit;
    if (resource.error()) {
      this.isNewUserRole = false;
      return;
    }
    if (resource.value()) {
      this.isNewUserRole = false;
      this.form.set(this.userRoleS.getFormGroup(!this.userHasPermissionsUpdateUserRole(), resource.value()));
    }
  }

  createNewUserRole(): void {
    this.error.set(null);
    this.isNewUserRole = true;
    this.selectedUserRoleID.set(undefined);
    this.form.set(this.userRoleS.getFormGroup(false));
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
      this.userRoleS.reloadUserRoleOptions();
      this.userRoleS.reloadUserRoleInEdit();
      this.selectedUserRoleID.set(userRoleID);
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
      this.selectedUserRoleID.set(undefined);
      this.userRoleS.reloadUserRoleOptions();
    } catch (error) {
      if (error instanceof Error || error instanceof HttpErrorResponse) {
        this.error.set(error);
      }
    }
    this.isLoading.set(false);
  }
}
