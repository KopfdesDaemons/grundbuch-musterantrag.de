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
  selectedUserRoleOption: UserRoleOption | undefined;
  userRole: UserRole | undefined;
  form: FormGroup = this.userRoleS.getFormGroup();
  isNewUserRole: boolean = false;
  newUserRole: UserRole = {
    name: '',
    description: '',
    userPermissions: []
  }
  faPlus = faPlus;
  faTrashCan = faTrashCan;

  async ngAfterViewInit(): Promise<void> {
    await this.loadFirstUserRole();
  }

  async loadFirstUserRole(): Promise<void> {
    this.userRolesOptions = await this.userRoleS.getAllUserRoles();
    this.isNewUserRole = false;
    this.selectedUserRoleOption = this.userRolesOptions[0];
    await this.loadUserRole(this.selectedUserRoleOption?.userRoleID);
  }

  async loadUserRole(userRoleID: number | undefined): Promise<void> {
    this.isNewUserRole = false;
    if (!userRoleID) return;
    this.userRole = await this.userRoleS.getUserRole(userRoleID);
    this.form = this.userRoleS.getFormGroup(this.userRole);
  }

  createNewUserRole(): void {
    this.isNewUserRole = true;
    this.selectedUserRoleOption = undefined;
    this.userRole = this.newUserRole;
    this.form = this.userRoleS.getFormGroup();
  }

  async saveUserRole(): Promise<void> {
    this.userRole = this.userRoleS.getUserRoleFromFormGroup(this.form);
    if (!this.userRole) return;
    if (this.isNewUserRole) {
      await this.userRoleS.createUserRole(this.userRole);
    } else {
      await this.userRoleS.updateUserRole(this.userRole);
    }
    await this.loadFirstUserRole();
  }

  async deleteUserRole(): Promise<void> {
    const useRoleID = this.userRole?.userRoleID;
    if (!useRoleID) return;
    await this.userRoleS.deleteUserRole([useRoleID]);
    await this.loadFirstUserRole();
  }
}
