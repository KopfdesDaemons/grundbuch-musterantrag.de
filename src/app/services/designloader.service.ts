import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { cookie } from '../models/cookie';
import { CookiesService } from './cookies.service';
import { FarbconverterService } from './farbconverter.service';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { SettingsService } from './settings.service';

@Injectable({
  providedIn: 'root'
})
export class DesignloaderService {
  cs = inject(CookiesService);
  settingsS = inject(SettingsService);
  farbConv = inject(FarbconverterService);
  private platformId = inject(PLATFORM_ID);
  document = inject(DOCUMENT).documentElement;

  darkmode: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private initialized = false;
  primaryColor: string | null = "#20afdf";

  async initDesign() {
    // init darkmode from cookie or preference
    this.darkmode.next(this.getSchemeFromCookie() ?? this.preferenceSchemeIsDarkmode());
    if (this.darkmode.value == true) this.activateDarkmode(true);

    // listen for darkmode change
    this.darkmode.subscribe((state: boolean) => {
      if (this.initialized) {
        if (state) this.activateDarkmode();
        else this.deactivateDarkmode();
      } else this.initialized = true;
    });

    // init primary color from cookie
    if (this.setColorFromCookie()) return;

    // init primary color from settings
    const primaryColorFromSettings = await this.settingsS.getPrimaryColorFromSetings();
    if (!primaryColorFromSettings) return;
    if (!this.isValidHexColor(primaryColorFromSettings)) return;
    this.primaryColor = primaryColorFromSettings;
    const hsl = this.farbConv.HexToHSL(primaryColorFromSettings);
    this.changeColor(hsl["h"], hsl["s"], hsl["l"], true);
  }

  preferenceSchemeIsDarkmode(): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;
    const mediaMatch = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return typeof mediaMatch === 'boolean' ? mediaMatch : false;
  }

  togledesignScheme() {
    this.darkmode.next(!this.darkmode.value);
  }

  private activateDarkmode(withoutCookieConsent: boolean = false) {
    this.document?.classList.add("darkmode");
    const c = new cookie("Darkmode", String(true), 90, "Darf das Designschema gespeichert werden?");
    if (withoutCookieConsent) this.cs.setcookie(c);
    else this.cs.setCookieWithRequest(c);
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

  setColorFromCookie(): boolean {
    const FarbCookie = this.cs.getCookie("Farbe");
    if (!FarbCookie) return false;
    const split = FarbCookie.split(",");
    this.changeColor(Number(split[0]), Number(split[1]));
    return true;
  }

  changeColor(h: number, s: number, l: number = 50, withoutCookieConsent: boolean = false) {
    const hsl = h + ", " + s + "%";
    this.document?.style.setProperty("--hsl-color", hsl);
    this.primaryColor = this.farbConv.HSLToHex(h, s, l);

    if (withoutCookieConsent) return;
    const c: cookie = new cookie("Farbe", h + "," + s, 90, "Darf die Farbe gespeichert werden?");
    this.cs.setCookieWithRequest(c);
  }

  private isValidHexColor(color: string): boolean {
    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    return hexColorRegex.test(color);
  }
}