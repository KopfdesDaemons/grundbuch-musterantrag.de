import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  router = inject(Router);
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);

  private authToken: string | null = null;
  private username: string = "";

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.authToken = localStorage.getItem('auth_token');
    this.username = localStorage.getItem('username') || "";
  }

  getToken() {
    return this.authToken;
  }

  getUsername() {
    return this.username;
  }

  async anmelden(username: string, password: string): Promise<{ success: boolean, message: string }> {
    try {
      localStorage.setItem('username', username);
      const response: any = await firstValueFrom(this.http.post('/api/auth/login', {
        username: username,
        password: password
      }));

      localStorage.setItem('auth_token', response.token);
      this.username = username;
      this.authToken = response.token;
      console.log("Login erfolgreich");
      await this.router.navigate(['/dashboard']);

      // Erfolgsmeldung zurückgeben
      return { success: true, message: "Login erfolgreich" };
    } catch (error: any) {
      let errorMessage = "Login nicht erfolgreich";

      switch (error.status) {
        case 403:
          errorMessage = 'Login verweigert';
          break;
        case 401:
          if (error.error.message === 'Passwortänderung erforderlich') {
            errorMessage = 'Passwortänderung erforderlich';
            break;
          }
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

  async abmelden() {
    if (!isPlatformBrowser(this.platformId)) return;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('username');
    this.username = "";
    this.authToken = null;
    await this.router.navigate(['/login']);
    console.log('Abmeldung erfolgt');
  }

  getLoginFormGroup(): FormGroup {
    const formBuilder = new FormBuilder();
    return formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  getNewPasswordGroup(): FormGroup {
    const formBuilder = new FormBuilder();
    return formBuilder.group({
      oldPassword: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  async ckeckAuth(): Promise<boolean> {
    try {
      if (!isPlatformBrowser(this.platformId)) return false;
      await lastValueFrom(this.http.get('/api/auth/checkAuth', {
        headers: new HttpHeaders({
          'Authorization': `Bearer ${this.getToken()}`,
        }),
        responseType: 'text'
      }))
      return true;
    } catch (error: any) {
      if (error.status == 401 || error.status == 403) {
        return false;
      }
      throw error;
    }
  }
}
