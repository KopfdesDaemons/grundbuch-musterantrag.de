import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, viewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/services/auth.service';
import { UserSettingsService } from 'src/app/services/user-settings.service';

@Component({
  selector: 'app-user-settings',
  imports: [FormsModule, ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './user-settings.component.html',
  styleUrl: './user-settings.component.scss'
})
export class UserSettingsComponent {
  authS = inject(AuthService);
  userSettingsS = inject(UserSettingsService);
  newPasswordForm = this.userSettingsS.getNewPasswordGroup();
  ngFormNewPassword = viewChild.required<FormGroupDirective>('ngFormNewPassword');
  ngFormNewUsername = viewChild.required<FormGroupDirective>('ngFormNewUsername');
  newUsernameForm: FormGroup;
  formBuilder = new FormBuilder();

  faUser = faUser

  constructor() {
    this.newUsernameForm = this.getNewUsernameFormGroup();
  }

  async changePassword() {
    try {
      if (this.newPasswordForm.invalid) return;
      const newPassword = this.newPasswordForm.get('password')?.value;
      const oldPassword = this.newPasswordForm.get('oldPassword')?.value;
      const confirmPassword = this.newPasswordForm.get('confirmPassword')?.value;
      if (newPassword !== confirmPassword) {
        this.newPasswordForm.get('confirmPassword')?.setErrors({ 'passwordsDontMatch': true });
        return;
      };
      await this.userSettingsS.changePassword(oldPassword, newPassword);
      this.ngFormNewPassword().resetForm();
    } catch (err) {
      if (err instanceof HttpErrorResponse) {
        if (err.error.message === 'Falsches Passwort') {
          this.newPasswordForm.get('oldPassword')?.setErrors({ 'wrongPassword': true });
        }
      }
      throw err;
    }
  }

  async changeUsername() {
    try {
      if (this.newUsernameForm.invalid) return;
      const newUsername = this.newUsernameForm.get('newUsername')?.value;
      await this.userSettingsS.changeUsername(newUsername);
      this.ngFormNewUsername().resetForm();
    } catch (err) {
      if (err instanceof HttpErrorResponse) {
        this.newUsernameForm.get('newUsername')?.setErrors({ 'error': { 'message': err.error.message } });
      }
    }
  }

  getNewUsernameFormGroup(): FormGroup {
    return this.formBuilder.group({
      newUsername: ['', Validators.required]
    })
  }
}
