import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { cookie } from '../models/cookie';
import { CookiesService } from './cookies.service';
import { FarbconverterService } from './farbconverter.service';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class DesignloaderService {
  cs = inject(CookiesService);
  farbConv = inject(FarbconverterService);
  private platformId = inject(PLATFORM_ID);
  document = inject(DOCUMENT).documentElement;

  darkmode: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private initialized = false;
  primaryColorHSL: string | null = "#1de4d7";

  constructor() {
    this.darkmode.next(this.getSchemeFromCookie() ?? this.preferenceSchemeIsDarkmode());
    if (this.darkmode.value == true) this.activateDarkmode(true);

    this.darkmode.subscribe((state: boolean) => {
      if (this.initialized) {
        if (state) this.activateDarkmode();
        else this.deactivateDarkmode();
      } else this.initialized = true;
    });
    this.setColorFromCookie();
  }

  preferenceSchemeIsDarkmode(): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;
    const mediaMatch = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return typeof mediaMatch === 'boolean' ? mediaMatch : false;
  }

  togledesignScheme() {
    this.darkmode.next(!this.darkmode.value);
  }

  private activateDarkmode(ohneCookie: boolean = false) {
    this.document?.classList.add("darkmode");
    if (ohneCookie) return;
    const c = new cookie("Darkmode", String(true), 90, "Darf das Designschema gespeichert werden?");
    this.cs.setCookieWithRequest(c);
  }

  private deactivateDarkmode() {
    this.document?.classList.remove("darkmode");
    const c = new cookie("Darkmode", String(false), 90, "Darf das Designschema gespeichert werden?");
    this.cs.setCookieWithRequest(c);
  }

  private getSchemeFromCookie(): boolean | undefined {
    const cookie = this.cs.getCookie("Darkmode");
    return cookie === "true" ? true : cookie === "" ? undefined : false;
  }

  setColorFromCookie() {
    const FarbCookie = this.cs.getCookie("Farbe");
    if (!FarbCookie) return;
    const split = FarbCookie.split(",");
    this.changeColor(Number(split[0]), Number(split[1]));
  }

  changeColor(h: number, s: number, l: number = 50) {
    const hsl = h + ", " + s + "%";
    this.document?.style.setProperty("--hsl-color", hsl);
    this.primaryColorHSL = this.farbConv.HSLToHex(h, s, l);

    if (!isPlatformBrowser(this.platformId)) return;
    const c: cookie = new cookie("Farbe", h + "," + s, 90, "Darf die Farbe gespeichert werden?");
    this.cs.setCookieWithRequest(c);
  }
}