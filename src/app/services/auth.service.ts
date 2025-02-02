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

  private _authToken: string | null = null;
  private _username: string = "";
  private _userRoleName: string = "";

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;
    this._authToken = localStorage.getItem('auth_token');
    this._username = localStorage.getItem('username') || "";
    this._userRoleName = localStorage.getItem('userRoleName') || "";
  }

  get authToken(): string | null {
    return this._authToken;
  }

  get username(): string {
    return this._username;
  }

  get userRoleName(): string {
    return this._userRoleName;
  }

  async login(username: string, password: string): Promise<void> {
    // required for new-passoword page
    localStorage.setItem('username', username);

    const response = await firstValueFrom(this.http.post('/api/auth/login', {
      username: username,
      password: password
    }));

    const data = response as { token: string, username: string, userRoleName: string };

    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('username', data.username);
    localStorage.setItem('userRoleName', data.userRoleName);

    this._username = data.username;
    this._authToken = data.token;
    this._userRoleName = data.userRoleName;

    await this.router.navigate(['/dashboard']);
  }

  async logout() {
    if (!isPlatformBrowser(this.platformId)) return;

    localStorage.removeItem('auth_token');
    localStorage.removeItem('username');
    this._username = "";
    this._authToken = null;

    await this.router.navigate(['/login']);
    console.log('Abmeldung erfolgt');
  }

  getAuthHeader(): HttpHeaders {
    return new HttpHeaders({ 'Authorization': `Bearer ${this.authToken}` });
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
    await lastValueFrom(this.http.get('/api/auth/checkAuth', {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.authToken}`,
      })
    }))
    return true;
  }
}
