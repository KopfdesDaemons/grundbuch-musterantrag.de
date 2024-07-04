import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { CookiesService } from './services/cookies.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard  {

  constructor(public cs: CookiesService, public router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
 
    const token = this.checkToken();
    if(!token) this.router.navigate(['/']);
    return token;
  }

  checkToken(){
    const tokenCookie = this.cs.getCookie('loginToken')
    if (tokenCookie != '') return true;
    return false;
  }
}
