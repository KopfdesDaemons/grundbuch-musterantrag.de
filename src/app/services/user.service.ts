import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  http = inject(HttpClient);
  authS = inject(AuthService);


  async getAllUsersJSON(): Promise<[]> {
    try {
      const data = await lastValueFrom(
        this.http.get('/api/user', {
          headers: new HttpHeaders({ 'Authorization': `Bearer ${this.authS.getToken()}` })
        })
      );
      return data as [];
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
