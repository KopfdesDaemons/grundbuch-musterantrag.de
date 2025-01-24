import { AfterViewInit, Component, ElementRef, inject, viewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { Router } from '@angular/router';

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
    if (this.loginForm.invalid) return;

    const username = this.loginForm.value.username.trim();
    const password = this.loginForm.value.password;

    const result = await this.authS.anmelden(username, password);

    if (!result.success) {
      if (result.message === "Passwortänderung erforderlich") {
        await this.router.navigate(['/new-password']);
      }
      this.errorMessage = result.message;
    }
  }
}
