import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, viewChild } from '@angular/core';
import { FormGroup, FormGroupDirective, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserRoleOption } from 'src/app/models/user-role-option.model';
import { UserService } from 'src/app/services/user/user.service';
import { UserroleService } from 'src/app/services/user/userrole.service';
import { ErrorDisplayComponent } from '../../../../components/error-display/error-display.component';
import { ProgressSpinnerComponent } from 'src/app/components/progress-spinner/progress-spinner.component';
import { UserSettingsService } from 'src/app/services/user/user-settings.service';
import { Feature, UserManagementAction } from 'common/interfaces/user-permission.interface';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-create-user',
  imports: [FormsModule, ReactiveFormsModule, ErrorDisplayComponent, ProgressSpinnerComponent],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.scss'
})
export class CreateUserComponent {
  private readonly userSettingsS = inject(UserSettingsService);
  protected readonly userS = inject(UserService);
  protected readonly userroleS = inject(UserroleService);
  protected readonly ngForm = viewChild.required<FormGroupDirective>('ngForm');
  protected readonly selectedUserRoleID = signal<UserRoleOption | undefined>(undefined);
  protected readonly selectedUserRoleOption = computed<UserRoleOption | undefined>(() => {
    const selectedRoleID = this.selectedUserRoleID();
    if (!selectedRoleID) return undefined;
    if (!this.userroleS.userRoleOptions.hasValue()) return undefined;
    return this.userroleS.userRoleOptions.value().find(role => role.userRoleID === +selectedRoleID);
  });
  protected readonly error = signal<Error | HttpErrorResponse | null>(null);
  protected readonly userHasPermissionsCreateUser = this.userSettingsS.getPermissionsSignal({
    feature: Feature.UserManagement,
    allowedActions: [UserManagementAction.CreateUser]
  });
  protected readonly form: FormGroup = this.userS.getNewUserFormGroup(!this.userHasPermissionsCreateUser(), this.userroleS.firstUserRoleID());

  constructor() {
    effect(() => {
      const firstId = this.userroleS.firstUserRoleID();
      if (firstId !== undefined && this.form.get('userRoleID')?.value == null) {
        this.form.get('userRoleID')?.setValue(firstId);
      }
      this.selectedUserRoleID.set(this.form.get('userRoleID')?.value);
    });
  }

  async createUser(): Promise<void> {
    try {
      this.error.set(null);
      if (this.form.invalid) return;
      const formdata = this.form.value;
      const userRoleName = this.userroleS.userRoleOptions.value()?.find(r => r.userRoleID === +formdata.userRoleID)?.name ?? '';
      await this.userS.createUser(formdata.username, userRoleName, formdata.userPassword, +formdata.userRoleID);
      // Reset form to prevent validation errors for new form
      this.ngForm().resetForm(this.userS.getNewUserFormGroup(!this.userHasPermissionsCreateUser(), this.userroleS.firstUserRoleID()).value);
    } catch (error) {
      if (error instanceof Error || error instanceof HttpErrorResponse) {
        this.error.set(error);
      }
    }
  }

  userRoleChanged() {
    this.selectedUserRoleID.set(this.form.get('userRoleID')?.value);
  }
}
