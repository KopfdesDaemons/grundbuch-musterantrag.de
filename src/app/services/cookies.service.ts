import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { cookie } from '../models/cookie';

@Injectable({
  providedIn: 'root'
})
export class CookiesService {

  cookieListe: BehaviorSubject<cookie[]> = new BehaviorSubject(new Array());

  constructor() { }

  setcookie(cookie: cookie) {
    const d = new Date();
    d.setTime(d.getTime() + cookie.days * 24 * 60 * 60 * 1000);
    let expires = "expires=" + d.toUTCString();
    document.cookie = cookie.name + "=" + cookie.value + ";" + expires + ";path=/";
  }
  
  getCookie(cname: string) {
    let name = cname + "=";
    let ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
  
  AddCookieToList(cookie: cookie)
  {
    for(const c of this.cookieListe.value) if(c.name == cookie.name)return;
    this.cookieListe.next(this.cookieListe.value.concat(cookie));   
  }

  CheckCookie(cookie: cookie) {
    if(this.getCookie(cookie.name) != "")
    {
      this.setcookie(cookie);
      return;
    }
    this.AddCookieToList(cookie);
  }

  removeCookie(c: cookie){
    this.cookieListe.next(this.cookieListe.getValue().filter(cookie => cookie.name !== c.name));
  }
}