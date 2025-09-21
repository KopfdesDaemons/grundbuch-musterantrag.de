import { ChangeDetectionStrategy, Component, ElementRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { AuthService } from 'src/app/services/user/auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { LoginCardComponent } from '../../components/login-card/login-card.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-login',
  imports: [HeaderComponent, FormsModule, ReactiveFormsModule, LoginCardComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  authS: AuthService = inject(AuthService);
  errorMessage = signal('');
  router = inject(Router);

  loginForm = this.authS.getLoginFormGroup();
  readonly usernameInput = viewChild.required<ElementRef>('username');

  ngOnInit(): void {
    this.usernameInput().nativeElement.focus();
  }

  async tryLogin() {
    try {
      if (this.loginForm.invalid) return;
      this.errorMessage.set('');
      const username = this.loginForm.value.username.trim();
      const password = this.loginForm.value.password;

      await this.authS.login(username, password);
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        if (error.error.message === 'Passwortänderung erforderlich') {
          // Get username case sensitive
          localStorage.setItem('username', error.error.userName);
          await this.router.navigate(['/new-password']);
        } else {
          this.errorMessage.set(error.error.message);
        }
      }
    }
  }
}
