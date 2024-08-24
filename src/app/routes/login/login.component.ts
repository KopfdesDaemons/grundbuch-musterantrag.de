import { AfterViewInit, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { HeaderComponent } from "../../components/header/header.component";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [HeaderComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent implements AfterViewInit {
  authS: AuthService = inject(AuthService);
  errorMessage: string = '';

  loginForm = this.authS.getLoginFormGroup();
  @ViewChild('username') usernameInput!: ElementRef;

  ngAfterViewInit(): void {
    this.usernameInput.nativeElement.focus();
  }

  async tryLogin() {
    if (this.loginForm.invalid) return;
    const result = await this.authS.anmelden(this.loginForm.value.username, this.loginForm.value.password);

    if (!result.success) {
      this.errorMessage = result.message;
    }
  }
}
