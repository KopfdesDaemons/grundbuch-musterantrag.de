import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
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

  private _authToken = signal<string | null>(null);

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;
    this._authToken.set(localStorage.getItem('auth_token'));
  }

  get authToken(): string | null {
    return this._authToken();
  }

  async login(username: string, password: string): Promise<void> {
    // Required for new-passoword page
    localStorage.setItem('username', username);

    const response = await firstValueFrom(
      this.http.post('/api/auth/login', {
        username: username,
        password: password
      })
    );

    const data = response as { token: string };

    localStorage.setItem('auth_token', data.token);
    this._authToken.set(data.token);

    await this.router.navigate(['/dashboard']);
  }

  async logout() {
    if (!isPlatformBrowser(this.platformId)) return;

    localStorage.removeItem('auth_token');
    localStorage.removeItem('username');
    this._authToken.set(null);

    await this.router.navigate(['/login']);
    console.log('Abmeldung erfolgt');
  }

  getLoginFormGroup(): FormGroup {
    const formBuilder = new FormBuilder();
    return formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  async checkAuth(): Promise<boolean> {
    await lastValueFrom(this.http.get('/api/auth/checkAuth'));
    return true;
  }
}
