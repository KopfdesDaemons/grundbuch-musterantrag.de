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

  private readonly refreshTimeInMS = 4 * 60 * 1000 + 50 * 1000; // 4 minuts and 50 seconds
  private refreshTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;
    if (localStorage.getItem('login') !== 'true') return;
    void this.setRefreshTimer();
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
    localStorage.setItem('login', 'true');
    this.setRefreshTimer();
  }

  reset() {
    if (!isPlatformBrowser(this.platformId)) return;

    this._accessToken.set(null);
    clearTimeout(this.refreshTimer);

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
    const { accessToken } = respose as AuthResponse;
    this._accessToken.set(accessToken);
  }

  setRefreshTimer(): void {
    this.refreshTimer = setTimeout(async () => {
      try {
        await this.restoreSession();
      } catch (e) {
        console.error('Fehler beim Wiederherstellen der Session:', e);
        this.reset();
      }
      void this.setRefreshTimer();
    }, this.refreshTimeInMS);
  }

  getLoginFormGroup(): FormGroup {
    const formBuilder = this.formBuilder;
    return formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
}
