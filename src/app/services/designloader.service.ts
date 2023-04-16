import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { cookie } from '../models/cookie';
import { CookiesService } from './cookies.service';
import { FarbconverterService } from './farbconverter.service';

@Injectable({
  providedIn: 'root'
})
export class DesignloaderService{

  darkmode: BehaviorSubject<boolean>;
  private initialized = false;
  primaryColorHSL:string | null = "#1de4d7";

  constructor(public cs: CookiesService, public farbConv: FarbconverterService) {

    this.darkmode = new BehaviorSubject(this.schemaAusCookie() ?? this.detectPreferenceScheme());
    if(this.darkmode.value == true) this.aktiviereDarkmode(true);

    this.darkmode.subscribe((state: boolean) => {
      if(this.initialized) {
        if(state) this.aktiviereDarkmode();
        else this.deaktiviereDarkmode();
      } else this.initialized = true;
    });
    this.FarbeAusCookieAnwenden();
   }

  detectPreferenceScheme(): boolean{
    const mediaMatch = window.matchMedia('(prefers-color-scheme: dark)').matches; 
    return typeof mediaMatch === 'boolean' ? mediaMatch: false;
  }
  
  togledesignScheme() {
    this.darkmode.next(!this.darkmode.value);
  }

  private aktiviereDarkmode(ohneCookie: boolean = false ) {
    document.documentElement.classList.add("darkmode");
    if(ohneCookie) return;
    var c = new cookie("Darkmode", String(true), 90, "Darf das Designschema gespeichert werden?");
    this.cs.setCookieWithRequest(c);
  }

  private deaktiviereDarkmode() {
    document.documentElement.classList.remove("darkmode");
    var c = new cookie("Darkmode", String(false), 90, "Darf das Designschema gespeichert werden?");
    this.cs.setCookieWithRequest(c);
  }
  
  private schemaAusCookie(): boolean | undefined{
    var cookie = this.cs.getCookie("Darkmode");
    if(cookie === "true") return true;
    if(cookie === "false") return false;
    return undefined;
  }

  public FarbeAusCookieAnwenden() {
    let FarbCookie = this.cs.getCookie("Farbe");
    if (FarbCookie != "") {
      let split = FarbCookie.split(",");
      this.FarbeÄndern(Number(split[0]), Number(split[1]), 0);
    }
  }
  
  public FarbeÄndern(h: number, s: number, l:number) {
    let hsl = h + ", " + s + "%"; //, "+ l+"%";
    var r = document.querySelector(":root") as HTMLElement;
    r.style.setProperty("--hsl-color", hsl);
    var c:cookie = new cookie("Farbe", h + "," + s, 90, "Darf die Farbe gespeichert werden?");
    this.cs.setCookieWithRequest(c);
    this.primaryColorHSL = `hsl(${h}, ${s}, 100)`;
    let hex = this.farbConv.HSLToHex(h, s, 50);
    this.primaryColorHSL = hex;
  }
}