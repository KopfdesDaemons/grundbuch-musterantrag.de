import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthResponse } from 'common/interfaces/auth-response.interface';
import { lastValueFrom } from 'rxjs';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly formBuilder = inject(FormBuilder);

  private readonly _accessToken = signal<string | null>(null);
  readonly accessToken = this._accessToken.asReadonly();

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

    await this.router.navigate(['/dashboard']);
  }

  async logout() {
    if (!isPlatformBrowser(this.platformId)) return;

    localStorage.removeItem('username');
    this._accessToken.set(null);

    await this.router.navigate(['/login']);
    console.log('Abmeldung erfolgt');
  }

  async restoreSession(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;
    const userAgent = window.navigator.userAgent;
    const respose = await lastValueFrom(
      this.http.get('/api/auth/refresh', {
        params: new HttpParams().set('userAgent', userAgent)
      })
    );
    const { accessToken } = respose as AuthResponse;
    this._accessToken.set(accessToken);
    console.log('Wiederherstellung der Session erfolgt');
    console.log(accessToken);
  }

  getLoginFormGroup(): FormGroup {
    const formBuilder = this.formBuilder;
    return formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
}
