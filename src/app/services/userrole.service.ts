import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { AuthService } from './auth.service';
import { UserRole } from 'server/interfaces/userRole';

@Injectable({
  providedIn: 'root'
})
export class UserroleService {
  authS = inject(AuthService);
  http = inject(HttpClient);

  async getAllUserRoles(): Promise<UserRole[]> {
    try {
      const data = await lastValueFrom(
        this.http.get('/api/userrole/get-all-user-roles', {
          headers: new HttpHeaders({ 'Authorization': `Bearer ${this.authS.getToken()}` })
        })
      );
      return data as UserRole[];
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async createUserRole(userRole: UserRole): Promise<void> {
    try {
      await lastValueFrom(
        this.http.put('/api/userrole/', { userRole: userRole }, {
          headers: new HttpHeaders({ 'Authorization': `Bearer ${this.authS.getToken()}` })
        })
      );
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
