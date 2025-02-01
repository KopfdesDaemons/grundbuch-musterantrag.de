import { AfterViewInit, Component, ElementRef, inject, viewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  imports: [HeaderComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent implements AfterViewInit {
  authS: AuthService = inject(AuthService);
  errorMessage: string = '';
  router = inject(Router);

  loginForm = this.authS.getLoginFormGroup();
  readonly usernameInput = viewChild.required<ElementRef>('username');

  ngAfterViewInit(): void {
    this.usernameInput().nativeElement.focus();
  }

  async tryLogin() {
    try {
      if (this.loginForm.invalid) return;
      this.errorMessage = '';
      const username = this.loginForm.value.username.trim();
      const password = this.loginForm.value.password;

      await this.authS.login(username, password);
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        switch (error.status) {
          case 403:
            this.errorMessage = 'Login verweigert';
            break;
          case 401:
            if (error.error.message === "Passwortänderung erforderlich") {
              await this.router.navigate(['/new-password']);
            } else {
              this.errorMessage = 'Logindaten unvollständig';
            }
            break;
          default:
            this.errorMessage = `Login nicht erfolgreich: ${error.message || error.status}`;
        }
      }
    }
  }
}
