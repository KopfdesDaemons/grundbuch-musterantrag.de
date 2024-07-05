import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { CookiesService } from './services/cookies.service';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {

  constructor(public cs: CookiesService, public router: Router, @Inject(PLATFORM_ID) private platformId: Object) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (!isPlatformBrowser(this.platformId)) return false;
    const token = this.checkToken();
    if (!token) this.router.navigate(['/']);
    return token;
  }

  checkToken() {
    if (!isPlatformBrowser(this.platformId)) return false;
    const tokenCookie = this.cs.getCookie('loginToken')
    if (tokenCookie != '') return true;
    return false;
  }
}
