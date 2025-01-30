import { AfterViewInit, Component, inject } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserRole } from 'server/interfaces/userRole';
import { UserRoleOption } from 'src/app/models/userRoleOption';
import { UserroleService } from 'src/app/services/userrole.service';
import { faPlus, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


@Component({
  selector: 'app-user-roles',
  imports: [FormsModule, FontAwesomeModule, ReactiveFormsModule],
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

  faPlus = faPlus;
  faTrashCan = faTrashCan;

  async ngAfterViewInit(): Promise<void> {
    await this.loadFirstUserRole();
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
    if (!userRoleID) return;
    this.isNewUserRole = false;
    this.userRole = await this.userRoleS.getUserRole(userRoleID);
    this.form = this.userRoleS.getFormGroup(this.userRole);
  }

  createNewUserRole(): void {
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
  }

  async deleteUserRole(): Promise<void> {
    const userRoleID = this.userRole?.userRoleID;
    if (!userRoleID) return;

    await this.userRoleS.deleteUserRole([userRoleID]);
    await this.loadFirstUserRole();
  }

  private async refreshUserRoleOptions(userRoleID?: number): Promise<void> {
    this.userRolesOptions = await this.userRoleS.getAllUserRoles();
    this.selectedUserRoleOption = this.userRolesOptions.find(option => option.userRoleID === userRoleID);
    if (userRoleID) await this.loadUserRole(userRoleID);
  }
}
