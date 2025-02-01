import { AfterViewInit, Component, ElementRef, inject, input, viewChild } from '@angular/core';
import { faMoon } from '@fortawesome/free-solid-svg-icons';
import { CookiesService } from '../../services/cookies.service';
import { cookie } from '../../models/cookie';
import { DesignloaderService } from 'src/app/services/designloader.service';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgClass } from '@angular/common';
import { ColorHelper } from 'src/app/helpers/color.helper';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [NgClass, FaIconComponent, RouterLink]
})
export class HeaderComponent implements AfterViewInit {
  cs = inject(CookiesService);
  dl = inject(DesignloaderService);

  faMoon = faMoon;

  colors = [
    'hsl(195, 75%, 50%)',
    'hsl(0, 60%, 50%)',
    'hsl(323, 82%, 50%)',
    'hsl(132, 64%, 50%)',
    'hsl(35, 100%, 50%)',
    'hsl(173, 63%, 50%)',
    'hsl(281, 94%, 50%)',
    'hsl(81, 56%, 50%)',
    'hsl(0, 0%, 50%)',
    'hsl(334, 100%, 50%)',
    'hsl(225, 6%, 50%)',
    'hsl(110, 69%, 50%)'
  ];

  readonly closingdiv = viewChild.required<ElementRef>('closingdiv');
  readonly cookiebanner = viewChild.required<ElementRef>('cookiebanner');
  readonly colorPicker = viewChild.required<ElementRef>('colorPicker');
  readonly background = input<string>('var(--gradient)');

  ngAfterViewInit(): void {
    this.cs.cookieRequestList.subscribe(() => { this.showCookieBanner(); });
  }

  setColorFromPresets(btn: any) {
    const farbe = (btn as HTMLElement).style.backgroundColor;
    const sep = farbe.indexOf(",") > -1 ? "," : " ";
    const rgb = farbe.substring(4).split(")")[0].split(sep);
    const r = (+rgb[0]), g = (+rgb[1]), b = (+rgb[2]);
    const hslfromrgb = ColorHelper.RGBToHSL(r, g, b);
    this.dl.changeColor(hslfromrgb["h"], hslfromrgb["s"], hslfromrgb["l"]);
  }

  CustomColor(color: any) {
    const hslfromhex = ColorHelper.HexToHSL(color.value);
    this.dl.changeColor(hslfromhex["h"], hslfromhex["s"], hslfromhex["l"]);
  }

  switchMode() {
    this.dl.togledesignScheme();
  }

  cookieBannerIsDisplayed: boolean = false;
  consent: string | undefined;

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  showCookieBanner() {
    if (this.cookieBannerIsDisplayed) return;
    if (this.cs.cookieRequestList.value.length == 0) return;
    this.consent = this.cs.cookieRequestList.value[0].consent;
    this.cookiebanner().nativeElement.classList.remove("ausgeblendet");
    this.cookieBannerIsDisplayed = true;
  }

  async akzeptieren() {
    this.cs.setcookie(this.cs.cookieRequestList.value[0]);
    await this.nextBanner();
  }

  async nextBanner() {
    this.cookiebanner().nativeElement.classList.add("ausgeblendet");
    const c: cookie = this.cs.cookieRequestList.value[0];
    this.cs.cookieRequested(c);
    await this.delay(1000);
    this.cookieBannerIsDisplayed = false;
    this.showCookieBanner();
  }
}
