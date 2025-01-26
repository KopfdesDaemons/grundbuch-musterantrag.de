import { AfterViewInit, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Feature, LoggerAction, MigrationAction, SettingsAction, StatisticAction, UploadManagementAction, UserManagementAction, UserRoleManagementAction } from 'server/interfaces/userPermission';
import { UserRole } from 'server/interfaces/userRole';
import { UserRoleOption } from 'src/app/models/userRoleOption';
import { UserroleService } from 'src/app/services/userrole.service';

@Component({
  selector: 'app-user-roles',
  imports: [FormsModule],
  templateUrl: './user-roles.component.html',
  styleUrl: './user-roles.component.scss'
})
export class UserRolesComponent implements AfterViewInit {
  userRoleS = inject(UserroleService);

  userRolesOptions: UserRoleOption[] = [];
  selectedUserRoleOption: UserRoleOption | undefined;
  userRole: UserRole | undefined;

  permissions = this.userRoleS.allPermissions;

  async ngAfterViewInit(): Promise<void> {
    this.userRolesOptions = await this.userRoleS.getAllUserRoles();
    this.selectedUserRoleOption = this.userRolesOptions[0];
    await this.loadUserRole(this.selectedUserRoleOption?.userRoleID);
  }

  async loadUserRole(userRoleID: number | undefined): Promise<void> {
    if (!userRoleID) return;
    this.userRole = await this.userRoleS.getUserRole(userRoleID);
  }

  getBooleanPermission(feature: Feature, actionName: UploadManagementAction | UserManagementAction | StatisticAction | LoggerAction | MigrationAction | SettingsAction | UserRoleManagementAction): boolean {
    const hasPermission = this.userRole?.userPermissions.some(permission =>
      permission.feature === feature &&
      permission.allowedActions.includes(actionName)
    );
    return Boolean(hasPermission);
  }
}
