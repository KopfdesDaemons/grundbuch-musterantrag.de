import { effect, inject, Injectable, PLATFORM_ID, DOCUMENT, signal } from '@angular/core';
import { Cookie } from '../../models/cookie.model';
import { CookiesService } from '../utils/cookies.service';
import { isPlatformBrowser } from '@angular/common';
import { SettingsService } from '../server/settings.service';
import { ColorHelper } from '../../helpers/color.helper';

@Injectable({
  providedIn: 'root'
})
export class DesignloaderService {
  private readonly cookieS = inject(CookiesService);
  private readonly settingsS = inject(SettingsService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT).documentElement;

  private readonly _darkmode = signal(false);
  readonly darkmode = this._darkmode.asReadonly();
  private initialized = false;
  private _primaryColor: string | null = '#20afdf';
  get primaryColor() {
    return this._primaryColor;
  }

  constructor() {
    effect(() => {
      const isDarkMode = this.darkmode();
      if (this.initialized) {
        if (isDarkMode) this.activateDarkmode();
        else this.deactivateDarkmode();
      }
    });
  }

  async initDesign() {
    // Init darkmode from cookie or preference
    const initialMode = this.getSchemeFromCookie() ?? this.preferenceSchemeIsDarkmode();
    this._darkmode.set(initialMode);
    if (this.darkmode()) this.activateDarkmode(true);
    this.initialized = true;

    // Init primary color from cookie
    if (this.setColorFromCookie()) return;

    // Init primary color from settings
    const primaryColorFromSettings = await this.settingsS.getPrimaryColorFromSetings();
    if (!primaryColorFromSettings) return;
    if (!ColorHelper.isValidHexColor(primaryColorFromSettings)) return;
    this._primaryColor = primaryColorFromSettings;
    const hsl = ColorHelper.HexToHSL(primaryColorFromSettings);
    this.changeColor(hsl['h'], hsl['s'], hsl['l'], true);
  }

  private preferenceSchemeIsDarkmode(): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;
    const mediaMatch = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return typeof mediaMatch === 'boolean' ? mediaMatch : false;
  }

  togledesignScheme() {
    this._darkmode.update(value => !value);
  }

  private activateDarkmode(withoutCookieConsent: boolean = false) {
    this.document?.classList.add('darkmode');
    const c = new Cookie('Darkmode', String(true), 90, 'Darf das Designschema gespeichert werden?');
    if (withoutCookieConsent) this.cookieS.setcookie(c);
    else this.cookieS.setCookieWithRequest(c);
  }

  private deactivateDarkmode() {
    this.document?.classList.remove('darkmode');
    const c = new Cookie('Darkmode', String(false), 90, 'Darf das Designschema gespeichert werden?');
    this.cookieS.setCookieWithRequest(c);
  }

  private getSchemeFromCookie(): boolean | undefined {
    const cookie = this.cookieS.getCookie('Darkmode');
    return cookie === 'true' ? true : cookie === '' ? undefined : false;
  }

  setColorFromCookie(): boolean {
    const FarbCookie = this.cookieS.getCookie('Farbe');
    if (!FarbCookie) return false;
    const split = FarbCookie.split(',');
    this.changeColor(Number(split[0]), Number(split[1]));
    return true;
  }

  changeColor(h: number, s: number, l: number = 50, withoutCookieConsent: boolean = false) {
    const hsl = h + ', ' + s + '%';
    this.document?.style.setProperty('--hsl-color', hsl);
    this._primaryColor = ColorHelper.HSLToHex(h, s, l);

    if (withoutCookieConsent) return;
    const c: Cookie = new Cookie('Farbe', h + ',' + s, 90, 'Darf die Farbe gespeichert werden?');
    this.cookieS.setCookieWithRequest(c);
  }
}
