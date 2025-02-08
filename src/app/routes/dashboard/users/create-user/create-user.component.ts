import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, viewChild } from '@angular/core';
import { FormGroup, FormGroupDirective, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserRoleOption } from 'src/app/models/userRoleOption';
import { UserService } from 'src/app/services/user.service';
import { UserroleService } from 'src/app/services/userrole.service';
import { ErrorDisplayComponent } from "../../../../components/error-display/error-display.component";

@Component({
  selector: 'app-create-user',
  imports: [FormsModule, ReactiveFormsModule, ErrorDisplayComponent],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.scss'
})
export class CreateUserComponent {
  userS = inject(UserService);
  userroleS = inject(UserroleService);

  form: FormGroup = this.userS.getNewUserFormGroup();
  firstUserRoleOption: number | undefined;
  ngForm = viewChild.required<FormGroupDirective>('ngForm');
  userRoles: UserRoleOption[] = [];
  selectedUserRole: UserRoleOption | undefined;
  error: HttpErrorResponse | null = null;

  async ngOnInit() {
    this.userRoles = await this.userroleS.getAllUserRoles();
    this.firstUserRoleOption = this.userRoles[0]?.userRoleID;
    this.form = this.userS.getNewUserFormGroup(this.firstUserRoleOption);
    this.getSelectedRoleDescription();
  }

  async createUser(): Promise<void> {
    try {
      this.error = null;
      if (this.form.invalid) return;
      const formdata = this.form.value;
      await this.userS.createUser(formdata.username, formdata.userRole, formdata.userPassword, +formdata.userRoleID);
      // Reset form to prevent validation errors for new form
      this.ngForm().resetForm(this.userS.getNewUserFormGroup(this.firstUserRoleOption).value);
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        this.error = error;
      }
      throw error;
    }
  }

  getSelectedRoleDescription() {
    const selectedRoleID = this.form.get('userRoleID')?.value;
    this.selectedUserRole = this.userRoles.find(role => role.userRoleID === +selectedRoleID);
  }
}
