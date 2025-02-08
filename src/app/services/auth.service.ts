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
  }

  get authToken(): string | null {
    return this._authToken;
  }

  async getUsername(): Promise<string> {
    if (!this._username) {
      this._username = await this.loadUsername();
    }
    return this._username;
  }

  async getUserRoleName(): Promise<string> {
    if (!this._userRoleName) {
      this._userRoleName = await this.loadUserRoleName();
    }
    return this._userRoleName;
  }

  async login(username: string, password: string): Promise<void> {
    // required for new-passoword page
    localStorage.setItem('username', username);

    const response = await firstValueFrom(this.http.post('/api/auth/login', {
      username: username,
      password: password
    }));

    const data = response as { token: string };

    localStorage.setItem('auth_token', data.token);
    this._authToken = data.token;

    await this.router.navigate(['/dashboard']);
  }

  async loadUsername(): Promise<string> {
    const response = await lastValueFrom(this.http.get('/api/user/own-username', {
      headers: this.getAuthHeader()
    }));
    const data = response as { username: string };
    return data.username;
  }

  async loadUserRoleName(): Promise<string> {
    const response = await lastValueFrom(this.http.get('/api/userrole/own-userrole', {
      headers: this.getAuthHeader()
    }));
    const data = response as { userRoleName: string };
    return data.userRoleName;
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
