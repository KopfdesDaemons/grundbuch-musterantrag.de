import { Component, ElementRef, inject, input, OnInit, signal, viewChild } from '@angular/core';
import { faMoon } from '@fortawesome/free-solid-svg-icons';
import { CookiesService } from '../../services/utils/cookies.service';
import { Cookie } from '../../models/cookie.model';
import { DesignloaderService } from 'src/app/services/ui/designloader.service';
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
export class HeaderComponent implements OnInit {
  cs = inject(CookiesService);
  dl = inject(DesignloaderService);
  readonly closingdiv = viewChild.required<ElementRef>('closingdiv');
  readonly cookiebanner = viewChild.required<ElementRef>('cookiebanner');
  readonly colorPicker = viewChild.required<ElementRef>('colorPicker');
  readonly background = input<string>('var(--gradient)');
  cookieBannerIsDisplayed: boolean = false;
  requestetCookie = signal<Cookie | null>(null);
  colorPickerIsOpen = signal<boolean>(false);

  faMoon = faMoon;

  colorOptions = [
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

  ngOnInit(): void {
    this.cs.cookieRequestList.subscribe(() => {
      this.showCookieBanner();
    });
  }

  setColorFromPresets(btn: any) {
    const rgbString = (btn as HTMLElement).style.backgroundColor;
    const hsl = ColorHelper.rgbToHslFromString(rgbString);
    this.dl.changeColor(hsl.h, hsl.s);
  }

  setCustomColor(color: any) {
    const hslfromhex = ColorHelper.HexToHSL(color.value);
    this.dl.changeColor(hslfromhex.h, hslfromhex.s, hslfromhex.l);
  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private showCookieBanner() {
    if (this.cookieBannerIsDisplayed) return;
    if (this.cs.cookieRequestList.value.length == 0) return;
    this.requestetCookie.set(this.cs.cookieRequestList.value[0]);
    this.cookiebanner().nativeElement.classList.remove('hidden');
    this.cookieBannerIsDisplayed = true;
  }

  async confirmCookie() {
    this.cs.setcookie(this.cs.cookieRequestList.value[0]);
    await this.nextBanner();
  }

  async nextBanner() {
    this.cookiebanner().nativeElement.classList.add('hidden');
    const c: Cookie = this.cs.cookieRequestList.value[0];
    this.cs.cookieRequested(c);
    await this.delay(800);
    this.cookieBannerIsDisplayed = false;
    this.showCookieBanner();
  }

  clickOnColorPicker() {
    this.colorPickerIsOpen.update(value => !value);
  }
}
