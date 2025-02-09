import { AfterViewInit, Component, inject } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserRole } from 'server/interfaces/user-role.interface';
import { UserRoleOption } from 'src/app/models/user-role-option.model';
import { UserroleService } from 'src/app/services/user/userrole.service';
import { faPlus, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpErrorResponse } from '@angular/common/http';
import { ProgressSpinnerComponent } from "../../../../components/progress-spinner/progress-spinner.component";
import { ErrorDisplayComponent } from "../../../../components/error-display/error-display.component";
import { faFloppyDisk } from '@fortawesome/free-regular-svg-icons';


@Component({
  selector: 'app-user-roles',
  imports: [FormsModule, FontAwesomeModule, ReactiveFormsModule, ProgressSpinnerComponent, ErrorDisplayComponent],
  templateUrl: './user-roles.component.html',
  styleUrl: './user-roles.component.scss'
})
export class UserRolesComponent implements AfterViewInit {
  userRoleS = inject(UserroleService);
  userRolesOptions: UserRoleOption[] = [];
  selectedUserRoleOption?: UserRoleOption;
  userRole?: UserRole;
  form: FormGroup = this.userRoleS.getFormGroup();
  isNewUserRole = false;
  error: HttpErrorResponse | null = null;
  isLoading = false;

  faPlus = faPlus;
  faTrashCan = faTrashCan;
  faFloppyDisk = faFloppyDisk

  async ngAfterViewInit(): Promise<void> {
    try {
      this.error = null;
      await this.loadFirstUserRole();
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        this.error = error;
      }
    }
  }

  private async loadFirstUserRole(): Promise<void> {
    this.userRolesOptions = await this.userRoleS.getAllUserRoles();
    this.isNewUserRole = false;
    if (this.userRolesOptions.length > 0) {
      this.selectedUserRoleOption = this.userRolesOptions[0];
      await this.loadUserRole(this.selectedUserRoleOption.userRoleID);
    }
  }

  async loadUserRole(userRoleID?: number): Promise<void> {
    try {
      this.isLoading = true;
      this.error = null;
      if (!userRoleID) return;
      this.isNewUserRole = false;
      this.userRole = await this.userRoleS.getUserRole(userRoleID);
      this.form = this.userRoleS.getFormGroup(this.userRole);
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        this.error = error;
      }
    }
    this.isLoading = false;
  }

  createNewUserRole(): void {
    this.error = null;
    this.isNewUserRole = true;
    this.selectedUserRoleOption = undefined;
    this.userRole = {
      name: '',
      description: '',
      userPermissions: []
    };
    this.form = this.userRoleS.getFormGroup();
  }

  async saveUserRole(): Promise<void> {
    try {
      if (this.form.invalid) return;
      this.isLoading = true;
      const userRoleInForm = this.userRoleS.getUserRoleFromFormGroup(this.form);
      if (!userRoleInForm) return;
      let userRoleID;
      if (this.isNewUserRole) {
        // Create new user role
        userRoleID = await this.userRoleS.createUserRole(userRoleInForm);
      } else {
        // Update existing user role
        await this.userRoleS.updateUserRole(userRoleInForm);
      }
      await this.refreshUserRoleOptions(userRoleID ?? this.selectedUserRoleOption?.userRoleID);
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        this.error = error;
      }
    }
    this.isLoading = false;
  }

  async deleteUserRole(): Promise<void> {
    try {
      const userRoleID = this.userRole?.userRoleID;
      if (!userRoleID) return;
      this.error = null;
      this.isLoading = true;
      await this.userRoleS.deleteUserRole([userRoleID]);
      await this.loadFirstUserRole();
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        this.error = error;
      }
    }
    this.isLoading = false;
  }

  private async refreshUserRoleOptions(userRoleID?: number): Promise<void> {
    this.userRolesOptions = await this.userRoleS.getAllUserRoles();
    this.selectedUserRoleOption = this.userRolesOptions.find(option => option.userRoleID === userRoleID);
    if (userRoleID) await this.loadUserRole(userRoleID);
  }
}
