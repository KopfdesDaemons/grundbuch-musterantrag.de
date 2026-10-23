import { Injectable, inject } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { CookiesService } from '../services/utils/cookies.service';
import { AuthService } from '../services/user/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  cs = inject(CookiesService);
  router = inject(Router);
  private authS = inject(AuthService);

  async canActivate(): Promise<Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree> {
    if (this.authS.accessToken() == null) {
      return this.router.createUrlTree(['/login']);
    }
    return true;
  }
}
