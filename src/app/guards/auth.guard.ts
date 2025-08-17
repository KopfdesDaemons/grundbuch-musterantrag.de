import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { CookiesService } from '../services/utils/cookies.service';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../services/user/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  cs = inject(CookiesService);
  router = inject(Router);
  private platformId = inject<object>(PLATFORM_ID);
  private authS = inject(AuthService);

  async canActivate(): Promise<Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree> {
    if (!isPlatformBrowser(this.platformId)) return false;
    try {
      return await this.authS.ckeckAuth();
    } catch (error: any) {
      if (error.status == 401 || error.status == 403) {
        await this.authS.logout();
        return false;
      }
      throw error;
    }
  }
}
