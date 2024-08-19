import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Injections
  router = inject(Router);
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);

  private authToken: string | null = null;

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.authToken = localStorage.getItem('auth_token');
  }

  getToken() {
    return this.authToken;
  }

  async anmelden(username: string, password: string): Promise<{ success: boolean, message: string }> {
    try {
      const response: any = await firstValueFrom(this.http.post('/api/login', {
        username: username,
        password: password
      }));

      localStorage.setItem('auth_token', response.token);
      this.authToken = response.token;
      console.log("Login erfolgreich");
      this.router.navigate(['/dashboard']);

      // Erfolgsmeldung zurückgeben
      return { success: true, message: "Login erfolgreich" };
    } catch (error: any) {
      let errorMessage = "Login nicht erfolgreich";

      switch (error.status) {
        case 403:
          errorMessage = 'Login verweigert';
          break;
        case 401:
          errorMessage = 'Logindaten unvollständig';
          break;
        default:
          errorMessage = `Login nicht erfolgreich: ${error.message || error.status}`;
      }

      console.log(errorMessage);

      // Fehlernachricht zurückgeben
      return { success: false, message: errorMessage };
    }
  }

  abmelden() {
    if (!isPlatformBrowser(this.platformId)) return;
    localStorage.removeItem('auth_token');
    this.authToken = null;
    this.router.navigate(['/login']);
    console.log('Abmeldung erfolgt');
  }

  getLoginFormGroup(): FormGroup {
    const formBuilder = new FormBuilder();
    return formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
}
