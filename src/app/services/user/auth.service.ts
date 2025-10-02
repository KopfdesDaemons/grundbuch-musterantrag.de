import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthResponse } from 'common/interfaces/auth-response.interface';
import { lastValueFrom } from 'rxjs';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly formBuilder = inject(FormBuilder);

  private readonly _accessToken = signal<string | null>(null);
  readonly accessToken = this._accessToken.asReadonly();

  private _accessTokenExpiryDate: Date | null = null;
  get accessTokenExpiryDate(): Date | null {
    return this._accessTokenExpiryDate;
  }

  private _refreshTokenExpiryDate: Date | null = null;
  get refreshTokenExpiryDate(): Date | null {
    return this._refreshTokenExpiryDate;
  }

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;
    if (localStorage.getItem('login') !== 'true') return;
  }

  async login(username: string, password: string): Promise<void> {
    // Required for new-passoword page
    localStorage.setItem('username', username);

    const userAgent = window.navigator.userAgent;

    const response = await firstValueFrom(
      this.http.post('/api/auth/login', {
        username: username,
        password: password,
        userAgent: userAgent
      })
    );

    const data = response as AuthResponse;

    this._accessToken.set(data.accessToken);
    this._accessTokenExpiryDate = new Date(data.accessTokenExpiryDate);
    this._refreshTokenExpiryDate = new Date(data.refreshTokenExpiryDate);
    localStorage.setItem('login', 'true');
  }

  reset() {
    if (!isPlatformBrowser(this.platformId)) return;
    this._accessTokenExpiryDate = null;

    this._accessToken.set(null);
    localStorage.removeItem('username');
    localStorage.removeItem('login');
  }

  async logoutEverywhere() {
    await lastValueFrom(this.http.delete('/api/auth/logout-everywhere'));
    this.reset();
  }

  async restoreSession(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;
    if (localStorage.getItem('login') !== 'true') return;
    const userAgent = window.navigator.userAgent;
    const respose = await lastValueFrom(
      this.http.get('/api/auth/refresh', {
        params: new HttpParams().set('userAgent', userAgent)
      })
    );
    const { accessToken, accessTokenExpiryDate, refreshTokenExpiryDate } = respose as AuthResponse;
    this._accessToken.set(accessToken);
    this._accessTokenExpiryDate = new Date(accessTokenExpiryDate);
    this._refreshTokenExpiryDate = new Date(refreshTokenExpiryDate);
  }

  getLoginFormGroup(): FormGroup {
    const formBuilder = this.formBuilder;
    return formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
}
