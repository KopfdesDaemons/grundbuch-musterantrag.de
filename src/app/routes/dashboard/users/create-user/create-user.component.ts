import { Component, inject, viewChild } from '@angular/core';
import { FormGroupDirective, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-create-user',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.scss'
})
export class CreateUserComponent {
  userS = inject(UserService);
  form = this.userS.getFormGroup();
  ngForm = viewChild.required<FormGroupDirective>('ngForm');

  async createUser(): Promise<void> {
    const formdata = this.form.value;
    await this.userS.createUser(formdata.username, formdata.userRole, formdata.userPassword);
    this.ngForm().resetForm(this.userS.getFormGroup().value);
  }
}
