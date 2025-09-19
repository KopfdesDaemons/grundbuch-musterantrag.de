import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, viewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/user/auth.service';
import { UserSettingsService } from 'src/app/services/user/user-settings.service';
import { ProgressSpinnerComponent } from '../../../components/progress-spinner/progress-spinner.component';

@Component({
  selector: 'app-user-settings',
  imports: [FormsModule, ReactiveFormsModule, ProgressSpinnerComponent],
  templateUrl: './user-settings.component.html',
  styleUrl: './user-settings.component.scss'
})
export class UserSettingsComponent {
  authS = inject(AuthService);
  userSettingsS = inject(UserSettingsService);
  newPasswordForm = this.userSettingsS.getNewPasswordGroup();
  ngFormNewPassword = viewChild.required<FormGroupDirective>('ngFormNewPassword');
  ngFormNewUsername = viewChild.required<FormGroupDirective>('ngFormNewUsername');
  formBuilder = new FormBuilder();
  newUsernameForm = this.formBuilder.group({
    newUsername: ['', Validators.required]
  });

  async changePassword() {
    try {
      if (this.newPasswordForm.invalid) return;
      const newPassword = this.newPasswordForm.get('password')?.value;
      const oldPassword = this.newPasswordForm.get('oldPassword')?.value;
      const confirmPassword = this.newPasswordForm.get('confirmPassword')?.value;
      if (newPassword !== confirmPassword) {
        this.newPasswordForm.get('confirmPassword')?.setErrors({ passwordsDontMatch: true });
        return;
      }
      await this.userSettingsS.changePassword(oldPassword, newPassword);
      this.ngFormNewPassword().resetForm();
    } catch (err) {
      if (err instanceof HttpErrorResponse) {
        if (err.error.message === 'Falsches Passwort') {
          this.newPasswordForm.get('oldPassword')?.setErrors({ wrongPassword: true });
        }
      }
      throw err;
    }
  }

  async changeUsername() {
    try {
      if (this.newUsernameForm.invalid) return;
      const newUsername = this.newUsernameForm.get('newUsername')?.value;
      if (!newUsername) return;
      await this.userSettingsS.changeUsername(newUsername);
      this.ngFormNewUsername().resetForm();
    } catch (err) {
      if (err instanceof HttpErrorResponse) {
        this.newUsernameForm.get('newUsername')?.setErrors({ error: { message: err.error.message } });
      }
    }
  }

  getNewUsernameFormGroup(): FormGroup {
    return this.formBuilder.group({
      newUsername: ['', Validators.required]
    });
  }
}
