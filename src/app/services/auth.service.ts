import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authToken = localStorage.getItem('auth_token');

  constructor(private router: Router, private http: HttpClient) { }

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
    localStorage.removeItem('auth_token');
    this.authToken = null;
    this.router.navigate(['/']);
    console.log('Abmeldung erfolgt');
  }
}
