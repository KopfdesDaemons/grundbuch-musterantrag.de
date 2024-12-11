import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { CookiesService } from './services/cookies.service';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  cs = inject(CookiesService);
  router = inject(Router);
  private platformId = inject<Object>(PLATFORM_ID);
  private authS = inject(AuthService);


  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree> {

    if (!isPlatformBrowser(this.platformId)) return false;
    const valid = await this.authS.ckeckAuth();
    if (!valid) {
      console.log('Angular AuthGuard: Authentication not valid');
      this.authS.abmelden();
    }
    return valid;
  }
}
