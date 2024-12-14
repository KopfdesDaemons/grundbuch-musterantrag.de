import { inject, Injectable, PLATFORM_ID, REQUEST } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { cookie } from '../models/cookie';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CookiesService {
  private document = inject(DOCUMENT);
  private request = inject(REQUEST);
  private platfomId = inject(PLATFORM_ID);

  cookieRequestList: BehaviorSubject<cookie[]> = new BehaviorSubject(new Array());

  getCookieString(): string {
    return isPlatformBrowser(this.platfomId) ? this.document.cookie : this.request?.headers.get('cookie') ?? '';
  }

  /**
   * Setzt ein Cookie mit Namen, Wert und Tagen bis zum Ablauf.
   * @param cookie Das Cookie-Objekt, das gesetzt werden soll.
   */
  setcookie(cookie: cookie) {
    if (!isPlatformBrowser(this.platfomId)) return;
    const d = new Date();
    d.setTime(d.getTime() + cookie.days * 24 * 60 * 60 * 1000);
    const expires = "expires=" + d.toUTCString();
    document.cookie = cookie.name + "=" + cookie.value + ";" + expires + "; path=/;";
  }

  /**
   * Liest den Wert eines Cookies
   * @param cname Der Name des Cookies
   * @returns Der Wert des Cookies oder ein leerer String, falls der Cookie nicht gefunden wurde.
   */
  getCookie(cname: string) {
    const cookieString = this.getCookieString();

    const name = cname + "=";
    const ca = cookieString.split(";");
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

  /**
   * Fügt ein Cookie zur Liste der Cookies hinzu, die vom Nutzer noch bestätige werden müssen.
   * Erst wenn der Nutzer den Cookie bestätigt hat, wird der Cookie gesetzt.
   * @param cookie Das Cookie-Objekt, das hinzugefügt werden soll.
   */
  addCookieToRequestList(cookie: cookie) {
    for (const c of this.cookieRequestList.value) if (c.name == cookie.name) return;
    this.cookieRequestList.next(this.cookieRequestList.value.concat(cookie));
  }

  /**
   * Prüft, ob Cookie bereits gesetzt wurde. Falls ja, wird der Cookie aktualisiert.
   * Falls nein, wird er zur Liste der Cookies hinzugefügt, welche vom Nuter erst bestätigt werden müssen.
   * @param cookie Das Cookie-Objekt, das überprüft werden soll.
   */
  setCookieWithRequest(cookie: cookie) {
    if (this.getCookie(cookie.name) != "") {
      this.setcookie(cookie);
      return;
    }
    this.addCookieToRequestList(cookie);
  }

  /**
   * Entfernt ein Cookie-Objekt aus der Liste der angefragten Cookies, die bestätigt werden.
   * @param c Das Cookie-Objekt, das entfernt werden soll.
   */
  cookieRequested(c: cookie) {
    this.cookieRequestList.next(this.cookieRequestList.getValue().filter(cookie => cookie.name !== c.name));
  }

  /**
   * Löscht ein Cookie
   * @param name Der Name des Cookies, der gelöscht werden soll.
   */
  deleteCookie(name: string) {
    this.document.cookie = name + `=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }

  /**
  * Löscht alle Cookies
  */
  deleteAllCookies() {
    const cookies = document.cookie.split(";");

    for (const cookie of cookies) {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
      this.document.cookie = name + `=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
  }

  /**
   * Liest alle Cookies aus dem Cookie-String
   * @returns {cookie[]} Array mit allen Cookies
  */
  getAllCookies(): cookie[] {
    const cookies: cookie[] = [];
    const cookieString = this.getCookieString();
    if (!cookieString) return [];

    const cookieStrings = cookieString.split(";");

    for (const c of cookieStrings) {
      const cookie: cookie = {
        name: c.split("=")[0],
        value: c.split("=")[1],
        days: 0,
        consent: ''
      }
      cookies.push(cookie);
    }
    return cookies;
  }
}