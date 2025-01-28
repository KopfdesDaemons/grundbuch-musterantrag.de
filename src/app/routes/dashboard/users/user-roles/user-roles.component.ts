import { AfterViewInit, Component, inject } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserRole } from 'server/interfaces/userRole';
import { UserRoleOption } from 'src/app/models/userRoleOption';
import { UserroleService } from 'src/app/services/userrole.service';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
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

  faPlus = faPlus;

  async ngAfterViewInit(): Promise<void> {
    this.userRolesOptions = await this.userRoleS.getAllUserRoles();
    this.selectedUserRoleOption = this.userRolesOptions[0];
    await this.loadUserRole(this.selectedUserRoleOption?.userRoleID);
  }

  async loadUserRole(userRoleID: number | undefined): Promise<void> {
    if (!userRoleID) return;
    this.userRole = await this.userRoleS.getUserRole(userRoleID);
    this.form = this.userRoleS.getFormGroup(this.userRole);
  }
}
