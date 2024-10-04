import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { CookiesService } from './services/cookies.service';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {

  constructor(public cs: CookiesService, public router: Router, @Inject(PLATFORM_ID) private platformId: Object, private authS: AuthService) { }

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
