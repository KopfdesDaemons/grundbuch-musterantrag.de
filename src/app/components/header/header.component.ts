import { AfterViewInit, Component, ElementRef, inject, input, viewChild } from '@angular/core';
import { faMoon } from '@fortawesome/free-solid-svg-icons';
import { CookiesService } from '../../services/cookies.service';
import { FarbconverterService } from 'src/app/services/farbconverter.service';
import { cookie } from '../../models/cookie';
import { DesignloaderService } from 'src/app/services/designloader.service';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [
    NgClass,
    FaIconComponent,
    RouterLink,
  ]
})
export class HeaderComponent implements AfterViewInit {
  cs = inject(CookiesService);
  farbConv = inject(FarbconverterService);
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
    this.cs.cookieRequestList.subscribe((c: cookie[]) => { this.showCookieBanner(); });
  }

  farbeAusAuswahl(btn: any) {
    let farbe = (btn as HTMLElement).style.backgroundColor;
    let sep = farbe.indexOf(",") > -1 ? "," : " ";
    let rgb = farbe.substring(4).split(")")[0].split(sep);

    let r = (+rgb[0]),
      g = (+rgb[1]),
      b = (+rgb[2]);

    let hslfromrgb = this.farbConv.RGBToHSL(r, g, b);
    this.dl.changeColor(hslfromrgb["h"], hslfromrgb["s"], hslfromrgb["l"]);
  }

  CustomColor(color: any) {
    let hslfromhex = this.farbConv.HexToHSL(color.value);
    this.dl.changeColor(hslfromhex["h"], hslfromhex["s"], hslfromhex["l"]);
  }

  switchMode() {
    this.dl.togledesignScheme();
  }

  //CookieBanner ################################################################################

  consent: string | undefined;
  isDisplayed: boolean = false;

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  showCookieBanner() {
    if (this.isDisplayed) return;
    if (this.cs.cookieRequestList.value.length == 0) return;
    this.consent = this.cs.cookieRequestList.value[0].consent;
    this.cookiebanner().nativeElement.classList.remove("ausgeblendet");
    this.isDisplayed = true;
  }

  async akzeptieren() {
    this.cs.setcookie(this.cs.cookieRequestList.value[0]);
    this.nextBanner();
  }

  async nextBanner() {
    this.cookiebanner().nativeElement.classList.add("ausgeblendet");
    var c: cookie = this.cs.cookieRequestList.value[0];
    this.cs.cookieRequested(c);
    await this.delay(1000);
    this.isDisplayed = false;
    this.showCookieBanner();
  }
}
