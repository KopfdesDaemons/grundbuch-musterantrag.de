import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { computed, inject, Injectable, makeStateKey, PLATFORM_ID, REQUEST, RESPONSE_INIT, signal, TransferState } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthResponse } from 'common/interfaces/auth-response.interface';
import { lastValueFrom } from 'rxjs';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';

const AUTH_STATE_KEY = makeStateKey<AuthResponse>('authResponse');

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly formBuilder = inject(FormBuilder);
  private readonly request = inject(REQUEST, { optional: true });
  private readonly responseInit = inject(RESPONSE_INIT, { optional: true });
  private readonly transferState = inject(TransferState);

  private readonly _accessToken = signal<string | null>(null);
  readonly accessToken = this._accessToken.asReadonly();
  readonly isLoggedIn = computed(() => !!this._accessToken());

  private _accessTokenExpiryDate: Date | null = null;
  get accessTokenExpiryDate(): Date | null {
    return this._accessTokenExpiryDate;
  }

  private _refreshTokenExpiryDate: Date | null = null;
  get refreshTokenExpiryDate(): Date | null {
    return this._refreshTokenExpiryDate;
  }

  private refreshTokenPromise: Promise<void> | null = null;

  async login(username: string, password: string): Promise<void> {
    // Required for new-password page
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

    localStorage.setItem('login', 'true');
    this.setAccessToken(data);
  }

  cleanLocalSession() {
    if (!isPlatformBrowser(this.platformId)) return;
    this._accessTokenExpiryDate = null;
    this._refreshTokenExpiryDate = null;

    this._accessToken.set(null);
    localStorage.removeItem('username');
    localStorage.removeItem('login');
  }

  async logout(): Promise<void> {
    try {
      await lastValueFrom(this.http.delete('/api/auth/logout'));
    } catch {
      // Lokale Session auch bei Netzwerk-/Serverfehler bereinigen
    } finally {
      this.cleanLocalSession();
    }
  }

  async logoutEverywhere() {
    try {
      await lastValueFrom(this.http.delete('/api/auth/logout-everywhere'));
    } finally {
      this.cleanLocalSession();
    }
  }

  async restoreSessionAndSetNewAccessToken(): Promise<void> {
    if (this.refreshTokenPromise) {
      return this.refreshTokenPromise;
    }

    if (isPlatformBrowser(this.platformId)) {
      if (this.transferState.hasKey(AUTH_STATE_KEY)) {
        const transferredAuth = this.transferState.get(AUTH_STATE_KEY, null);
        this.transferState.remove(AUTH_STATE_KEY);
        if (transferredAuth) {
          localStorage.setItem('login', 'true');
          this.setAccessToken(transferredAuth);
          return;
        }
      }
      if (localStorage.getItem('login') !== 'true') return;
    } else {
      const cookieHeader = this.request?.headers.get('cookie') ?? '';
      if (!cookieHeader.includes('refresh_token=')) return;
    }

    this.refreshTokenPromise = (async () => {
      try {
        if (isPlatformBrowser(this.platformId)) {
          const userAgent = window.navigator.userAgent;
          const response = await lastValueFrom(
            this.http.get<AuthResponse>('/api/auth/refresh', {
              params: new HttpParams().set('userAgent', userAgent)
            })
          );

          this.setAccessToken(response);
        } else {
          const cookieHeader = this.request?.headers.get('cookie') ?? '';
          const userAgent = this.request?.headers.get('user-agent') || 'SSR';
          const headers: Record<string, string> = { cookie: cookieHeader };
          const forwardedFor = this.request?.headers.get('x-forwarded-for');
          if (forwardedFor) {
            headers['x-forwarded-for'] = forwardedFor;
          }

          const response = await lastValueFrom(
            this.http.get<AuthResponse>('/api/auth/refresh', {
              params: new HttpParams().set('userAgent', userAgent),
              headers,
              observe: 'response'
            })
          );

          if (response.body) {
            this.setAccessToken(response.body);
            this.transferState.set(AUTH_STATE_KEY, response.body);
          }

          const setCookie = response.headers.get('set-cookie');
          if (setCookie && this.responseInit) {
            if (this.responseInit.headers instanceof Headers) {
              this.responseInit.headers.append('set-cookie', setCookie);
            } else {
              const resHeaders = new Headers(this.responseInit.headers);
              resHeaders.append('set-cookie', setCookie);
              this.responseInit.headers = resHeaders;
            }
          }
        }
      } catch (error) {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          if (isPlatformBrowser(this.platformId)) {
            this.cleanLocalSession();
          } else if (this.responseInit) {
            const clearCookie = 'refresh_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT';
            if (this.responseInit.headers instanceof Headers) {
              this.responseInit.headers.append('set-cookie', clearCookie);
            } else {
              const resHeaders = new Headers(this.responseInit.headers);
              resHeaders.append('set-cookie', clearCookie);
              this.responseInit.headers = resHeaders;
            }
          }
        }
      } finally {
        this.refreshTokenPromise = null;
      }
    })();
    return this.refreshTokenPromise;
  }

  getLoginFormGroup(): FormGroup {
    const formBuilder = this.formBuilder;
    return formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  private setAccessToken(data: AuthResponse): void {
    this._accessTokenExpiryDate = new Date(data.accessTokenExpiryDate);
    this._refreshTokenExpiryDate = new Date(data.refreshTokenExpiryDate);
    this._accessToken.set(data.accessToken);
  }
}
