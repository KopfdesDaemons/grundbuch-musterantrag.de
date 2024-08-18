import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authToken: string | null = null;

  constructor(private router: Router, private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {
    if (!isPlatformBrowser(this.platformId)) return;
    this.authToken = localStorage.getItem('auth_token');
  }

  getToken() {
    return this.authToken;
  }

  async anmelden(password: string) {
    try {
      const response: any = await firstValueFrom(this.http.post('/api/login', {
        username: 'rico',
        password: password
      }));
      console.log(response);

      localStorage.setItem('auth_token', response.token);
      this.authToken = response.token;
      console.log("Login erfolgreich");
      this.router.navigate(['/dashboard'])
    } catch (error: any) {

      switch (error.status) {
        case 401:
          console.log('Login verweigert');
          break;
        default:
          console.log("Login nicht erfolgreich: ", error);
      }
    }
  }

  abmelden() {
    if (!isPlatformBrowser(this.platformId)) return;
    localStorage.removeItem('auth_token');
    this.authToken = null;
    this.router.navigate(['/']);
    console.log('Abmeldung erfolgt');
  }
}
