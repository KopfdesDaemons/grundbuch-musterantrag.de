import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { faMoon } from '@fortawesome/free-solid-svg-icons';
import { CookiesService } from '../../services/cookies.service';
import { FarbconverterService } from 'src/app/services/farbconverter.service';
import { cookie } from '../../models/cookie';
import { DesignloaderService } from 'src/app/services/designloader.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements AfterViewInit {
  faMoon = faMoon;

  colors = ['hsl(195, 75%, 50%)', 'hsl(0, 60%, 50%)', 'hsl(323, 82%, 50%)', 'hsl(132, 64%, 50%)', 'hsl(35, 100%, 50%)', 'hsl(173, 63%, 50%)', 'hsl(281, 94%, 50%)', 'hsl(81, 56%, 50%)', 'hsl(0, 0%, 50%)', 'hsl(334, 100%, 50%)', 'hsl(225, 6%, 50%)', 'hsl(110, 69%, 50%)'];

  @ViewChild('mobilenav') mobilenav!: ElementRef;
  @ViewChild('closingdiv') closingdiv!: ElementRef;
  @ViewChild('cookiebanner') cookiebanner!: ElementRef;
  @ViewChild('colorPicker') colorPicker!: ElementRef;

  constructor(public cs: CookiesService, public farbConv: FarbconverterService, public dl: DesignloaderService) { }

  @Input() background: string = 'var(--gradient)';

  ngAfterViewInit(): void {
    this.cs.cookieRequestList.subscribe((c: cookie[]) => { this.showCookieBanner(); });
  }

  // MobileHeaderMenü ############################################################################
  menüoffen = false;

  toggle() {
    this.mobilenav.nativeElement.classList.toggle('mobilenavsichtbar');
    this.closingdiv.nativeElement.classList.toggle("unsichtbar");
    this.menüoffen = !this.menüoffen;
  }

  togglebodydiv() {
    if (this.menüoffen == true) {
      this.mobilenav.nativeElement.classList.toggle('mobilenavsichtbar')
      this.closingdiv.nativeElement.classList.toggle("unsichtbar");
      this.menüoffen = false;
    }
  }

  // Farbe aus Auswahl ##########################################################################

  farbeAusAuswahl(btn: any) {
    let farbe = (btn as HTMLElement).style.backgroundColor;
    let sep = farbe.indexOf(",") > -1 ? "," : " ";
    let rgb = farbe.substring(4).split(")")[0].split(sep);

    let r = (+rgb[0]),
      g = (+rgb[1]),
      b = (+rgb[2]);

    let hslfromrgb = this.farbConv.RGBToHSL(r, g, b);
    this.dl.FarbeÄndern(hslfromrgb["h"], hslfromrgb["s"], hslfromrgb["l"]);
  }

  // Eigene Farbe ################################################################################
  CustomColor(color: any) {
    let hslfromhex = this.farbConv.HexToHSL(color.value);
    this.dl.FarbeÄndern(hslfromhex["h"], hslfromhex["s"], hslfromhex["l"]);
  }

  // Darkmode ################################################################################
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
    // console.log(this.cs.cookieListe.value);
    if (this.isDisplayed) return;
    if (this.cs.cookieRequestList.value.length == 0) return;
    this.consent = this.cs.cookieRequestList.value[0].consent;
    this.cookiebanner.nativeElement.classList.remove("ausgeblendet");
    this.isDisplayed = true;
  }

  async akzeptieren() {
    this.cs.setcookie(this.cs.cookieRequestList.value[0]);
    this.nextBanner();
  }

  async nextBanner() {
    this.cookiebanner.nativeElement.classList.add("ausgeblendet");
    var c: cookie = this.cs.cookieRequestList.value[0];
    this.cs.cookieRequested(c);
    await this.delay(1000);
    this.isDisplayed = false;
    this.showCookieBanner();
  }
}
