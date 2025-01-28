import { Component, inject, viewChild } from '@angular/core';
import { FormGroup, FormGroupDirective, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserRoleOption } from 'src/app/models/userRoleOption';
import { UserService } from 'src/app/services/user.service';
import { UserroleService } from 'src/app/services/userrole.service';

@Component({
  selector: 'app-create-user',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.scss'
})
export class CreateUserComponent {
  userS = inject(UserService);
  userroleS = inject(UserroleService);

  form: FormGroup = this.userS.getNewUserFormGroup();
  guestRoleID: number | undefined;
  ngForm = viewChild.required<FormGroupDirective>('ngForm');
  userRoles: UserRoleOption[] = [];
  selectedUserRole: UserRoleOption | undefined;

  async ngOnInit() {
    this.userRoles = await this.userroleS.getAllUserRoles();
    this.guestRoleID = this.userRoles.find(role => role.name === 'guest')?.userRoleID;
    this.form = this.userS.getNewUserFormGroup(this.guestRoleID);
    this.getSelectedRoleDescription();
  }

  async createUser(): Promise<void> {
    if (this.form.invalid) return;
    const formdata = this.form.value;
    await this.userS.createUser(formdata.username, formdata.userRole, formdata.userPassword, +formdata.userRoleID);
    this.ngForm().resetForm(this.userS.getNewUserFormGroup(this.guestRoleID).value);
  }

  getSelectedRoleDescription() {
    const selectedRoleID = this.form.get('userRoleID')?.value;
    this.selectedUserRole = this.userRoles.find(role => role.userRoleID === +selectedRoleID);
  }
}