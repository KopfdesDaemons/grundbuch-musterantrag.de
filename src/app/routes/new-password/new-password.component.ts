import { AfterViewInit, Component, ElementRef, inject, OnInit, PLATFORM_ID, viewChild } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { UserSettingsService } from 'src/app/services/user-settings.service';

@Component({
  selector: 'app-new-password',
  imports: [HeaderComponent, ReactiveFormsModule],
  templateUrl: './new-password.component.html',
  styleUrl: './new-password.component.scss'
})
export class NewPasswordComponent implements OnInit, AfterViewInit {
  authS = inject(AuthService);
  userS = inject(UserService);
  userSetingsS = inject(UserSettingsService);
  form = this.userSetingsS.getNewPasswordGroup();
  platformId = inject(PLATFORM_ID);
  router = inject(Router);
  username: string = '';

  readonly oldPasswordInput = viewChild.required<ElementRef>('oldPassword');

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.username = localStorage.getItem('username') || '';
  }

  ngAfterViewInit(): void {
    this.oldPasswordInput().nativeElement.focus();
  }

  async changePassword() {
    try {
      if (this.form.invalid) return;
      const newPassword = this.form.get('password')?.value;
      const oldPassword = this.form.get('oldPassword')?.value;
      const confirmPassword = this.form.get('confirmPassword')?.value;
      if (newPassword !== confirmPassword) {
        this.form.get('confirmPassword')?.setErrors({ 'passwordsDontMatch': true });
        return;
      };
      if (!this.username) return;
      await this.userS.updatePassword(this.username, oldPassword, newPassword);
      await this.authS.login(this.username, newPassword);
      await this.router.navigate(['/dashboard']);
    } catch (err) {
      if (err instanceof HttpErrorResponse) {
        if (err.error.message === 'Falsches Passwort') {
          this.form.get('oldPassword')?.setErrors({ 'wrongPassword': true });
        }
      }
    }
  }
}
