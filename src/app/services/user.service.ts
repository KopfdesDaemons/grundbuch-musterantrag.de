import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { AuthService } from './auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  http = inject(HttpClient);
  authS = inject(AuthService);
  formBuilder = new FormBuilder();


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

  async deleteUsers(userIDs: number[]): Promise<void> {
    try {
      await lastValueFrom(
        this.http.delete('/api/user', {
          headers: new HttpHeaders({ 'Authorization': `Bearer ${this.authS.getToken()}` }),
          body: { userIDs: userIDs }
        })
      );
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async createUser(username: string, userRole: string, password: string): Promise<void> {
    try {
      await lastValueFrom(
        this.http.put('/api/user', {
          username: username,
          userRole: userRole,
          password: password
        }, {
          headers: new HttpHeaders({ 'Authorization': `Bearer ${this.authS.getToken()}` })
        })
      );
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  getFormGroup(): FormGroup {
    return this.formBuilder.group({
      username: ['', Validators.required],
      userRole: ['guest', Validators.required],
      userPassword: ['', Validators.required]
    });
  }
}