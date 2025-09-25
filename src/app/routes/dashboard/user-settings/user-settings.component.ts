import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal, viewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/user/auth.service';
import { UserSettingsService } from 'src/app/services/user/user-settings.service';
import { ProgressSpinnerComponent } from '../../../components/progress-spinner/progress-spinner.component';
import { NgClass } from '@angular/common';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-user-settings',
  imports: [FormsModule, ReactiveFormsModule, ProgressSpinnerComponent, NgClass],
  templateUrl: './user-settings.component.html',
  styleUrl: './user-settings.component.scss'
})
export class UserSettingsComponent {
  authS = inject(AuthService);
  userSettingsS = inject(UserSettingsService);
  newPasswordForm = this.userSettingsS.getNewPasswordGroup();
  ngFormNewPassword = viewChild.required<FormGroupDirective>('ngFormNewPassword');
  ngFormNewUsername = viewChild.required<FormGroupDirective>('ngFormNewUsername');
  formBuilder = inject(FormBuilder);
  newUsernameForm = this.formBuilder.group({
    newUsername: ['', Validators.required]
  });
  newPasswordMessage = signal('');
  newPasswordError = signal(false);
  newUsernameMessage = signal('');
  newUsernameError = signal(false);

  async changePassword() {
    try {
      this.newPasswordMessage.set('');
      this.newPasswordError.set(false);
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
      this.newPasswordMessage.set('Passwort erfolgreich geändert');
    } catch (err) {
      if (err instanceof HttpErrorResponse) {
        this.newPasswordMessage.set(err.error.message);
        this.newPasswordError.set(true);
      }
    }
  }

  async changeUsername() {
    try {
      this.newUsernameMessage.set('');
      this.newUsernameError.set(false);
      if (this.newUsernameForm.invalid) return;
      const newUsername = this.newUsernameForm.get('newUsername')?.value;
      if (!newUsername) return;
      await this.userSettingsS.changeUsername(newUsername);
      this.ngFormNewUsername().resetForm();
      this.newUsernameMessage.set('Username erfolgreich geändert');
    } catch (err) {
      if (err instanceof HttpErrorResponse) {
        this.newUsernameMessage.set(err.error.message);
        this.newUsernameError.set(true);
      }
    }
  }

  getNewUsernameFormGroup(): FormGroup {
    return this.formBuilder.group({
      newUsername: ['', Validators.required]
    });
  }
}
