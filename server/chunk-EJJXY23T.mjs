import './polyfills.server.mjs';
import {
  BehaviorSubject,
  BrowserModule,
  ChangeDetectorRef,
  Component,
  DOCUMENT,
  Directive,
  DomSanitizer,
  ElementRef,
  EventEmitter,
  Host,
  HostBinding,
  HttpClient,
  HttpEventType,
  HttpParams,
  Inject,
  Injectable,
  InjectionToken,
  Injector,
  Input,
  Meta,
  NgClass,
  NgModule,
  Optional,
  Output,
  PLATFORM_ID,
  Renderer2,
  Router,
  RouterLink,
  RouterModule,
  RouterOutlet,
  RuntimeError,
  Self,
  ServerModule,
  SkipSelf,
  Subject,
  Title,
  Version,
  ViewportScroller,
  booleanAttribute,
  firstValueFrom,
  forkJoin,
  forwardRef,
  from,
  getDOM,
  inject,
  isPlatformBrowser,
  isPlatformServer,
  isPromise,
  isSubscribable,
  lastValueFrom,
  map,
  provideClientHydration,
  provideHttpClient,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵInheritDefinitionFeature,
  ɵɵNgOnChangesFeature,
  ɵɵProvidersFeature,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵdefineComponent,
  ɵɵdefineDirective,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵgetInheritedFactory,
  ɵɵhostProperty,
  ɵɵinject,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵproperty,
  ɵɵpropertyInterpolate,
  ɵɵpropertyInterpolate1,
  ɵɵpureFunction1,
  ɵɵqueryRefresh,
  ɵɵreference,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵresolveDocument,
  ɵɵrestoreView,
  ɵɵsanitizeHtml,
  ɵɵsanitizeUrl,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵviewQuery
} from "./chunk-4VR5P7ZM.mjs";
import {
  __async,
  __spreadProps,
  __spreadValues
} from "./chunk-YBYOXPTQ.mjs";

// src/app/services/cookies.service.ts
var _CookiesService = class _CookiesService {
  constructor() {
    this.cookieRequestList = new BehaviorSubject(new Array());
  }
  /**
   * Setzt ein Cookie mit Namen, Wert und Tagen bis zum Ablauf.
   * @param cookie Das Cookie-Objekt, das gesetzt werden soll.
   */
  setcookie(cookie2) {
    const d2 = /* @__PURE__ */ new Date();
    d2.setTime(d2.getTime() + cookie2.days * 24 * 60 * 60 * 1e3);
    let expires = "expires=" + d2.toUTCString();
    document.cookie = cookie2.name + "=" + cookie2.value + ";" + expires + ";path=/";
  }
  /**
   * Liest den Wert eines Cookies
   * @param cname Der Name des Cookies
   * @returns Der Wert des Cookies oder ein leerer String, falls der Cookie nicht gefunden wurde.
   */
  getCookie(cname) {
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
  /**
   * Fügt ein Cookie zur Liste der Cookies hinzu, die vom Nutzer noch bestätige werden müssen.
   * Erst wenn der Nutzer den Cookie bestätigt hat, wird der Cookie gesetzt.
   * @param cookie Das Cookie-Objekt, das hinzugefügt werden soll.
   */
  addCookieToRequestList(cookie2) {
    for (const c of this.cookieRequestList.value)
      if (c.name == cookie2.name)
        return;
    this.cookieRequestList.next(this.cookieRequestList.value.concat(cookie2));
  }
  /**
   * Prüft, ob Cookie bereits gesetzt wurde. Falls ja, wird der Cookie aktualisiert.
   * Falls nein, wird er zur Liste der Cookies hinzugefügt, welche vom Nuter erst bestätigt werden müssen.
   * @param cookie Das Cookie-Objekt, das überprüft werden soll.
   */
  setCookieWithRequest(cookie2) {
    if (this.getCookie(cookie2.name) != "") {
      this.setcookie(cookie2);
      return;
    }
    this.addCookieToRequestList(cookie2);
  }
  /**
   * Entfernt ein Cookie-Objekt aus der Liste der angefragten Cookies, die bestätigt werden.
   * @param c Das Cookie-Objekt, das entfernt werden soll.
   */
  cookieRequested(c) {
    this.cookieRequestList.next(this.cookieRequestList.getValue().filter((cookie2) => cookie2.name !== c.name));
  }
  /**
   * Löscht ein Cookie
   * @param name Der Name des Cookies, der gelöscht werden soll.
   */
  deleteCookie(name) {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=" + window.location.hostname;
  }
  /**
  * Löscht alle Cookies
  */
  deleteAllCookies() {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
      var cookie2 = cookies[i];
      var eqPos = cookie2.indexOf("=");
      var name = eqPos > -1 ? cookie2.substr(0, eqPos) : cookie2;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  }
  /**
  * Prüft, ob mindestens ein Cookie gesetzt ist.
  * @returns {boolean} Gibt true zurück, wenn mindestens ein Cookie vorhanden ist, sonst false.
  */
  checkForCookies() {
    var cookies = document.cookie.split(";");
    if (cookies.length > 0) {
      return true;
    } else {
      return false;
    }
  }
};
_CookiesService.\u0275fac = function CookiesService_Factory(t) {
  return new (t || _CookiesService)();
};
_CookiesService.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _CookiesService, factory: _CookiesService.\u0275fac, providedIn: "root" });
var CookiesService = _CookiesService;

// node_modules/@fortawesome/free-solid-svg-icons/index.mjs
var faAt = {
  prefix: "fas",
  iconName: "at",
  icon: [512, 512, [61946], "40", "M256 64C150 64 64 150 64 256s86 192 192 192c17.7 0 32 14.3 32 32s-14.3 32-32 32C114.6 512 0 397.4 0 256S114.6 0 256 0S512 114.6 512 256v32c0 53-43 96-96 96c-29.3 0-55.6-13.2-73.2-33.9C320 371.1 289.5 384 256 384c-70.7 0-128-57.3-128-128s57.3-128 128-128c27.9 0 53.7 8.9 74.7 24.1c5.7-5 13.1-8.1 21.3-8.1c17.7 0 32 14.3 32 32v80 32c0 17.7 14.3 32 32 32s32-14.3 32-32V256c0-106-86-192-192-192zm64 192a64 64 0 1 0 -128 0 64 64 0 1 0 128 0z"]
};
var faTrashCan = {
  prefix: "fas",
  iconName: "trash-can",
  icon: [448, 512, [61460, "trash-alt"], "f2ed", "M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"]
};
var faSortDown = {
  prefix: "fas",
  iconName: "sort-down",
  icon: [320, 512, ["sort-desc"], "f0dd", "M182.6 470.6c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8H288c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128z"]
};
var faBars = {
  prefix: "fas",
  iconName: "bars",
  icon: [448, 512, ["navicon"], "f0c9", "M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"]
};
var faCircleExclamation = {
  prefix: "fas",
  iconName: "circle-exclamation",
  icon: [512, 512, ["exclamation-circle"], "f06a", "M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"]
};
var faArrowRightFromBracket = {
  prefix: "fas",
  iconName: "arrow-right-from-bracket",
  icon: [512, 512, ["sign-out"], "f08b", "M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 192 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128zM160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 32C43 32 0 75 0 128L0 384c0 53 43 96 96 96l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l64 0z"]
};
var faGlobe = {
  prefix: "fas",
  iconName: "globe",
  icon: [512, 512, [127760], "f0ac", "M352 256c0 22.2-1.2 43.6-3.3 64H163.3c-2.2-20.4-3.3-41.8-3.3-64s1.2-43.6 3.3-64H348.7c2.2 20.4 3.3 41.8 3.3 64zm28.8-64H503.9c5.3 20.5 8.1 41.9 8.1 64s-2.8 43.5-8.1 64H380.8c2.1-20.6 3.2-42 3.2-64s-1.1-43.4-3.2-64zm112.6-32H376.7c-10-63.9-29.8-117.4-55.3-151.6c78.3 20.7 142 77.5 171.9 151.6zm-149.1 0H167.7c6.1-36.4 15.5-68.6 27-94.7c10.5-23.6 22.2-40.7 33.5-51.5C239.4 3.2 248.7 0 256 0s16.6 3.2 27.8 13.8c11.3 10.8 23 27.9 33.5 51.5c11.6 26 20.9 58.2 27 94.7zm-209 0H18.6C48.6 85.9 112.2 29.1 190.6 8.4C165.1 42.6 145.3 96.1 135.3 160zM8.1 192H131.2c-2.1 20.6-3.2 42-3.2 64s1.1 43.4 3.2 64H8.1C2.8 299.5 0 278.1 0 256s2.8-43.5 8.1-64zM194.7 446.6c-11.6-26-20.9-58.2-27-94.6H344.3c-6.1 36.4-15.5 68.6-27 94.6c-10.5 23.6-22.2 40.7-33.5 51.5C272.6 508.8 263.3 512 256 512s-16.6-3.2-27.8-13.8c-11.3-10.8-23-27.9-33.5-51.5zM135.3 352c10 63.9 29.8 117.4 55.3 151.6C112.2 482.9 48.6 426.1 18.6 352H135.3zm358.1 0c-30 74.1-93.6 130.9-171.9 151.6c25.5-34.2 45.2-87.7 55.3-151.6H493.4z"]
};
var faRightToBracket = {
  prefix: "fas",
  iconName: "right-to-bracket",
  icon: [512, 512, ["sign-in-alt"], "f2f6", "M217.9 105.9L340.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L217.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1L32 320c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM352 416l64 0c17.7 0 32-14.3 32-32l0-256c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l64 0c53 0 96 43 96 96l0 256c0 53-43 96-96 96l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32z"]
};
var faMapLocationDot = {
  prefix: "fas",
  iconName: "map-location-dot",
  icon: [576, 512, ["map-marked-alt"], "f5a0", "M408 120c0 54.6-73.1 151.9-105.2 192c-7.7 9.6-22 9.6-29.6 0C241.1 271.9 168 174.6 168 120C168 53.7 221.7 0 288 0s120 53.7 120 120zm8 80.4c3.5-6.9 6.7-13.8 9.6-20.6c.5-1.2 1-2.5 1.5-3.7l116-46.4C558.9 123.4 576 135 576 152V422.8c0 9.8-6 18.6-15.1 22.3L416 503V200.4zM137.6 138.3c2.4 14.1 7.2 28.3 12.8 41.5c2.9 6.8 6.1 13.7 9.6 20.6V451.8L32.9 502.7C17.1 509 0 497.4 0 480.4V209.6c0-9.8 6-18.6 15.1-22.3l122.6-49zM327.8 332c13.9-17.4 35.7-45.7 56.2-77V504.3L192 449.4V255c20.5 31.3 42.3 59.6 56.2 77c20.5 25.6 59.1 25.6 79.6 0zM288 152a40 40 0 1 0 0-80 40 40 0 1 0 0 80z"]
};
var faMapMarkedAlt = faMapLocationDot;
var faArrowUpRightFromSquare = {
  prefix: "fas",
  iconName: "arrow-up-right-from-square",
  icon: [512, 512, ["external-link"], "f08e", "M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32h82.7L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3V192c0 17.7 14.3 32 32 32s32-14.3 32-32V32c0-17.7-14.3-32-32-32H320zM80 32C35.8 32 0 67.8 0 112V432c0 44.2 35.8 80 80 80H400c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32V432c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H192c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z"]
};
var faPhone = {
  prefix: "fas",
  iconName: "phone",
  icon: [512, 512, [128222, 128379], "f095", "M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"]
};
var faEllipsisVertical = {
  prefix: "fas",
  iconName: "ellipsis-vertical",
  icon: [128, 512, ["ellipsis-v"], "f142", "M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z"]
};
var faDownload = {
  prefix: "fas",
  iconName: "download",
  icon: [512, 512, [], "f019", "M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"]
};
var faHouse = {
  prefix: "fas",
  iconName: "house",
  icon: [576, 512, [127968, 63498, 63500, "home", "home-alt", "home-lg-alt"], "f015", "M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"]
};
var faHome = faHouse;
var faRotateRight = {
  prefix: "fas",
  iconName: "rotate-right",
  icon: [512, 512, ["redo-alt", "rotate-forward"], "f2f9", "M463.5 224H472c13.3 0 24-10.7 24-24V72c0-9.7-5.8-18.5-14.8-22.2s-19.3-1.7-26.2 5.2L413.4 96.6c-87.6-86.5-228.7-86.2-315.8 1c-87.5 87.5-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3c62.2-62.2 162.7-62.5 225.3-1L327 183c-6.9 6.9-8.9 17.2-5.2 26.2s12.5 14.8 22.2 14.8H463.5z"]
};
var faCircleDown = {
  prefix: "fas",
  iconName: "circle-down",
  icon: [512, 512, [61466, "arrow-alt-circle-down"], "f358", "M256 0a256 256 0 1 0 0 512A256 256 0 1 0 256 0zM376.9 294.6L269.8 394.5c-3.8 3.5-8.7 5.5-13.8 5.5s-10.1-2-13.8-5.5L135.1 294.6c-4.5-4.2-7.1-10.1-7.1-16.3c0-12.3 10-22.3 22.3-22.3l57.7 0 0-96c0-17.7 14.3-32 32-32l32 0c17.7 0 32 14.3 32 32l0 96 57.7 0c12.3 0 22.3 10 22.3 22.3c0 6.2-2.6 12.1-7.1 16.3z"]
};
var faAngleDown = {
  prefix: "fas",
  iconName: "angle-down",
  icon: [448, 512, [8964], "f107", "M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"]
};
var faFax = {
  prefix: "fas",
  iconName: "fax",
  icon: [512, 512, [128224, 128439], "f1ac", "M128 64v96h64V64H386.7L416 93.3V160h64V93.3c0-17-6.7-33.3-18.7-45.3L432 18.7C420 6.7 403.7 0 386.7 0H192c-35.3 0-64 28.7-64 64zM0 160V480c0 17.7 14.3 32 32 32H64c17.7 0 32-14.3 32-32V160c0-17.7-14.3-32-32-32H32c-17.7 0-32 14.3-32 32zm480 32H128V480c0 17.7 14.3 32 32 32H480c17.7 0 32-14.3 32-32V224c0-17.7-14.3-32-32-32zM256 256a32 32 0 1 1 0 64 32 32 0 1 1 0-64zm96 32a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm32 96a32 32 0 1 1 0 64 32 32 0 1 1 0-64zM224 416a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"]
};
var faMoon = {
  prefix: "fas",
  iconName: "moon",
  icon: [384, 512, [127769, 9214], "f186", "M223.5 32C100 32 0 132.3 0 256S100 480 223.5 480c60.6 0 115.5-24.2 155.8-63.4c5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6c-96.9 0-175.5-78.8-175.5-176c0-65.8 36-123.1 89.3-153.3c6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z"]
};
var faPrint = {
  prefix: "fas",
  iconName: "print",
  icon: [512, 512, [128424, 128438, 9113], "f02f", "M128 0C92.7 0 64 28.7 64 64v96h64V64H354.7L384 93.3V160h64V93.3c0-17-6.7-33.3-18.7-45.3L400 18.7C388 6.7 371.7 0 354.7 0H128zM384 352v32 64H128V384 368 352H384zm64 32h32c17.7 0 32-14.3 32-32V256c0-35.3-28.7-64-64-64H64c-35.3 0-64 28.7-64 64v96c0 17.7 14.3 32 32 32H64v64c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V384zM432 248a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"]
};
var faBuildingColumns = {
  prefix: "fas",
  iconName: "building-columns",
  icon: [512, 512, ["bank", "institution", "museum", "university"], "f19c", "M243.4 2.6l-224 96c-14 6-21.8 21-18.7 35.8S16.8 160 32 160v8c0 13.3 10.7 24 24 24H456c13.3 0 24-10.7 24-24v-8c15.2 0 28.3-10.7 31.3-25.6s-4.8-29.9-18.7-35.8l-224-96c-8-3.4-17.2-3.4-25.2 0zM128 224H64V420.3c-.6 .3-1.2 .7-1.8 1.1l-48 32c-11.7 7.8-17 22.4-12.9 35.9S17.9 512 32 512H480c14.1 0 26.5-9.2 30.6-22.7s-1.1-28.1-12.9-35.9l-48-32c-.6-.4-1.2-.7-1.8-1.1V224H384V416H344V224H280V416H232V224H168V416H128V224zM256 64a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"]
};
var faUniversity = faBuildingColumns;

// src/app/services/farbconverter.service.ts
var _FarbconverterService = class _FarbconverterService {
  constructor() {
  }
  HexToHSL(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    var r = parseInt(result[1], 16);
    var g = parseInt(result[2], 16);
    var b = parseInt(result[3], 16);
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h = (max + min) / 2;
    var s = (max + min) / 2;
    var l = (max + min) / 2;
    if (max == min) {
      h = s = 0;
    } else {
      var d2 = max - min;
      s = l > 0.5 ? d2 / (2 - max - min) : d2 / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d2 + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d2 + 2;
          break;
        case b:
          h = (r - g) / d2 + 4;
          break;
      }
      h /= 6;
    }
    s = s * 100;
    s = Math.round(s);
    l = l * 100;
    l = Math.round(l);
    h = Math.round(360 * h);
    return { h, s, l };
  }
  RGBToHSL(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    let cmin = Math.min(r, g, b), cmax = Math.max(r, g, b), delta = cmax - cmin, h = 0, s = 0, l = 0;
    if (delta == 0)
      h = 0;
    else if (cmax == r)
      h = (g - b) / delta % 6;
    else if (cmax == g)
      h = (b - r) / delta + 2;
    else
      h = (r - g) / delta + 4;
    h = Math.round(h * 60);
    if (h < 0)
      h += 360;
    l = (cmax + cmin) / 2;
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);
    return { h, s, l };
  }
  HSLToHex(h, s, l) {
    s /= 100;
    l /= 100;
    let c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs(h / 60 % 2 - 1)), m = l - c / 2, r = 0, g = 0, b = 0;
    if (0 <= h && h < 60) {
      r = c;
      g = x;
      b = 0;
    } else if (60 <= h && h < 120) {
      r = x;
      g = c;
      b = 0;
    } else if (120 <= h && h < 180) {
      r = 0;
      g = c;
      b = x;
    } else if (180 <= h && h < 240) {
      r = 0;
      g = x;
      b = c;
    } else if (240 <= h && h < 300) {
      r = x;
      g = 0;
      b = c;
    } else if (300 <= h && h < 360) {
      r = c;
      g = 0;
      b = x;
    }
    var rstr = Math.round((r + m) * 255).toString(16);
    var gstr = Math.round((g + m) * 255).toString(16);
    var bstr = Math.round((b + m) * 255).toString(16);
    if (rstr.length == 1)
      rstr = "0" + rstr;
    if (gstr.length == 1)
      gstr = "0" + gstr;
    if (bstr.length == 1)
      bstr = "0" + bstr;
    return "#" + rstr + gstr + bstr;
  }
};
_FarbconverterService.\u0275fac = function FarbconverterService_Factory(t) {
  return new (t || _FarbconverterService)();
};
_FarbconverterService.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _FarbconverterService, factory: _FarbconverterService.\u0275fac, providedIn: "root" });
var FarbconverterService = _FarbconverterService;

// src/app/models/cookie.ts
var cookie = class {
  constructor(name, value, days, consent) {
    this.name = name;
    this.value = value;
    this.days = days;
    this.consent = consent;
  }
};

// src/app/services/designloader.service.ts
var _DesignloaderService = class _DesignloaderService {
  constructor(cs, farbConv, platformId) {
    this.cs = cs;
    this.farbConv = farbConv;
    this.platformId = platformId;
    this.darkmode = new BehaviorSubject(false);
    this.initialized = false;
    this.primaryColorHSL = "#1de4d7";
    if (isPlatformServer(platformId))
      return;
    this.darkmode.next(this.schemaAusCookie() ?? this.detectPreferenceScheme());
    if (this.darkmode.value == true)
      this.aktiviereDarkmode(true);
    this.darkmode.subscribe((state) => {
      if (this.initialized) {
        if (state)
          this.aktiviereDarkmode();
        else
          this.deaktiviereDarkmode();
      } else
        this.initialized = true;
    });
    this.FarbeAusCookieAnwenden();
  }
  detectPreferenceScheme() {
    const mediaMatch = isPlatformBrowser(this.platformId) ? window.matchMedia("(prefers-color-scheme: dark)").matches : false;
    return typeof mediaMatch === "boolean" ? mediaMatch : false;
  }
  togledesignScheme() {
    this.darkmode.next(!this.darkmode.value);
  }
  aktiviereDarkmode(ohneCookie = false) {
    document.documentElement.classList.add("darkmode");
    if (ohneCookie)
      return;
    var c = new cookie("Darkmode", String(true), 90, "Darf das Designschema gespeichert werden?");
    this.cs.setCookieWithRequest(c);
  }
  deaktiviereDarkmode() {
    document.documentElement.classList.remove("darkmode");
    var c = new cookie("Darkmode", String(false), 90, "Darf das Designschema gespeichert werden?");
    this.cs.setCookieWithRequest(c);
  }
  schemaAusCookie() {
    var cookie2 = this.cs.getCookie("Darkmode");
    if (cookie2 === "true")
      return true;
    if (cookie2 === "false")
      return false;
    return void 0;
  }
  FarbeAusCookieAnwenden() {
    let FarbCookie = this.cs.getCookie("Farbe");
    if (FarbCookie != "") {
      let split = FarbCookie.split(",");
      this.Farbe\u00C4ndern(Number(split[0]), Number(split[1]), 0);
    }
  }
  Farbe\u00C4ndern(h, s, l) {
    let hsl = h + ", " + s + "%";
    var r = document.querySelector(":root");
    r.style.setProperty("--hsl-color", hsl);
    var c = new cookie("Farbe", h + "," + s, 90, "Darf die Farbe gespeichert werden?");
    this.cs.setCookieWithRequest(c);
    this.primaryColorHSL = `hsl(${h}, ${s}, 100)`;
    let hex = this.farbConv.HSLToHex(h, s, 50);
    this.primaryColorHSL = hex;
  }
};
_DesignloaderService.\u0275fac = function DesignloaderService_Factory(t) {
  return new (t || _DesignloaderService)(\u0275\u0275inject(CookiesService), \u0275\u0275inject(FarbconverterService), \u0275\u0275inject(PLATFORM_ID));
};
_DesignloaderService.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _DesignloaderService, factory: _DesignloaderService.\u0275fac, providedIn: "root" });
var DesignloaderService = _DesignloaderService;

// node_modules/@fortawesome/fontawesome-svg-core/index.mjs
function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function(sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys(Object(source), true).forEach(function(key) {
      _defineProperty(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function(key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }
  return target;
}
function _typeof(obj) {
  "@babel/helpers - typeof";
  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj2) {
    return typeof obj2;
  } : function(obj2) {
    return obj2 && "function" == typeof Symbol && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
  }, _typeof(obj);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}
function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}
function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}
function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _s, _e;
  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);
      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }
  return _arr;
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
var noop = function noop2() {
};
var _WINDOW = {};
var _DOCUMENT = {};
var _MUTATION_OBSERVER = null;
var _PERFORMANCE = {
  mark: noop,
  measure: noop
};
try {
  if (typeof window !== "undefined") _WINDOW = window;
  if (typeof document !== "undefined") _DOCUMENT = document;
  if (typeof MutationObserver !== "undefined") _MUTATION_OBSERVER = MutationObserver;
  if (typeof performance !== "undefined") _PERFORMANCE = performance;
} catch (e) {
}
var _ref = _WINDOW.navigator || {};
var _ref$userAgent = _ref.userAgent;
var userAgent = _ref$userAgent === void 0 ? "" : _ref$userAgent;
var WINDOW = _WINDOW;
var DOCUMENT2 = _DOCUMENT;
var MUTATION_OBSERVER = _MUTATION_OBSERVER;
var PERFORMANCE = _PERFORMANCE;
var IS_BROWSER = !!WINDOW.document;
var IS_DOM = !!DOCUMENT2.documentElement && !!DOCUMENT2.head && typeof DOCUMENT2.addEventListener === "function" && typeof DOCUMENT2.createElement === "function";
var IS_IE = ~userAgent.indexOf("MSIE") || ~userAgent.indexOf("Trident/");
var _familyProxy;
var _familyProxy2;
var _familyProxy3;
var _familyProxy4;
var _familyProxy5;
var NAMESPACE_IDENTIFIER = "___FONT_AWESOME___";
var UNITS_IN_GRID = 16;
var DEFAULT_CSS_PREFIX = "fa";
var DEFAULT_REPLACEMENT_CLASS = "svg-inline--fa";
var DATA_FA_I2SVG = "data-fa-i2svg";
var DATA_FA_PSEUDO_ELEMENT = "data-fa-pseudo-element";
var DATA_FA_PSEUDO_ELEMENT_PENDING = "data-fa-pseudo-element-pending";
var DATA_PREFIX = "data-prefix";
var DATA_ICON = "data-icon";
var HTML_CLASS_I2SVG_BASE_CLASS = "fontawesome-i2svg";
var MUTATION_APPROACH_ASYNC = "async";
var TAGNAMES_TO_SKIP_FOR_PSEUDOELEMENTS = ["HTML", "HEAD", "STYLE", "SCRIPT"];
var PRODUCTION = function() {
  try {
    return process.env.NODE_ENV === "production";
  } catch (e) {
    return false;
  }
}();
var FAMILY_CLASSIC = "classic";
var FAMILY_SHARP = "sharp";
var FAMILIES = [FAMILY_CLASSIC, FAMILY_SHARP];
function familyProxy(obj) {
  return new Proxy(obj, {
    get: function get2(target, prop) {
      return prop in target ? target[prop] : target[FAMILY_CLASSIC];
    }
  });
}
var PREFIX_TO_STYLE = familyProxy((_familyProxy = {}, _defineProperty(_familyProxy, FAMILY_CLASSIC, {
  "fa": "solid",
  "fas": "solid",
  "fa-solid": "solid",
  "far": "regular",
  "fa-regular": "regular",
  "fal": "light",
  "fa-light": "light",
  "fat": "thin",
  "fa-thin": "thin",
  "fad": "duotone",
  "fa-duotone": "duotone",
  "fab": "brands",
  "fa-brands": "brands",
  "fak": "kit",
  "fakd": "kit",
  "fa-kit": "kit",
  "fa-kit-duotone": "kit"
}), _defineProperty(_familyProxy, FAMILY_SHARP, {
  "fa": "solid",
  "fass": "solid",
  "fa-solid": "solid",
  "fasr": "regular",
  "fa-regular": "regular",
  "fasl": "light",
  "fa-light": "light",
  "fast": "thin",
  "fa-thin": "thin"
}), _familyProxy));
var STYLE_TO_PREFIX = familyProxy((_familyProxy2 = {}, _defineProperty(_familyProxy2, FAMILY_CLASSIC, {
  solid: "fas",
  regular: "far",
  light: "fal",
  thin: "fat",
  duotone: "fad",
  brands: "fab",
  kit: "fak"
}), _defineProperty(_familyProxy2, FAMILY_SHARP, {
  solid: "fass",
  regular: "fasr",
  light: "fasl",
  thin: "fast"
}), _familyProxy2));
var PREFIX_TO_LONG_STYLE = familyProxy((_familyProxy3 = {}, _defineProperty(_familyProxy3, FAMILY_CLASSIC, {
  fab: "fa-brands",
  fad: "fa-duotone",
  fak: "fa-kit",
  fal: "fa-light",
  far: "fa-regular",
  fas: "fa-solid",
  fat: "fa-thin"
}), _defineProperty(_familyProxy3, FAMILY_SHARP, {
  fass: "fa-solid",
  fasr: "fa-regular",
  fasl: "fa-light",
  fast: "fa-thin"
}), _familyProxy3));
var LONG_STYLE_TO_PREFIX = familyProxy((_familyProxy4 = {}, _defineProperty(_familyProxy4, FAMILY_CLASSIC, {
  "fa-brands": "fab",
  "fa-duotone": "fad",
  "fa-kit": "fak",
  "fa-light": "fal",
  "fa-regular": "far",
  "fa-solid": "fas",
  "fa-thin": "fat"
}), _defineProperty(_familyProxy4, FAMILY_SHARP, {
  "fa-solid": "fass",
  "fa-regular": "fasr",
  "fa-light": "fasl",
  "fa-thin": "fast"
}), _familyProxy4));
var ICON_SELECTION_SYNTAX_PATTERN = /fa(s|r|l|t|d|b|k|ss|sr|sl|st)?[\-\ ]/;
var LAYERS_TEXT_CLASSNAME = "fa-layers-text";
var FONT_FAMILY_PATTERN = /Font ?Awesome ?([56 ]*)(Solid|Regular|Light|Thin|Duotone|Brands|Free|Pro|Sharp|Kit)?.*/i;
var FONT_WEIGHT_TO_PREFIX = familyProxy((_familyProxy5 = {}, _defineProperty(_familyProxy5, FAMILY_CLASSIC, {
  900: "fas",
  400: "far",
  normal: "far",
  300: "fal",
  100: "fat"
}), _defineProperty(_familyProxy5, FAMILY_SHARP, {
  900: "fass",
  400: "fasr",
  300: "fasl",
  100: "fast"
}), _familyProxy5));
var oneToTen = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
var oneToTwenty = oneToTen.concat([11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
var ATTRIBUTES_WATCHED_FOR_MUTATION = ["class", "data-prefix", "data-icon", "data-fa-transform", "data-fa-mask"];
var DUOTONE_CLASSES = {
  GROUP: "duotone-group",
  SWAP_OPACITY: "swap-opacity",
  PRIMARY: "primary",
  SECONDARY: "secondary"
};
var prefixes = /* @__PURE__ */ new Set();
Object.keys(STYLE_TO_PREFIX[FAMILY_CLASSIC]).map(prefixes.add.bind(prefixes));
Object.keys(STYLE_TO_PREFIX[FAMILY_SHARP]).map(prefixes.add.bind(prefixes));
var RESERVED_CLASSES = [].concat(FAMILIES, _toConsumableArray(prefixes), ["2xs", "xs", "sm", "lg", "xl", "2xl", "beat", "border", "fade", "beat-fade", "bounce", "flip-both", "flip-horizontal", "flip-vertical", "flip", "fw", "inverse", "layers-counter", "layers-text", "layers", "li", "pull-left", "pull-right", "pulse", "rotate-180", "rotate-270", "rotate-90", "rotate-by", "shake", "spin-pulse", "spin-reverse", "spin", "stack-1x", "stack-2x", "stack", "ul", DUOTONE_CLASSES.GROUP, DUOTONE_CLASSES.SWAP_OPACITY, DUOTONE_CLASSES.PRIMARY, DUOTONE_CLASSES.SECONDARY]).concat(oneToTen.map(function(n) {
  return "".concat(n, "x");
})).concat(oneToTwenty.map(function(n) {
  return "w-".concat(n);
}));
var initial = WINDOW.FontAwesomeConfig || {};
function getAttrConfig(attr) {
  var element = DOCUMENT2.querySelector("script[" + attr + "]");
  if (element) {
    return element.getAttribute(attr);
  }
}
function coerce(val) {
  if (val === "") return true;
  if (val === "false") return false;
  if (val === "true") return true;
  return val;
}
if (DOCUMENT2 && typeof DOCUMENT2.querySelector === "function") {
  attrs = [["data-family-prefix", "familyPrefix"], ["data-css-prefix", "cssPrefix"], ["data-family-default", "familyDefault"], ["data-style-default", "styleDefault"], ["data-replacement-class", "replacementClass"], ["data-auto-replace-svg", "autoReplaceSvg"], ["data-auto-add-css", "autoAddCss"], ["data-auto-a11y", "autoA11y"], ["data-search-pseudo-elements", "searchPseudoElements"], ["data-observe-mutations", "observeMutations"], ["data-mutate-approach", "mutateApproach"], ["data-keep-original-source", "keepOriginalSource"], ["data-measure-performance", "measurePerformance"], ["data-show-missing-icons", "showMissingIcons"]];
  attrs.forEach(function(_ref2) {
    var _ref22 = _slicedToArray(_ref2, 2), attr = _ref22[0], key = _ref22[1];
    var val = coerce(getAttrConfig(attr));
    if (val !== void 0 && val !== null) {
      initial[key] = val;
    }
  });
}
var attrs;
var _default = {
  styleDefault: "solid",
  familyDefault: "classic",
  cssPrefix: DEFAULT_CSS_PREFIX,
  replacementClass: DEFAULT_REPLACEMENT_CLASS,
  autoReplaceSvg: true,
  autoAddCss: true,
  autoA11y: true,
  searchPseudoElements: false,
  observeMutations: true,
  mutateApproach: "async",
  keepOriginalSource: true,
  measurePerformance: false,
  showMissingIcons: true
};
if (initial.familyPrefix) {
  initial.cssPrefix = initial.familyPrefix;
}
var _config = _objectSpread2(_objectSpread2({}, _default), initial);
if (!_config.autoReplaceSvg) _config.observeMutations = false;
var config = {};
Object.keys(_default).forEach(function(key) {
  Object.defineProperty(config, key, {
    enumerable: true,
    set: function set2(val) {
      _config[key] = val;
      _onChangeCb.forEach(function(cb) {
        return cb(config);
      });
    },
    get: function get2() {
      return _config[key];
    }
  });
});
Object.defineProperty(config, "familyPrefix", {
  enumerable: true,
  set: function set(val) {
    _config.cssPrefix = val;
    _onChangeCb.forEach(function(cb) {
      return cb(config);
    });
  },
  get: function get() {
    return _config.cssPrefix;
  }
});
WINDOW.FontAwesomeConfig = config;
var _onChangeCb = [];
function onChange(cb) {
  _onChangeCb.push(cb);
  return function() {
    _onChangeCb.splice(_onChangeCb.indexOf(cb), 1);
  };
}
var d = UNITS_IN_GRID;
var meaninglessTransform = {
  size: 16,
  x: 0,
  y: 0,
  rotate: 0,
  flipX: false,
  flipY: false
};
function insertCss(css2) {
  if (!css2 || !IS_DOM) {
    return;
  }
  var style = DOCUMENT2.createElement("style");
  style.setAttribute("type", "text/css");
  style.innerHTML = css2;
  var headChildren = DOCUMENT2.head.childNodes;
  var beforeChild = null;
  for (var i = headChildren.length - 1; i > -1; i--) {
    var child = headChildren[i];
    var tagName = (child.tagName || "").toUpperCase();
    if (["STYLE", "LINK"].indexOf(tagName) > -1) {
      beforeChild = child;
    }
  }
  DOCUMENT2.head.insertBefore(style, beforeChild);
  return css2;
}
var idPool = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
function nextUniqueId() {
  var size = 12;
  var id = "";
  while (size-- > 0) {
    id += idPool[Math.random() * 62 | 0];
  }
  return id;
}
function toArray(obj) {
  var array = [];
  for (var i = (obj || []).length >>> 0; i--; ) {
    array[i] = obj[i];
  }
  return array;
}
function classArray(node) {
  if (node.classList) {
    return toArray(node.classList);
  } else {
    return (node.getAttribute("class") || "").split(" ").filter(function(i) {
      return i;
    });
  }
}
function htmlEscape(str) {
  return "".concat(str).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function joinAttributes(attributes) {
  return Object.keys(attributes || {}).reduce(function(acc, attributeName) {
    return acc + "".concat(attributeName, '="').concat(htmlEscape(attributes[attributeName]), '" ');
  }, "").trim();
}
function joinStyles(styles2) {
  return Object.keys(styles2 || {}).reduce(function(acc, styleName) {
    return acc + "".concat(styleName, ": ").concat(styles2[styleName].trim(), ";");
  }, "");
}
function transformIsMeaningful(transform) {
  return transform.size !== meaninglessTransform.size || transform.x !== meaninglessTransform.x || transform.y !== meaninglessTransform.y || transform.rotate !== meaninglessTransform.rotate || transform.flipX || transform.flipY;
}
function transformForSvg(_ref2) {
  var transform = _ref2.transform, containerWidth = _ref2.containerWidth, iconWidth = _ref2.iconWidth;
  var outer = {
    transform: "translate(".concat(containerWidth / 2, " 256)")
  };
  var innerTranslate = "translate(".concat(transform.x * 32, ", ").concat(transform.y * 32, ") ");
  var innerScale = "scale(".concat(transform.size / 16 * (transform.flipX ? -1 : 1), ", ").concat(transform.size / 16 * (transform.flipY ? -1 : 1), ") ");
  var innerRotate = "rotate(".concat(transform.rotate, " 0 0)");
  var inner = {
    transform: "".concat(innerTranslate, " ").concat(innerScale, " ").concat(innerRotate)
  };
  var path = {
    transform: "translate(".concat(iconWidth / 2 * -1, " -256)")
  };
  return {
    outer,
    inner,
    path
  };
}
function transformForCss(_ref2) {
  var transform = _ref2.transform, _ref2$width = _ref2.width, width = _ref2$width === void 0 ? UNITS_IN_GRID : _ref2$width, _ref2$height = _ref2.height, height = _ref2$height === void 0 ? UNITS_IN_GRID : _ref2$height, _ref2$startCentered = _ref2.startCentered, startCentered = _ref2$startCentered === void 0 ? false : _ref2$startCentered;
  var val = "";
  if (startCentered && IS_IE) {
    val += "translate(".concat(transform.x / d - width / 2, "em, ").concat(transform.y / d - height / 2, "em) ");
  } else if (startCentered) {
    val += "translate(calc(-50% + ".concat(transform.x / d, "em), calc(-50% + ").concat(transform.y / d, "em)) ");
  } else {
    val += "translate(".concat(transform.x / d, "em, ").concat(transform.y / d, "em) ");
  }
  val += "scale(".concat(transform.size / d * (transform.flipX ? -1 : 1), ", ").concat(transform.size / d * (transform.flipY ? -1 : 1), ") ");
  val += "rotate(".concat(transform.rotate, "deg) ");
  return val;
}
var baseStyles = ':root, :host {\n  --fa-font-solid: normal 900 1em/1 "Font Awesome 6 Solid";\n  --fa-font-regular: normal 400 1em/1 "Font Awesome 6 Regular";\n  --fa-font-light: normal 300 1em/1 "Font Awesome 6 Light";\n  --fa-font-thin: normal 100 1em/1 "Font Awesome 6 Thin";\n  --fa-font-duotone: normal 900 1em/1 "Font Awesome 6 Duotone";\n  --fa-font-sharp-solid: normal 900 1em/1 "Font Awesome 6 Sharp";\n  --fa-font-sharp-regular: normal 400 1em/1 "Font Awesome 6 Sharp";\n  --fa-font-sharp-light: normal 300 1em/1 "Font Awesome 6 Sharp";\n  --fa-font-sharp-thin: normal 100 1em/1 "Font Awesome 6 Sharp";\n  --fa-font-brands: normal 400 1em/1 "Font Awesome 6 Brands";\n}\n\nsvg:not(:root).svg-inline--fa, svg:not(:host).svg-inline--fa {\n  overflow: visible;\n  box-sizing: content-box;\n}\n\n.svg-inline--fa {\n  display: var(--fa-display, inline-block);\n  height: 1em;\n  overflow: visible;\n  vertical-align: -0.125em;\n}\n.svg-inline--fa.fa-2xs {\n  vertical-align: 0.1em;\n}\n.svg-inline--fa.fa-xs {\n  vertical-align: 0em;\n}\n.svg-inline--fa.fa-sm {\n  vertical-align: -0.0714285705em;\n}\n.svg-inline--fa.fa-lg {\n  vertical-align: -0.2em;\n}\n.svg-inline--fa.fa-xl {\n  vertical-align: -0.25em;\n}\n.svg-inline--fa.fa-2xl {\n  vertical-align: -0.3125em;\n}\n.svg-inline--fa.fa-pull-left {\n  margin-right: var(--fa-pull-margin, 0.3em);\n  width: auto;\n}\n.svg-inline--fa.fa-pull-right {\n  margin-left: var(--fa-pull-margin, 0.3em);\n  width: auto;\n}\n.svg-inline--fa.fa-li {\n  width: var(--fa-li-width, 2em);\n  top: 0.25em;\n}\n.svg-inline--fa.fa-fw {\n  width: var(--fa-fw-width, 1.25em);\n}\n\n.fa-layers svg.svg-inline--fa {\n  bottom: 0;\n  left: 0;\n  margin: auto;\n  position: absolute;\n  right: 0;\n  top: 0;\n}\n\n.fa-layers-counter, .fa-layers-text {\n  display: inline-block;\n  position: absolute;\n  text-align: center;\n}\n\n.fa-layers {\n  display: inline-block;\n  height: 1em;\n  position: relative;\n  text-align: center;\n  vertical-align: -0.125em;\n  width: 1em;\n}\n.fa-layers svg.svg-inline--fa {\n  -webkit-transform-origin: center center;\n          transform-origin: center center;\n}\n\n.fa-layers-text {\n  left: 50%;\n  top: 50%;\n  -webkit-transform: translate(-50%, -50%);\n          transform: translate(-50%, -50%);\n  -webkit-transform-origin: center center;\n          transform-origin: center center;\n}\n\n.fa-layers-counter {\n  background-color: var(--fa-counter-background-color, #ff253a);\n  border-radius: var(--fa-counter-border-radius, 1em);\n  box-sizing: border-box;\n  color: var(--fa-inverse, #fff);\n  line-height: var(--fa-counter-line-height, 1);\n  max-width: var(--fa-counter-max-width, 5em);\n  min-width: var(--fa-counter-min-width, 1.5em);\n  overflow: hidden;\n  padding: var(--fa-counter-padding, 0.25em 0.5em);\n  right: var(--fa-right, 0);\n  text-overflow: ellipsis;\n  top: var(--fa-top, 0);\n  -webkit-transform: scale(var(--fa-counter-scale, 0.25));\n          transform: scale(var(--fa-counter-scale, 0.25));\n  -webkit-transform-origin: top right;\n          transform-origin: top right;\n}\n\n.fa-layers-bottom-right {\n  bottom: var(--fa-bottom, 0);\n  right: var(--fa-right, 0);\n  top: auto;\n  -webkit-transform: scale(var(--fa-layers-scale, 0.25));\n          transform: scale(var(--fa-layers-scale, 0.25));\n  -webkit-transform-origin: bottom right;\n          transform-origin: bottom right;\n}\n\n.fa-layers-bottom-left {\n  bottom: var(--fa-bottom, 0);\n  left: var(--fa-left, 0);\n  right: auto;\n  top: auto;\n  -webkit-transform: scale(var(--fa-layers-scale, 0.25));\n          transform: scale(var(--fa-layers-scale, 0.25));\n  -webkit-transform-origin: bottom left;\n          transform-origin: bottom left;\n}\n\n.fa-layers-top-right {\n  top: var(--fa-top, 0);\n  right: var(--fa-right, 0);\n  -webkit-transform: scale(var(--fa-layers-scale, 0.25));\n          transform: scale(var(--fa-layers-scale, 0.25));\n  -webkit-transform-origin: top right;\n          transform-origin: top right;\n}\n\n.fa-layers-top-left {\n  left: var(--fa-left, 0);\n  right: auto;\n  top: var(--fa-top, 0);\n  -webkit-transform: scale(var(--fa-layers-scale, 0.25));\n          transform: scale(var(--fa-layers-scale, 0.25));\n  -webkit-transform-origin: top left;\n          transform-origin: top left;\n}\n\n.fa-1x {\n  font-size: 1em;\n}\n\n.fa-2x {\n  font-size: 2em;\n}\n\n.fa-3x {\n  font-size: 3em;\n}\n\n.fa-4x {\n  font-size: 4em;\n}\n\n.fa-5x {\n  font-size: 5em;\n}\n\n.fa-6x {\n  font-size: 6em;\n}\n\n.fa-7x {\n  font-size: 7em;\n}\n\n.fa-8x {\n  font-size: 8em;\n}\n\n.fa-9x {\n  font-size: 9em;\n}\n\n.fa-10x {\n  font-size: 10em;\n}\n\n.fa-2xs {\n  font-size: 0.625em;\n  line-height: 0.1em;\n  vertical-align: 0.225em;\n}\n\n.fa-xs {\n  font-size: 0.75em;\n  line-height: 0.0833333337em;\n  vertical-align: 0.125em;\n}\n\n.fa-sm {\n  font-size: 0.875em;\n  line-height: 0.0714285718em;\n  vertical-align: 0.0535714295em;\n}\n\n.fa-lg {\n  font-size: 1.25em;\n  line-height: 0.05em;\n  vertical-align: -0.075em;\n}\n\n.fa-xl {\n  font-size: 1.5em;\n  line-height: 0.0416666682em;\n  vertical-align: -0.125em;\n}\n\n.fa-2xl {\n  font-size: 2em;\n  line-height: 0.03125em;\n  vertical-align: -0.1875em;\n}\n\n.fa-fw {\n  text-align: center;\n  width: 1.25em;\n}\n\n.fa-ul {\n  list-style-type: none;\n  margin-left: var(--fa-li-margin, 2.5em);\n  padding-left: 0;\n}\n.fa-ul > li {\n  position: relative;\n}\n\n.fa-li {\n  left: calc(var(--fa-li-width, 2em) * -1);\n  position: absolute;\n  text-align: center;\n  width: var(--fa-li-width, 2em);\n  line-height: inherit;\n}\n\n.fa-border {\n  border-color: var(--fa-border-color, #eee);\n  border-radius: var(--fa-border-radius, 0.1em);\n  border-style: var(--fa-border-style, solid);\n  border-width: var(--fa-border-width, 0.08em);\n  padding: var(--fa-border-padding, 0.2em 0.25em 0.15em);\n}\n\n.fa-pull-left {\n  float: left;\n  margin-right: var(--fa-pull-margin, 0.3em);\n}\n\n.fa-pull-right {\n  float: right;\n  margin-left: var(--fa-pull-margin, 0.3em);\n}\n\n.fa-beat {\n  -webkit-animation-name: fa-beat;\n          animation-name: fa-beat;\n  -webkit-animation-delay: var(--fa-animation-delay, 0s);\n          animation-delay: var(--fa-animation-delay, 0s);\n  -webkit-animation-direction: var(--fa-animation-direction, normal);\n          animation-direction: var(--fa-animation-direction, normal);\n  -webkit-animation-duration: var(--fa-animation-duration, 1s);\n          animation-duration: var(--fa-animation-duration, 1s);\n  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n          animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  -webkit-animation-timing-function: var(--fa-animation-timing, ease-in-out);\n          animation-timing-function: var(--fa-animation-timing, ease-in-out);\n}\n\n.fa-bounce {\n  -webkit-animation-name: fa-bounce;\n          animation-name: fa-bounce;\n  -webkit-animation-delay: var(--fa-animation-delay, 0s);\n          animation-delay: var(--fa-animation-delay, 0s);\n  -webkit-animation-direction: var(--fa-animation-direction, normal);\n          animation-direction: var(--fa-animation-direction, normal);\n  -webkit-animation-duration: var(--fa-animation-duration, 1s);\n          animation-duration: var(--fa-animation-duration, 1s);\n  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n          animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  -webkit-animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.28, 0.84, 0.42, 1));\n          animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.28, 0.84, 0.42, 1));\n}\n\n.fa-fade {\n  -webkit-animation-name: fa-fade;\n          animation-name: fa-fade;\n  -webkit-animation-delay: var(--fa-animation-delay, 0s);\n          animation-delay: var(--fa-animation-delay, 0s);\n  -webkit-animation-direction: var(--fa-animation-direction, normal);\n          animation-direction: var(--fa-animation-direction, normal);\n  -webkit-animation-duration: var(--fa-animation-duration, 1s);\n          animation-duration: var(--fa-animation-duration, 1s);\n  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n          animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  -webkit-animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));\n          animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));\n}\n\n.fa-beat-fade {\n  -webkit-animation-name: fa-beat-fade;\n          animation-name: fa-beat-fade;\n  -webkit-animation-delay: var(--fa-animation-delay, 0s);\n          animation-delay: var(--fa-animation-delay, 0s);\n  -webkit-animation-direction: var(--fa-animation-direction, normal);\n          animation-direction: var(--fa-animation-direction, normal);\n  -webkit-animation-duration: var(--fa-animation-duration, 1s);\n          animation-duration: var(--fa-animation-duration, 1s);\n  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n          animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  -webkit-animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));\n          animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));\n}\n\n.fa-flip {\n  -webkit-animation-name: fa-flip;\n          animation-name: fa-flip;\n  -webkit-animation-delay: var(--fa-animation-delay, 0s);\n          animation-delay: var(--fa-animation-delay, 0s);\n  -webkit-animation-direction: var(--fa-animation-direction, normal);\n          animation-direction: var(--fa-animation-direction, normal);\n  -webkit-animation-duration: var(--fa-animation-duration, 1s);\n          animation-duration: var(--fa-animation-duration, 1s);\n  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n          animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  -webkit-animation-timing-function: var(--fa-animation-timing, ease-in-out);\n          animation-timing-function: var(--fa-animation-timing, ease-in-out);\n}\n\n.fa-shake {\n  -webkit-animation-name: fa-shake;\n          animation-name: fa-shake;\n  -webkit-animation-delay: var(--fa-animation-delay, 0s);\n          animation-delay: var(--fa-animation-delay, 0s);\n  -webkit-animation-direction: var(--fa-animation-direction, normal);\n          animation-direction: var(--fa-animation-direction, normal);\n  -webkit-animation-duration: var(--fa-animation-duration, 1s);\n          animation-duration: var(--fa-animation-duration, 1s);\n  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n          animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  -webkit-animation-timing-function: var(--fa-animation-timing, linear);\n          animation-timing-function: var(--fa-animation-timing, linear);\n}\n\n.fa-spin {\n  -webkit-animation-name: fa-spin;\n          animation-name: fa-spin;\n  -webkit-animation-delay: var(--fa-animation-delay, 0s);\n          animation-delay: var(--fa-animation-delay, 0s);\n  -webkit-animation-direction: var(--fa-animation-direction, normal);\n          animation-direction: var(--fa-animation-direction, normal);\n  -webkit-animation-duration: var(--fa-animation-duration, 2s);\n          animation-duration: var(--fa-animation-duration, 2s);\n  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n          animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  -webkit-animation-timing-function: var(--fa-animation-timing, linear);\n          animation-timing-function: var(--fa-animation-timing, linear);\n}\n\n.fa-spin-reverse {\n  --fa-animation-direction: reverse;\n}\n\n.fa-pulse,\n.fa-spin-pulse {\n  -webkit-animation-name: fa-spin;\n          animation-name: fa-spin;\n  -webkit-animation-direction: var(--fa-animation-direction, normal);\n          animation-direction: var(--fa-animation-direction, normal);\n  -webkit-animation-duration: var(--fa-animation-duration, 1s);\n          animation-duration: var(--fa-animation-duration, 1s);\n  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n          animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  -webkit-animation-timing-function: var(--fa-animation-timing, steps(8));\n          animation-timing-function: var(--fa-animation-timing, steps(8));\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .fa-beat,\n.fa-bounce,\n.fa-fade,\n.fa-beat-fade,\n.fa-flip,\n.fa-pulse,\n.fa-shake,\n.fa-spin,\n.fa-spin-pulse {\n    -webkit-animation-delay: -1ms;\n            animation-delay: -1ms;\n    -webkit-animation-duration: 1ms;\n            animation-duration: 1ms;\n    -webkit-animation-iteration-count: 1;\n            animation-iteration-count: 1;\n    -webkit-transition-delay: 0s;\n            transition-delay: 0s;\n    -webkit-transition-duration: 0s;\n            transition-duration: 0s;\n  }\n}\n@-webkit-keyframes fa-beat {\n  0%, 90% {\n    -webkit-transform: scale(1);\n            transform: scale(1);\n  }\n  45% {\n    -webkit-transform: scale(var(--fa-beat-scale, 1.25));\n            transform: scale(var(--fa-beat-scale, 1.25));\n  }\n}\n@keyframes fa-beat {\n  0%, 90% {\n    -webkit-transform: scale(1);\n            transform: scale(1);\n  }\n  45% {\n    -webkit-transform: scale(var(--fa-beat-scale, 1.25));\n            transform: scale(var(--fa-beat-scale, 1.25));\n  }\n}\n@-webkit-keyframes fa-bounce {\n  0% {\n    -webkit-transform: scale(1, 1) translateY(0);\n            transform: scale(1, 1) translateY(0);\n  }\n  10% {\n    -webkit-transform: scale(var(--fa-bounce-start-scale-x, 1.1), var(--fa-bounce-start-scale-y, 0.9)) translateY(0);\n            transform: scale(var(--fa-bounce-start-scale-x, 1.1), var(--fa-bounce-start-scale-y, 0.9)) translateY(0);\n  }\n  30% {\n    -webkit-transform: scale(var(--fa-bounce-jump-scale-x, 0.9), var(--fa-bounce-jump-scale-y, 1.1)) translateY(var(--fa-bounce-height, -0.5em));\n            transform: scale(var(--fa-bounce-jump-scale-x, 0.9), var(--fa-bounce-jump-scale-y, 1.1)) translateY(var(--fa-bounce-height, -0.5em));\n  }\n  50% {\n    -webkit-transform: scale(var(--fa-bounce-land-scale-x, 1.05), var(--fa-bounce-land-scale-y, 0.95)) translateY(0);\n            transform: scale(var(--fa-bounce-land-scale-x, 1.05), var(--fa-bounce-land-scale-y, 0.95)) translateY(0);\n  }\n  57% {\n    -webkit-transform: scale(1, 1) translateY(var(--fa-bounce-rebound, -0.125em));\n            transform: scale(1, 1) translateY(var(--fa-bounce-rebound, -0.125em));\n  }\n  64% {\n    -webkit-transform: scale(1, 1) translateY(0);\n            transform: scale(1, 1) translateY(0);\n  }\n  100% {\n    -webkit-transform: scale(1, 1) translateY(0);\n            transform: scale(1, 1) translateY(0);\n  }\n}\n@keyframes fa-bounce {\n  0% {\n    -webkit-transform: scale(1, 1) translateY(0);\n            transform: scale(1, 1) translateY(0);\n  }\n  10% {\n    -webkit-transform: scale(var(--fa-bounce-start-scale-x, 1.1), var(--fa-bounce-start-scale-y, 0.9)) translateY(0);\n            transform: scale(var(--fa-bounce-start-scale-x, 1.1), var(--fa-bounce-start-scale-y, 0.9)) translateY(0);\n  }\n  30% {\n    -webkit-transform: scale(var(--fa-bounce-jump-scale-x, 0.9), var(--fa-bounce-jump-scale-y, 1.1)) translateY(var(--fa-bounce-height, -0.5em));\n            transform: scale(var(--fa-bounce-jump-scale-x, 0.9), var(--fa-bounce-jump-scale-y, 1.1)) translateY(var(--fa-bounce-height, -0.5em));\n  }\n  50% {\n    -webkit-transform: scale(var(--fa-bounce-land-scale-x, 1.05), var(--fa-bounce-land-scale-y, 0.95)) translateY(0);\n            transform: scale(var(--fa-bounce-land-scale-x, 1.05), var(--fa-bounce-land-scale-y, 0.95)) translateY(0);\n  }\n  57% {\n    -webkit-transform: scale(1, 1) translateY(var(--fa-bounce-rebound, -0.125em));\n            transform: scale(1, 1) translateY(var(--fa-bounce-rebound, -0.125em));\n  }\n  64% {\n    -webkit-transform: scale(1, 1) translateY(0);\n            transform: scale(1, 1) translateY(0);\n  }\n  100% {\n    -webkit-transform: scale(1, 1) translateY(0);\n            transform: scale(1, 1) translateY(0);\n  }\n}\n@-webkit-keyframes fa-fade {\n  50% {\n    opacity: var(--fa-fade-opacity, 0.4);\n  }\n}\n@keyframes fa-fade {\n  50% {\n    opacity: var(--fa-fade-opacity, 0.4);\n  }\n}\n@-webkit-keyframes fa-beat-fade {\n  0%, 100% {\n    opacity: var(--fa-beat-fade-opacity, 0.4);\n    -webkit-transform: scale(1);\n            transform: scale(1);\n  }\n  50% {\n    opacity: 1;\n    -webkit-transform: scale(var(--fa-beat-fade-scale, 1.125));\n            transform: scale(var(--fa-beat-fade-scale, 1.125));\n  }\n}\n@keyframes fa-beat-fade {\n  0%, 100% {\n    opacity: var(--fa-beat-fade-opacity, 0.4);\n    -webkit-transform: scale(1);\n            transform: scale(1);\n  }\n  50% {\n    opacity: 1;\n    -webkit-transform: scale(var(--fa-beat-fade-scale, 1.125));\n            transform: scale(var(--fa-beat-fade-scale, 1.125));\n  }\n}\n@-webkit-keyframes fa-flip {\n  50% {\n    -webkit-transform: rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), var(--fa-flip-angle, -180deg));\n            transform: rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), var(--fa-flip-angle, -180deg));\n  }\n}\n@keyframes fa-flip {\n  50% {\n    -webkit-transform: rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), var(--fa-flip-angle, -180deg));\n            transform: rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), var(--fa-flip-angle, -180deg));\n  }\n}\n@-webkit-keyframes fa-shake {\n  0% {\n    -webkit-transform: rotate(-15deg);\n            transform: rotate(-15deg);\n  }\n  4% {\n    -webkit-transform: rotate(15deg);\n            transform: rotate(15deg);\n  }\n  8%, 24% {\n    -webkit-transform: rotate(-18deg);\n            transform: rotate(-18deg);\n  }\n  12%, 28% {\n    -webkit-transform: rotate(18deg);\n            transform: rotate(18deg);\n  }\n  16% {\n    -webkit-transform: rotate(-22deg);\n            transform: rotate(-22deg);\n  }\n  20% {\n    -webkit-transform: rotate(22deg);\n            transform: rotate(22deg);\n  }\n  32% {\n    -webkit-transform: rotate(-12deg);\n            transform: rotate(-12deg);\n  }\n  36% {\n    -webkit-transform: rotate(12deg);\n            transform: rotate(12deg);\n  }\n  40%, 100% {\n    -webkit-transform: rotate(0deg);\n            transform: rotate(0deg);\n  }\n}\n@keyframes fa-shake {\n  0% {\n    -webkit-transform: rotate(-15deg);\n            transform: rotate(-15deg);\n  }\n  4% {\n    -webkit-transform: rotate(15deg);\n            transform: rotate(15deg);\n  }\n  8%, 24% {\n    -webkit-transform: rotate(-18deg);\n            transform: rotate(-18deg);\n  }\n  12%, 28% {\n    -webkit-transform: rotate(18deg);\n            transform: rotate(18deg);\n  }\n  16% {\n    -webkit-transform: rotate(-22deg);\n            transform: rotate(-22deg);\n  }\n  20% {\n    -webkit-transform: rotate(22deg);\n            transform: rotate(22deg);\n  }\n  32% {\n    -webkit-transform: rotate(-12deg);\n            transform: rotate(-12deg);\n  }\n  36% {\n    -webkit-transform: rotate(12deg);\n            transform: rotate(12deg);\n  }\n  40%, 100% {\n    -webkit-transform: rotate(0deg);\n            transform: rotate(0deg);\n  }\n}\n@-webkit-keyframes fa-spin {\n  0% {\n    -webkit-transform: rotate(0deg);\n            transform: rotate(0deg);\n  }\n  100% {\n    -webkit-transform: rotate(360deg);\n            transform: rotate(360deg);\n  }\n}\n@keyframes fa-spin {\n  0% {\n    -webkit-transform: rotate(0deg);\n            transform: rotate(0deg);\n  }\n  100% {\n    -webkit-transform: rotate(360deg);\n            transform: rotate(360deg);\n  }\n}\n.fa-rotate-90 {\n  -webkit-transform: rotate(90deg);\n          transform: rotate(90deg);\n}\n\n.fa-rotate-180 {\n  -webkit-transform: rotate(180deg);\n          transform: rotate(180deg);\n}\n\n.fa-rotate-270 {\n  -webkit-transform: rotate(270deg);\n          transform: rotate(270deg);\n}\n\n.fa-flip-horizontal {\n  -webkit-transform: scale(-1, 1);\n          transform: scale(-1, 1);\n}\n\n.fa-flip-vertical {\n  -webkit-transform: scale(1, -1);\n          transform: scale(1, -1);\n}\n\n.fa-flip-both,\n.fa-flip-horizontal.fa-flip-vertical {\n  -webkit-transform: scale(-1, -1);\n          transform: scale(-1, -1);\n}\n\n.fa-rotate-by {\n  -webkit-transform: rotate(var(--fa-rotate-angle, 0));\n          transform: rotate(var(--fa-rotate-angle, 0));\n}\n\n.fa-stack {\n  display: inline-block;\n  vertical-align: middle;\n  height: 2em;\n  position: relative;\n  width: 2.5em;\n}\n\n.fa-stack-1x,\n.fa-stack-2x {\n  bottom: 0;\n  left: 0;\n  margin: auto;\n  position: absolute;\n  right: 0;\n  top: 0;\n  z-index: var(--fa-stack-z-index, auto);\n}\n\n.svg-inline--fa.fa-stack-1x {\n  height: 1em;\n  width: 1.25em;\n}\n.svg-inline--fa.fa-stack-2x {\n  height: 2em;\n  width: 2.5em;\n}\n\n.fa-inverse {\n  color: var(--fa-inverse, #fff);\n}\n\n.sr-only,\n.fa-sr-only {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  padding: 0;\n  margin: -1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  white-space: nowrap;\n  border-width: 0;\n}\n\n.sr-only-focusable:not(:focus),\n.fa-sr-only-focusable:not(:focus) {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  padding: 0;\n  margin: -1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  white-space: nowrap;\n  border-width: 0;\n}\n\n.svg-inline--fa .fa-primary {\n  fill: var(--fa-primary-color, currentColor);\n  opacity: var(--fa-primary-opacity, 1);\n}\n\n.svg-inline--fa .fa-secondary {\n  fill: var(--fa-secondary-color, currentColor);\n  opacity: var(--fa-secondary-opacity, 0.4);\n}\n\n.svg-inline--fa.fa-swap-opacity .fa-primary {\n  opacity: var(--fa-secondary-opacity, 0.4);\n}\n\n.svg-inline--fa.fa-swap-opacity .fa-secondary {\n  opacity: var(--fa-primary-opacity, 1);\n}\n\n.svg-inline--fa mask .fa-primary,\n.svg-inline--fa mask .fa-secondary {\n  fill: black;\n}\n\n.fad.fa-inverse,\n.fa-duotone.fa-inverse {\n  color: var(--fa-inverse, #fff);\n}';
function css() {
  var dcp = DEFAULT_CSS_PREFIX;
  var drc = DEFAULT_REPLACEMENT_CLASS;
  var fp = config.cssPrefix;
  var rc = config.replacementClass;
  var s = baseStyles;
  if (fp !== dcp || rc !== drc) {
    var dPatt = new RegExp("\\.".concat(dcp, "\\-"), "g");
    var customPropPatt = new RegExp("\\--".concat(dcp, "\\-"), "g");
    var rPatt = new RegExp("\\.".concat(drc), "g");
    s = s.replace(dPatt, ".".concat(fp, "-")).replace(customPropPatt, "--".concat(fp, "-")).replace(rPatt, ".".concat(rc));
  }
  return s;
}
var _cssInserted = false;
function ensureCss() {
  if (config.autoAddCss && !_cssInserted) {
    insertCss(css());
    _cssInserted = true;
  }
}
var InjectCSS = {
  mixout: function mixout() {
    return {
      dom: {
        css,
        insertCss: ensureCss
      }
    };
  },
  hooks: function hooks() {
    return {
      beforeDOMElementCreation: function beforeDOMElementCreation() {
        ensureCss();
      },
      beforeI2svg: function beforeI2svg() {
        ensureCss();
      }
    };
  }
};
var w = WINDOW || {};
if (!w[NAMESPACE_IDENTIFIER]) w[NAMESPACE_IDENTIFIER] = {};
if (!w[NAMESPACE_IDENTIFIER].styles) w[NAMESPACE_IDENTIFIER].styles = {};
if (!w[NAMESPACE_IDENTIFIER].hooks) w[NAMESPACE_IDENTIFIER].hooks = {};
if (!w[NAMESPACE_IDENTIFIER].shims) w[NAMESPACE_IDENTIFIER].shims = [];
var namespace = w[NAMESPACE_IDENTIFIER];
var functions = [];
var listener = function listener2() {
  DOCUMENT2.removeEventListener("DOMContentLoaded", listener2);
  loaded = 1;
  functions.map(function(fn) {
    return fn();
  });
};
var loaded = false;
if (IS_DOM) {
  loaded = (DOCUMENT2.documentElement.doScroll ? /^loaded|^c/ : /^loaded|^i|^c/).test(DOCUMENT2.readyState);
  if (!loaded) DOCUMENT2.addEventListener("DOMContentLoaded", listener);
}
function domready(fn) {
  if (!IS_DOM) return;
  loaded ? setTimeout(fn, 0) : functions.push(fn);
}
function toHtml(abstractNodes) {
  var tag = abstractNodes.tag, _abstractNodes$attrib = abstractNodes.attributes, attributes = _abstractNodes$attrib === void 0 ? {} : _abstractNodes$attrib, _abstractNodes$childr = abstractNodes.children, children = _abstractNodes$childr === void 0 ? [] : _abstractNodes$childr;
  if (typeof abstractNodes === "string") {
    return htmlEscape(abstractNodes);
  } else {
    return "<".concat(tag, " ").concat(joinAttributes(attributes), ">").concat(children.map(toHtml).join(""), "</").concat(tag, ">");
  }
}
function iconFromMapping(mapping, prefix, iconName) {
  if (mapping && mapping[prefix] && mapping[prefix][iconName]) {
    return {
      prefix,
      iconName,
      icon: mapping[prefix][iconName]
    };
  }
}
var bindInternal4 = function bindInternal42(func, thisContext) {
  return function(a, b, c, d2) {
    return func.call(thisContext, a, b, c, d2);
  };
};
var reduce = function fastReduceObject(subject, fn, initialValue, thisContext) {
  var keys = Object.keys(subject), length = keys.length, iterator = thisContext !== void 0 ? bindInternal4(fn, thisContext) : fn, i, key, result;
  if (initialValue === void 0) {
    i = 1;
    result = subject[keys[0]];
  } else {
    i = 0;
    result = initialValue;
  }
  for (; i < length; i++) {
    key = keys[i];
    result = iterator(result, subject[key], key, subject);
  }
  return result;
};
function ucs2decode(string) {
  var output = [];
  var counter2 = 0;
  var length = string.length;
  while (counter2 < length) {
    var value = string.charCodeAt(counter2++);
    if (value >= 55296 && value <= 56319 && counter2 < length) {
      var extra = string.charCodeAt(counter2++);
      if ((extra & 64512) == 56320) {
        output.push(((value & 1023) << 10) + (extra & 1023) + 65536);
      } else {
        output.push(value);
        counter2--;
      }
    } else {
      output.push(value);
    }
  }
  return output;
}
function toHex(unicode) {
  var decoded = ucs2decode(unicode);
  return decoded.length === 1 ? decoded[0].toString(16) : null;
}
function codePointAt(string, index) {
  var size = string.length;
  var first = string.charCodeAt(index);
  var second;
  if (first >= 55296 && first <= 56319 && size > index + 1) {
    second = string.charCodeAt(index + 1);
    if (second >= 56320 && second <= 57343) {
      return (first - 55296) * 1024 + second - 56320 + 65536;
    }
  }
  return first;
}
function normalizeIcons(icons) {
  return Object.keys(icons).reduce(function(acc, iconName) {
    var icon3 = icons[iconName];
    var expanded = !!icon3.icon;
    if (expanded) {
      acc[icon3.iconName] = icon3.icon;
    } else {
      acc[iconName] = icon3;
    }
    return acc;
  }, {});
}
function defineIcons(prefix, icons) {
  var params = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
  var _params$skipHooks = params.skipHooks, skipHooks = _params$skipHooks === void 0 ? false : _params$skipHooks;
  var normalized = normalizeIcons(icons);
  if (typeof namespace.hooks.addPack === "function" && !skipHooks) {
    namespace.hooks.addPack(prefix, normalizeIcons(icons));
  } else {
    namespace.styles[prefix] = _objectSpread2(_objectSpread2({}, namespace.styles[prefix] || {}), normalized);
  }
  if (prefix === "fas") {
    defineIcons("fa", icons);
  }
}
var _LONG_STYLE;
var _PREFIXES;
var _PREFIXES_FOR_FAMILY;
var styles = namespace.styles;
var shims = namespace.shims;
var LONG_STYLE = (_LONG_STYLE = {}, _defineProperty(_LONG_STYLE, FAMILY_CLASSIC, Object.values(PREFIX_TO_LONG_STYLE[FAMILY_CLASSIC])), _defineProperty(_LONG_STYLE, FAMILY_SHARP, Object.values(PREFIX_TO_LONG_STYLE[FAMILY_SHARP])), _LONG_STYLE);
var _defaultUsablePrefix = null;
var _byUnicode = {};
var _byLigature = {};
var _byOldName = {};
var _byOldUnicode = {};
var _byAlias = {};
var PREFIXES = (_PREFIXES = {}, _defineProperty(_PREFIXES, FAMILY_CLASSIC, Object.keys(PREFIX_TO_STYLE[FAMILY_CLASSIC])), _defineProperty(_PREFIXES, FAMILY_SHARP, Object.keys(PREFIX_TO_STYLE[FAMILY_SHARP])), _PREFIXES);
function isReserved(name) {
  return ~RESERVED_CLASSES.indexOf(name);
}
function getIconName(cssPrefix, cls) {
  var parts = cls.split("-");
  var prefix = parts[0];
  var iconName = parts.slice(1).join("-");
  if (prefix === cssPrefix && iconName !== "" && !isReserved(iconName)) {
    return iconName;
  } else {
    return null;
  }
}
var build = function build2() {
  var lookup = function lookup2(reducer) {
    return reduce(styles, function(o, style, prefix) {
      o[prefix] = reduce(style, reducer, {});
      return o;
    }, {});
  };
  _byUnicode = lookup(function(acc, icon3, iconName) {
    if (icon3[3]) {
      acc[icon3[3]] = iconName;
    }
    if (icon3[2]) {
      var aliases = icon3[2].filter(function(a) {
        return typeof a === "number";
      });
      aliases.forEach(function(alias) {
        acc[alias.toString(16)] = iconName;
      });
    }
    return acc;
  });
  _byLigature = lookup(function(acc, icon3, iconName) {
    acc[iconName] = iconName;
    if (icon3[2]) {
      var aliases = icon3[2].filter(function(a) {
        return typeof a === "string";
      });
      aliases.forEach(function(alias) {
        acc[alias] = iconName;
      });
    }
    return acc;
  });
  _byAlias = lookup(function(acc, icon3, iconName) {
    var aliases = icon3[2];
    acc[iconName] = iconName;
    aliases.forEach(function(alias) {
      acc[alias] = iconName;
    });
    return acc;
  });
  var hasRegular = "far" in styles || config.autoFetchSvg;
  var shimLookups = reduce(shims, function(acc, shim) {
    var maybeNameMaybeUnicode = shim[0];
    var prefix = shim[1];
    var iconName = shim[2];
    if (prefix === "far" && !hasRegular) {
      prefix = "fas";
    }
    if (typeof maybeNameMaybeUnicode === "string") {
      acc.names[maybeNameMaybeUnicode] = {
        prefix,
        iconName
      };
    }
    if (typeof maybeNameMaybeUnicode === "number") {
      acc.unicodes[maybeNameMaybeUnicode.toString(16)] = {
        prefix,
        iconName
      };
    }
    return acc;
  }, {
    names: {},
    unicodes: {}
  });
  _byOldName = shimLookups.names;
  _byOldUnicode = shimLookups.unicodes;
  _defaultUsablePrefix = getCanonicalPrefix(config.styleDefault, {
    family: config.familyDefault
  });
};
onChange(function(c) {
  _defaultUsablePrefix = getCanonicalPrefix(c.styleDefault, {
    family: config.familyDefault
  });
});
build();
function byUnicode(prefix, unicode) {
  return (_byUnicode[prefix] || {})[unicode];
}
function byLigature(prefix, ligature) {
  return (_byLigature[prefix] || {})[ligature];
}
function byAlias(prefix, alias) {
  return (_byAlias[prefix] || {})[alias];
}
function byOldName(name) {
  return _byOldName[name] || {
    prefix: null,
    iconName: null
  };
}
function byOldUnicode(unicode) {
  var oldUnicode = _byOldUnicode[unicode];
  var newUnicode = byUnicode("fas", unicode);
  return oldUnicode || (newUnicode ? {
    prefix: "fas",
    iconName: newUnicode
  } : null) || {
    prefix: null,
    iconName: null
  };
}
function getDefaultUsablePrefix() {
  return _defaultUsablePrefix;
}
var emptyCanonicalIcon = function emptyCanonicalIcon2() {
  return {
    prefix: null,
    iconName: null,
    rest: []
  };
};
function getCanonicalPrefix(styleOrPrefix) {
  var params = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  var _params$family = params.family, family = _params$family === void 0 ? FAMILY_CLASSIC : _params$family;
  var style = PREFIX_TO_STYLE[family][styleOrPrefix];
  var prefix = STYLE_TO_PREFIX[family][styleOrPrefix] || STYLE_TO_PREFIX[family][style];
  var defined = styleOrPrefix in namespace.styles ? styleOrPrefix : null;
  return prefix || defined || null;
}
var PREFIXES_FOR_FAMILY = (_PREFIXES_FOR_FAMILY = {}, _defineProperty(_PREFIXES_FOR_FAMILY, FAMILY_CLASSIC, Object.keys(PREFIX_TO_LONG_STYLE[FAMILY_CLASSIC])), _defineProperty(_PREFIXES_FOR_FAMILY, FAMILY_SHARP, Object.keys(PREFIX_TO_LONG_STYLE[FAMILY_SHARP])), _PREFIXES_FOR_FAMILY);
function getCanonicalIcon(values) {
  var _famProps;
  var params = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  var _params$skipLookups = params.skipLookups, skipLookups = _params$skipLookups === void 0 ? false : _params$skipLookups;
  var famProps = (_famProps = {}, _defineProperty(_famProps, FAMILY_CLASSIC, "".concat(config.cssPrefix, "-").concat(FAMILY_CLASSIC)), _defineProperty(_famProps, FAMILY_SHARP, "".concat(config.cssPrefix, "-").concat(FAMILY_SHARP)), _famProps);
  var givenPrefix = null;
  var family = FAMILY_CLASSIC;
  if (values.includes(famProps[FAMILY_CLASSIC]) || values.some(function(v) {
    return PREFIXES_FOR_FAMILY[FAMILY_CLASSIC].includes(v);
  })) {
    family = FAMILY_CLASSIC;
  }
  if (values.includes(famProps[FAMILY_SHARP]) || values.some(function(v) {
    return PREFIXES_FOR_FAMILY[FAMILY_SHARP].includes(v);
  })) {
    family = FAMILY_SHARP;
  }
  var canonical = values.reduce(function(acc, cls) {
    var iconName = getIconName(config.cssPrefix, cls);
    if (styles[cls]) {
      cls = LONG_STYLE[family].includes(cls) ? LONG_STYLE_TO_PREFIX[family][cls] : cls;
      givenPrefix = cls;
      acc.prefix = cls;
    } else if (PREFIXES[family].indexOf(cls) > -1) {
      givenPrefix = cls;
      acc.prefix = getCanonicalPrefix(cls, {
        family
      });
    } else if (iconName) {
      acc.iconName = iconName;
    } else if (cls !== config.replacementClass && cls !== famProps[FAMILY_CLASSIC] && cls !== famProps[FAMILY_SHARP]) {
      acc.rest.push(cls);
    }
    if (!skipLookups && acc.prefix && acc.iconName) {
      var shim = givenPrefix === "fa" ? byOldName(acc.iconName) : {};
      var aliasIconName = byAlias(acc.prefix, acc.iconName);
      if (shim.prefix) {
        givenPrefix = null;
      }
      acc.iconName = shim.iconName || aliasIconName || acc.iconName;
      acc.prefix = shim.prefix || acc.prefix;
      if (acc.prefix === "far" && !styles["far"] && styles["fas"] && !config.autoFetchSvg) {
        acc.prefix = "fas";
      }
    }
    return acc;
  }, emptyCanonicalIcon());
  if (values.includes("fa-brands") || values.includes("fab")) {
    canonical.prefix = "fab";
  }
  if (values.includes("fa-duotone") || values.includes("fad")) {
    canonical.prefix = "fad";
  }
  if (!canonical.prefix && family === FAMILY_SHARP && (styles["fass"] || config.autoFetchSvg)) {
    canonical.prefix = "fass";
    canonical.iconName = byAlias(canonical.prefix, canonical.iconName) || canonical.iconName;
  }
  if (canonical.prefix === "fa" || givenPrefix === "fa") {
    canonical.prefix = getDefaultUsablePrefix() || "fas";
  }
  return canonical;
}
var Library = /* @__PURE__ */ function() {
  function Library2() {
    _classCallCheck(this, Library2);
    this.definitions = {};
  }
  _createClass(Library2, [{
    key: "add",
    value: function add() {
      var _this = this;
      for (var _len = arguments.length, definitions = new Array(_len), _key = 0; _key < _len; _key++) {
        definitions[_key] = arguments[_key];
      }
      var additions = definitions.reduce(this._pullDefinitions, {});
      Object.keys(additions).forEach(function(key) {
        _this.definitions[key] = _objectSpread2(_objectSpread2({}, _this.definitions[key] || {}), additions[key]);
        defineIcons(key, additions[key]);
        var longPrefix = PREFIX_TO_LONG_STYLE[FAMILY_CLASSIC][key];
        if (longPrefix) defineIcons(longPrefix, additions[key]);
        build();
      });
    }
  }, {
    key: "reset",
    value: function reset() {
      this.definitions = {};
    }
  }, {
    key: "_pullDefinitions",
    value: function _pullDefinitions(additions, definition) {
      var normalized = definition.prefix && definition.iconName && definition.icon ? {
        0: definition
      } : definition;
      Object.keys(normalized).map(function(key) {
        var _normalized$key = normalized[key], prefix = _normalized$key.prefix, iconName = _normalized$key.iconName, icon3 = _normalized$key.icon;
        var aliases = icon3[2];
        if (!additions[prefix]) additions[prefix] = {};
        if (aliases.length > 0) {
          aliases.forEach(function(alias) {
            if (typeof alias === "string") {
              additions[prefix][alias] = icon3;
            }
          });
        }
        additions[prefix][iconName] = icon3;
      });
      return additions;
    }
  }]);
  return Library2;
}();
var _plugins = [];
var _hooks = {};
var providers = {};
var defaultProviderKeys = Object.keys(providers);
function registerPlugins(nextPlugins, _ref2) {
  var obj = _ref2.mixoutsTo;
  _plugins = nextPlugins;
  _hooks = {};
  Object.keys(providers).forEach(function(k) {
    if (defaultProviderKeys.indexOf(k) === -1) {
      delete providers[k];
    }
  });
  _plugins.forEach(function(plugin) {
    var mixout8 = plugin.mixout ? plugin.mixout() : {};
    Object.keys(mixout8).forEach(function(tk) {
      if (typeof mixout8[tk] === "function") {
        obj[tk] = mixout8[tk];
      }
      if (_typeof(mixout8[tk]) === "object") {
        Object.keys(mixout8[tk]).forEach(function(sk) {
          if (!obj[tk]) {
            obj[tk] = {};
          }
          obj[tk][sk] = mixout8[tk][sk];
        });
      }
    });
    if (plugin.hooks) {
      var hooks8 = plugin.hooks();
      Object.keys(hooks8).forEach(function(hook) {
        if (!_hooks[hook]) {
          _hooks[hook] = [];
        }
        _hooks[hook].push(hooks8[hook]);
      });
    }
    if (plugin.provides) {
      plugin.provides(providers);
    }
  });
  return obj;
}
function chainHooks(hook, accumulator) {
  for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }
  var hookFns = _hooks[hook] || [];
  hookFns.forEach(function(hookFn) {
    accumulator = hookFn.apply(null, [accumulator].concat(args));
  });
  return accumulator;
}
function callHooks(hook) {
  for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    args[_key2 - 1] = arguments[_key2];
  }
  var hookFns = _hooks[hook] || [];
  hookFns.forEach(function(hookFn) {
    hookFn.apply(null, args);
  });
  return void 0;
}
function callProvided() {
  var hook = arguments[0];
  var args = Array.prototype.slice.call(arguments, 1);
  return providers[hook] ? providers[hook].apply(null, args) : void 0;
}
function findIconDefinition(iconLookup) {
  if (iconLookup.prefix === "fa") {
    iconLookup.prefix = "fas";
  }
  var iconName = iconLookup.iconName;
  var prefix = iconLookup.prefix || getDefaultUsablePrefix();
  if (!iconName) return;
  iconName = byAlias(prefix, iconName) || iconName;
  return iconFromMapping(library.definitions, prefix, iconName) || iconFromMapping(namespace.styles, prefix, iconName);
}
var library = new Library();
var noAuto = function noAuto2() {
  config.autoReplaceSvg = false;
  config.observeMutations = false;
  callHooks("noAuto");
};
var dom = {
  i2svg: function i2svg() {
    var params = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (IS_DOM) {
      callHooks("beforeI2svg", params);
      callProvided("pseudoElements2svg", params);
      return callProvided("i2svg", params);
    } else {
      return Promise.reject("Operation requires a DOM of some kind.");
    }
  },
  watch: function watch() {
    var params = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    var autoReplaceSvgRoot = params.autoReplaceSvgRoot;
    if (config.autoReplaceSvg === false) {
      config.autoReplaceSvg = true;
    }
    config.observeMutations = true;
    domready(function() {
      autoReplace({
        autoReplaceSvgRoot
      });
      callHooks("watch", params);
    });
  }
};
var parse = {
  icon: function icon(_icon) {
    if (_icon === null) {
      return null;
    }
    if (_typeof(_icon) === "object" && _icon.prefix && _icon.iconName) {
      return {
        prefix: _icon.prefix,
        iconName: byAlias(_icon.prefix, _icon.iconName) || _icon.iconName
      };
    }
    if (Array.isArray(_icon) && _icon.length === 2) {
      var iconName = _icon[1].indexOf("fa-") === 0 ? _icon[1].slice(3) : _icon[1];
      var prefix = getCanonicalPrefix(_icon[0]);
      return {
        prefix,
        iconName: byAlias(prefix, iconName) || iconName
      };
    }
    if (typeof _icon === "string" && (_icon.indexOf("".concat(config.cssPrefix, "-")) > -1 || _icon.match(ICON_SELECTION_SYNTAX_PATTERN))) {
      var canonicalIcon = getCanonicalIcon(_icon.split(" "), {
        skipLookups: true
      });
      return {
        prefix: canonicalIcon.prefix || getDefaultUsablePrefix(),
        iconName: byAlias(canonicalIcon.prefix, canonicalIcon.iconName) || canonicalIcon.iconName
      };
    }
    if (typeof _icon === "string") {
      var _prefix = getDefaultUsablePrefix();
      return {
        prefix: _prefix,
        iconName: byAlias(_prefix, _icon) || _icon
      };
    }
  }
};
var api = {
  noAuto,
  config,
  dom,
  parse,
  library,
  findIconDefinition,
  toHtml
};
var autoReplace = function autoReplace2() {
  var params = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
  var _params$autoReplaceSv = params.autoReplaceSvgRoot, autoReplaceSvgRoot = _params$autoReplaceSv === void 0 ? DOCUMENT2 : _params$autoReplaceSv;
  if ((Object.keys(namespace.styles).length > 0 || config.autoFetchSvg) && IS_DOM && config.autoReplaceSvg) api.dom.i2svg({
    node: autoReplaceSvgRoot
  });
};
function domVariants(val, abstractCreator) {
  Object.defineProperty(val, "abstract", {
    get: abstractCreator
  });
  Object.defineProperty(val, "html", {
    get: function get2() {
      return val.abstract.map(function(a) {
        return toHtml(a);
      });
    }
  });
  Object.defineProperty(val, "node", {
    get: function get2() {
      if (!IS_DOM) return;
      var container = DOCUMENT2.createElement("div");
      container.innerHTML = val.html;
      return container.children;
    }
  });
  return val;
}
function asIcon(_ref2) {
  var children = _ref2.children, main = _ref2.main, mask = _ref2.mask, attributes = _ref2.attributes, styles2 = _ref2.styles, transform = _ref2.transform;
  if (transformIsMeaningful(transform) && main.found && !mask.found) {
    var width = main.width, height = main.height;
    var offset = {
      x: width / height / 2,
      y: 0.5
    };
    attributes["style"] = joinStyles(_objectSpread2(_objectSpread2({}, styles2), {}, {
      "transform-origin": "".concat(offset.x + transform.x / 16, "em ").concat(offset.y + transform.y / 16, "em")
    }));
  }
  return [{
    tag: "svg",
    attributes,
    children
  }];
}
function asSymbol(_ref2) {
  var prefix = _ref2.prefix, iconName = _ref2.iconName, children = _ref2.children, attributes = _ref2.attributes, symbol = _ref2.symbol;
  var id = symbol === true ? "".concat(prefix, "-").concat(config.cssPrefix, "-").concat(iconName) : symbol;
  return [{
    tag: "svg",
    attributes: {
      style: "display: none;"
    },
    children: [{
      tag: "symbol",
      attributes: _objectSpread2(_objectSpread2({}, attributes), {}, {
        id
      }),
      children
    }]
  }];
}
function makeInlineSvgAbstract(params) {
  var _params$icons = params.icons, main = _params$icons.main, mask = _params$icons.mask, prefix = params.prefix, iconName = params.iconName, transform = params.transform, symbol = params.symbol, title = params.title, maskId = params.maskId, titleId = params.titleId, extra = params.extra, _params$watchable = params.watchable, watchable = _params$watchable === void 0 ? false : _params$watchable;
  var _ref2 = mask.found ? mask : main, width = _ref2.width, height = _ref2.height;
  var isUploadedIcon = prefix === "fak";
  var attrClass = [config.replacementClass, iconName ? "".concat(config.cssPrefix, "-").concat(iconName) : ""].filter(function(c) {
    return extra.classes.indexOf(c) === -1;
  }).filter(function(c) {
    return c !== "" || !!c;
  }).concat(extra.classes).join(" ");
  var content = {
    children: [],
    attributes: _objectSpread2(_objectSpread2({}, extra.attributes), {}, {
      "data-prefix": prefix,
      "data-icon": iconName,
      "class": attrClass,
      "role": extra.attributes.role || "img",
      "xmlns": "http://www.w3.org/2000/svg",
      "viewBox": "0 0 ".concat(width, " ").concat(height)
    })
  };
  var uploadedIconWidthStyle = isUploadedIcon && !~extra.classes.indexOf("fa-fw") ? {
    width: "".concat(width / height * 16 * 0.0625, "em")
  } : {};
  if (watchable) {
    content.attributes[DATA_FA_I2SVG] = "";
  }
  if (title) {
    content.children.push({
      tag: "title",
      attributes: {
        id: content.attributes["aria-labelledby"] || "title-".concat(titleId || nextUniqueId())
      },
      children: [title]
    });
    delete content.attributes.title;
  }
  var args = _objectSpread2(_objectSpread2({}, content), {}, {
    prefix,
    iconName,
    main,
    mask,
    maskId,
    transform,
    symbol,
    styles: _objectSpread2(_objectSpread2({}, uploadedIconWidthStyle), extra.styles)
  });
  var _ref22 = mask.found && main.found ? callProvided("generateAbstractMask", args) || {
    children: [],
    attributes: {}
  } : callProvided("generateAbstractIcon", args) || {
    children: [],
    attributes: {}
  }, children = _ref22.children, attributes = _ref22.attributes;
  args.children = children;
  args.attributes = attributes;
  if (symbol) {
    return asSymbol(args);
  } else {
    return asIcon(args);
  }
}
function makeLayersTextAbstract(params) {
  var content = params.content, width = params.width, height = params.height, transform = params.transform, title = params.title, extra = params.extra, _params$watchable2 = params.watchable, watchable = _params$watchable2 === void 0 ? false : _params$watchable2;
  var attributes = _objectSpread2(_objectSpread2(_objectSpread2({}, extra.attributes), title ? {
    "title": title
  } : {}), {}, {
    "class": extra.classes.join(" ")
  });
  if (watchable) {
    attributes[DATA_FA_I2SVG] = "";
  }
  var styles2 = _objectSpread2({}, extra.styles);
  if (transformIsMeaningful(transform)) {
    styles2["transform"] = transformForCss({
      transform,
      startCentered: true,
      width,
      height
    });
    styles2["-webkit-transform"] = styles2["transform"];
  }
  var styleString = joinStyles(styles2);
  if (styleString.length > 0) {
    attributes["style"] = styleString;
  }
  var val = [];
  val.push({
    tag: "span",
    attributes,
    children: [content]
  });
  if (title) {
    val.push({
      tag: "span",
      attributes: {
        class: "sr-only"
      },
      children: [title]
    });
  }
  return val;
}
function makeLayersCounterAbstract(params) {
  var content = params.content, title = params.title, extra = params.extra;
  var attributes = _objectSpread2(_objectSpread2(_objectSpread2({}, extra.attributes), title ? {
    "title": title
  } : {}), {}, {
    "class": extra.classes.join(" ")
  });
  var styleString = joinStyles(extra.styles);
  if (styleString.length > 0) {
    attributes["style"] = styleString;
  }
  var val = [];
  val.push({
    tag: "span",
    attributes,
    children: [content]
  });
  if (title) {
    val.push({
      tag: "span",
      attributes: {
        class: "sr-only"
      },
      children: [title]
    });
  }
  return val;
}
var styles$1 = namespace.styles;
function asFoundIcon(icon3) {
  var width = icon3[0];
  var height = icon3[1];
  var _icon$slice = icon3.slice(4), _icon$slice2 = _slicedToArray(_icon$slice, 1), vectorData = _icon$slice2[0];
  var element = null;
  if (Array.isArray(vectorData)) {
    element = {
      tag: "g",
      attributes: {
        class: "".concat(config.cssPrefix, "-").concat(DUOTONE_CLASSES.GROUP)
      },
      children: [{
        tag: "path",
        attributes: {
          class: "".concat(config.cssPrefix, "-").concat(DUOTONE_CLASSES.SECONDARY),
          fill: "currentColor",
          d: vectorData[0]
        }
      }, {
        tag: "path",
        attributes: {
          class: "".concat(config.cssPrefix, "-").concat(DUOTONE_CLASSES.PRIMARY),
          fill: "currentColor",
          d: vectorData[1]
        }
      }]
    };
  } else {
    element = {
      tag: "path",
      attributes: {
        fill: "currentColor",
        d: vectorData
      }
    };
  }
  return {
    found: true,
    width,
    height,
    icon: element
  };
}
var missingIconResolutionMixin = {
  found: false,
  width: 512,
  height: 512
};
function maybeNotifyMissing(iconName, prefix) {
  if (!PRODUCTION && !config.showMissingIcons && iconName) {
    console.error('Icon with name "'.concat(iconName, '" and prefix "').concat(prefix, '" is missing.'));
  }
}
function findIcon(iconName, prefix) {
  var givenPrefix = prefix;
  if (prefix === "fa" && config.styleDefault !== null) {
    prefix = getDefaultUsablePrefix();
  }
  return new Promise(function(resolve, reject) {
    var val = {
      found: false,
      width: 512,
      height: 512,
      icon: callProvided("missingIconAbstract") || {}
    };
    if (givenPrefix === "fa") {
      var shim = byOldName(iconName) || {};
      iconName = shim.iconName || iconName;
      prefix = shim.prefix || prefix;
    }
    if (iconName && prefix && styles$1[prefix] && styles$1[prefix][iconName]) {
      var icon3 = styles$1[prefix][iconName];
      return resolve(asFoundIcon(icon3));
    }
    maybeNotifyMissing(iconName, prefix);
    resolve(_objectSpread2(_objectSpread2({}, missingIconResolutionMixin), {}, {
      icon: config.showMissingIcons && iconName ? callProvided("missingIconAbstract") || {} : {}
    }));
  });
}
var noop$1 = function noop3() {
};
var p = config.measurePerformance && PERFORMANCE && PERFORMANCE.mark && PERFORMANCE.measure ? PERFORMANCE : {
  mark: noop$1,
  measure: noop$1
};
var preamble = 'FA "6.5.2"';
var begin = function begin2(name) {
  p.mark("".concat(preamble, " ").concat(name, " begins"));
  return function() {
    return end(name);
  };
};
var end = function end2(name) {
  p.mark("".concat(preamble, " ").concat(name, " ends"));
  p.measure("".concat(preamble, " ").concat(name), "".concat(preamble, " ").concat(name, " begins"), "".concat(preamble, " ").concat(name, " ends"));
};
var perf = {
  begin,
  end
};
var noop$2 = function noop4() {
};
function isWatched(node) {
  var i2svg2 = node.getAttribute ? node.getAttribute(DATA_FA_I2SVG) : null;
  return typeof i2svg2 === "string";
}
function hasPrefixAndIcon(node) {
  var prefix = node.getAttribute ? node.getAttribute(DATA_PREFIX) : null;
  var icon3 = node.getAttribute ? node.getAttribute(DATA_ICON) : null;
  return prefix && icon3;
}
function hasBeenReplaced(node) {
  return node && node.classList && node.classList.contains && node.classList.contains(config.replacementClass);
}
function getMutator() {
  if (config.autoReplaceSvg === true) {
    return mutators.replace;
  }
  var mutator = mutators[config.autoReplaceSvg];
  return mutator || mutators.replace;
}
function createElementNS(tag) {
  return DOCUMENT2.createElementNS("http://www.w3.org/2000/svg", tag);
}
function createElement(tag) {
  return DOCUMENT2.createElement(tag);
}
function convertSVG(abstractObj) {
  var params = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  var _params$ceFn = params.ceFn, ceFn = _params$ceFn === void 0 ? abstractObj.tag === "svg" ? createElementNS : createElement : _params$ceFn;
  if (typeof abstractObj === "string") {
    return DOCUMENT2.createTextNode(abstractObj);
  }
  var tag = ceFn(abstractObj.tag);
  Object.keys(abstractObj.attributes || []).forEach(function(key) {
    tag.setAttribute(key, abstractObj.attributes[key]);
  });
  var children = abstractObj.children || [];
  children.forEach(function(child) {
    tag.appendChild(convertSVG(child, {
      ceFn
    }));
  });
  return tag;
}
function nodeAsComment(node) {
  var comment = " ".concat(node.outerHTML, " ");
  comment = "".concat(comment, "Font Awesome fontawesome.com ");
  return comment;
}
var mutators = {
  replace: function replace(mutation) {
    var node = mutation[0];
    if (node.parentNode) {
      mutation[1].forEach(function(_abstract) {
        node.parentNode.insertBefore(convertSVG(_abstract), node);
      });
      if (node.getAttribute(DATA_FA_I2SVG) === null && config.keepOriginalSource) {
        var comment = DOCUMENT2.createComment(nodeAsComment(node));
        node.parentNode.replaceChild(comment, node);
      } else {
        node.remove();
      }
    }
  },
  nest: function nest(mutation) {
    var node = mutation[0];
    var _abstract2 = mutation[1];
    if (~classArray(node).indexOf(config.replacementClass)) {
      return mutators.replace(mutation);
    }
    var forSvg = new RegExp("".concat(config.cssPrefix, "-.*"));
    delete _abstract2[0].attributes.id;
    if (_abstract2[0].attributes.class) {
      var splitClasses = _abstract2[0].attributes.class.split(" ").reduce(function(acc, cls) {
        if (cls === config.replacementClass || cls.match(forSvg)) {
          acc.toSvg.push(cls);
        } else {
          acc.toNode.push(cls);
        }
        return acc;
      }, {
        toNode: [],
        toSvg: []
      });
      _abstract2[0].attributes.class = splitClasses.toSvg.join(" ");
      if (splitClasses.toNode.length === 0) {
        node.removeAttribute("class");
      } else {
        node.setAttribute("class", splitClasses.toNode.join(" "));
      }
    }
    var newInnerHTML = _abstract2.map(function(a) {
      return toHtml(a);
    }).join("\n");
    node.setAttribute(DATA_FA_I2SVG, "");
    node.innerHTML = newInnerHTML;
  }
};
function performOperationSync(op) {
  op();
}
function perform(mutations, callback) {
  var callbackFunction = typeof callback === "function" ? callback : noop$2;
  if (mutations.length === 0) {
    callbackFunction();
  } else {
    var frame = performOperationSync;
    if (config.mutateApproach === MUTATION_APPROACH_ASYNC) {
      frame = WINDOW.requestAnimationFrame || performOperationSync;
    }
    frame(function() {
      var mutator = getMutator();
      var mark = perf.begin("mutate");
      mutations.map(mutator);
      mark();
      callbackFunction();
    });
  }
}
var disabled = false;
function disableObservation() {
  disabled = true;
}
function enableObservation() {
  disabled = false;
}
var mo = null;
function observe(options) {
  if (!MUTATION_OBSERVER) {
    return;
  }
  if (!config.observeMutations) {
    return;
  }
  var _options$treeCallback = options.treeCallback, treeCallback = _options$treeCallback === void 0 ? noop$2 : _options$treeCallback, _options$nodeCallback = options.nodeCallback, nodeCallback = _options$nodeCallback === void 0 ? noop$2 : _options$nodeCallback, _options$pseudoElemen = options.pseudoElementsCallback, pseudoElementsCallback = _options$pseudoElemen === void 0 ? noop$2 : _options$pseudoElemen, _options$observeMutat = options.observeMutationsRoot, observeMutationsRoot = _options$observeMutat === void 0 ? DOCUMENT2 : _options$observeMutat;
  mo = new MUTATION_OBSERVER(function(objects) {
    if (disabled) return;
    var defaultPrefix = getDefaultUsablePrefix();
    toArray(objects).forEach(function(mutationRecord) {
      if (mutationRecord.type === "childList" && mutationRecord.addedNodes.length > 0 && !isWatched(mutationRecord.addedNodes[0])) {
        if (config.searchPseudoElements) {
          pseudoElementsCallback(mutationRecord.target);
        }
        treeCallback(mutationRecord.target);
      }
      if (mutationRecord.type === "attributes" && mutationRecord.target.parentNode && config.searchPseudoElements) {
        pseudoElementsCallback(mutationRecord.target.parentNode);
      }
      if (mutationRecord.type === "attributes" && isWatched(mutationRecord.target) && ~ATTRIBUTES_WATCHED_FOR_MUTATION.indexOf(mutationRecord.attributeName)) {
        if (mutationRecord.attributeName === "class" && hasPrefixAndIcon(mutationRecord.target)) {
          var _getCanonicalIcon = getCanonicalIcon(classArray(mutationRecord.target)), prefix = _getCanonicalIcon.prefix, iconName = _getCanonicalIcon.iconName;
          mutationRecord.target.setAttribute(DATA_PREFIX, prefix || defaultPrefix);
          if (iconName) mutationRecord.target.setAttribute(DATA_ICON, iconName);
        } else if (hasBeenReplaced(mutationRecord.target)) {
          nodeCallback(mutationRecord.target);
        }
      }
    });
  });
  if (!IS_DOM) return;
  mo.observe(observeMutationsRoot, {
    childList: true,
    attributes: true,
    characterData: true,
    subtree: true
  });
}
function disconnect() {
  if (!mo) return;
  mo.disconnect();
}
function styleParser(node) {
  var style = node.getAttribute("style");
  var val = [];
  if (style) {
    val = style.split(";").reduce(function(acc, style2) {
      var styles2 = style2.split(":");
      var prop = styles2[0];
      var value = styles2.slice(1);
      if (prop && value.length > 0) {
        acc[prop] = value.join(":").trim();
      }
      return acc;
    }, {});
  }
  return val;
}
function classParser(node) {
  var existingPrefix = node.getAttribute("data-prefix");
  var existingIconName = node.getAttribute("data-icon");
  var innerText = node.innerText !== void 0 ? node.innerText.trim() : "";
  var val = getCanonicalIcon(classArray(node));
  if (!val.prefix) {
    val.prefix = getDefaultUsablePrefix();
  }
  if (existingPrefix && existingIconName) {
    val.prefix = existingPrefix;
    val.iconName = existingIconName;
  }
  if (val.iconName && val.prefix) {
    return val;
  }
  if (val.prefix && innerText.length > 0) {
    val.iconName = byLigature(val.prefix, node.innerText) || byUnicode(val.prefix, toHex(node.innerText));
  }
  if (!val.iconName && config.autoFetchSvg && node.firstChild && node.firstChild.nodeType === Node.TEXT_NODE) {
    val.iconName = node.firstChild.data;
  }
  return val;
}
function attributesParser(node) {
  var extraAttributes = toArray(node.attributes).reduce(function(acc, attr) {
    if (acc.name !== "class" && acc.name !== "style") {
      acc[attr.name] = attr.value;
    }
    return acc;
  }, {});
  var title = node.getAttribute("title");
  var titleId = node.getAttribute("data-fa-title-id");
  if (config.autoA11y) {
    if (title) {
      extraAttributes["aria-labelledby"] = "".concat(config.replacementClass, "-title-").concat(titleId || nextUniqueId());
    } else {
      extraAttributes["aria-hidden"] = "true";
      extraAttributes["focusable"] = "false";
    }
  }
  return extraAttributes;
}
function blankMeta() {
  return {
    iconName: null,
    title: null,
    titleId: null,
    prefix: null,
    transform: meaninglessTransform,
    symbol: false,
    mask: {
      iconName: null,
      prefix: null,
      rest: []
    },
    maskId: null,
    extra: {
      classes: [],
      styles: {},
      attributes: {}
    }
  };
}
function parseMeta(node) {
  var parser = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
    styleParser: true
  };
  var _classParser = classParser(node), iconName = _classParser.iconName, prefix = _classParser.prefix, extraClasses = _classParser.rest;
  var extraAttributes = attributesParser(node);
  var pluginMeta = chainHooks("parseNodeAttributes", {}, node);
  var extraStyles = parser.styleParser ? styleParser(node) : [];
  return _objectSpread2({
    iconName,
    title: node.getAttribute("title"),
    titleId: node.getAttribute("data-fa-title-id"),
    prefix,
    transform: meaninglessTransform,
    mask: {
      iconName: null,
      prefix: null,
      rest: []
    },
    maskId: null,
    symbol: false,
    extra: {
      classes: extraClasses,
      styles: extraStyles,
      attributes: extraAttributes
    }
  }, pluginMeta);
}
var styles$2 = namespace.styles;
function generateMutation(node) {
  var nodeMeta = config.autoReplaceSvg === "nest" ? parseMeta(node, {
    styleParser: false
  }) : parseMeta(node);
  if (~nodeMeta.extra.classes.indexOf(LAYERS_TEXT_CLASSNAME)) {
    return callProvided("generateLayersText", node, nodeMeta);
  } else {
    return callProvided("generateSvgReplacementMutation", node, nodeMeta);
  }
}
var knownPrefixes = /* @__PURE__ */ new Set();
FAMILIES.map(function(family) {
  knownPrefixes.add("fa-".concat(family));
});
Object.keys(PREFIX_TO_STYLE[FAMILY_CLASSIC]).map(knownPrefixes.add.bind(knownPrefixes));
Object.keys(PREFIX_TO_STYLE[FAMILY_SHARP]).map(knownPrefixes.add.bind(knownPrefixes));
knownPrefixes = _toConsumableArray(knownPrefixes);
function onTree(root) {
  var callback = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null;
  if (!IS_DOM) return Promise.resolve();
  var htmlClassList = DOCUMENT2.documentElement.classList;
  var hclAdd = function hclAdd2(suffix) {
    return htmlClassList.add("".concat(HTML_CLASS_I2SVG_BASE_CLASS, "-").concat(suffix));
  };
  var hclRemove = function hclRemove2(suffix) {
    return htmlClassList.remove("".concat(HTML_CLASS_I2SVG_BASE_CLASS, "-").concat(suffix));
  };
  var prefixes2 = config.autoFetchSvg ? knownPrefixes : FAMILIES.map(function(f) {
    return "fa-".concat(f);
  }).concat(Object.keys(styles$2));
  if (!prefixes2.includes("fa")) {
    prefixes2.push("fa");
  }
  var prefixesDomQuery = [".".concat(LAYERS_TEXT_CLASSNAME, ":not([").concat(DATA_FA_I2SVG, "])")].concat(prefixes2.map(function(p2) {
    return ".".concat(p2, ":not([").concat(DATA_FA_I2SVG, "])");
  })).join(", ");
  if (prefixesDomQuery.length === 0) {
    return Promise.resolve();
  }
  var candidates = [];
  try {
    candidates = toArray(root.querySelectorAll(prefixesDomQuery));
  } catch (e) {
  }
  if (candidates.length > 0) {
    hclAdd("pending");
    hclRemove("complete");
  } else {
    return Promise.resolve();
  }
  var mark = perf.begin("onTree");
  var mutations = candidates.reduce(function(acc, node) {
    try {
      var mutation = generateMutation(node);
      if (mutation) {
        acc.push(mutation);
      }
    } catch (e) {
      if (!PRODUCTION) {
        if (e.name === "MissingIcon") {
          console.error(e);
        }
      }
    }
    return acc;
  }, []);
  return new Promise(function(resolve, reject) {
    Promise.all(mutations).then(function(resolvedMutations) {
      perform(resolvedMutations, function() {
        hclAdd("active");
        hclAdd("complete");
        hclRemove("pending");
        if (typeof callback === "function") callback();
        mark();
        resolve();
      });
    }).catch(function(e) {
      mark();
      reject(e);
    });
  });
}
function onNode(node) {
  var callback = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null;
  generateMutation(node).then(function(mutation) {
    if (mutation) {
      perform([mutation], callback);
    }
  });
}
function resolveIcons(next) {
  return function(maybeIconDefinition) {
    var params = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    var iconDefinition = (maybeIconDefinition || {}).icon ? maybeIconDefinition : findIconDefinition(maybeIconDefinition || {});
    var mask = params.mask;
    if (mask) {
      mask = (mask || {}).icon ? mask : findIconDefinition(mask || {});
    }
    return next(iconDefinition, _objectSpread2(_objectSpread2({}, params), {}, {
      mask
    }));
  };
}
var render = function render2(iconDefinition) {
  var params = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  var _params$transform = params.transform, transform = _params$transform === void 0 ? meaninglessTransform : _params$transform, _params$symbol = params.symbol, symbol = _params$symbol === void 0 ? false : _params$symbol, _params$mask = params.mask, mask = _params$mask === void 0 ? null : _params$mask, _params$maskId = params.maskId, maskId = _params$maskId === void 0 ? null : _params$maskId, _params$title = params.title, title = _params$title === void 0 ? null : _params$title, _params$titleId = params.titleId, titleId = _params$titleId === void 0 ? null : _params$titleId, _params$classes = params.classes, classes = _params$classes === void 0 ? [] : _params$classes, _params$attributes = params.attributes, attributes = _params$attributes === void 0 ? {} : _params$attributes, _params$styles = params.styles, styles2 = _params$styles === void 0 ? {} : _params$styles;
  if (!iconDefinition) return;
  var prefix = iconDefinition.prefix, iconName = iconDefinition.iconName, icon3 = iconDefinition.icon;
  return domVariants(_objectSpread2({
    type: "icon"
  }, iconDefinition), function() {
    callHooks("beforeDOMElementCreation", {
      iconDefinition,
      params
    });
    if (config.autoA11y) {
      if (title) {
        attributes["aria-labelledby"] = "".concat(config.replacementClass, "-title-").concat(titleId || nextUniqueId());
      } else {
        attributes["aria-hidden"] = "true";
        attributes["focusable"] = "false";
      }
    }
    return makeInlineSvgAbstract({
      icons: {
        main: asFoundIcon(icon3),
        mask: mask ? asFoundIcon(mask.icon) : {
          found: false,
          width: null,
          height: null,
          icon: {}
        }
      },
      prefix,
      iconName,
      transform: _objectSpread2(_objectSpread2({}, meaninglessTransform), transform),
      symbol,
      title,
      maskId,
      titleId,
      extra: {
        attributes,
        styles: styles2,
        classes
      }
    });
  });
};
var ReplaceElements = {
  mixout: function mixout2() {
    return {
      icon: resolveIcons(render)
    };
  },
  hooks: function hooks2() {
    return {
      mutationObserverCallbacks: function mutationObserverCallbacks(accumulator) {
        accumulator.treeCallback = onTree;
        accumulator.nodeCallback = onNode;
        return accumulator;
      }
    };
  },
  provides: function provides(providers$$1) {
    providers$$1.i2svg = function(params) {
      var _params$node = params.node, node = _params$node === void 0 ? DOCUMENT2 : _params$node, _params$callback = params.callback, callback = _params$callback === void 0 ? function() {
      } : _params$callback;
      return onTree(node, callback);
    };
    providers$$1.generateSvgReplacementMutation = function(node, nodeMeta) {
      var iconName = nodeMeta.iconName, title = nodeMeta.title, titleId = nodeMeta.titleId, prefix = nodeMeta.prefix, transform = nodeMeta.transform, symbol = nodeMeta.symbol, mask = nodeMeta.mask, maskId = nodeMeta.maskId, extra = nodeMeta.extra;
      return new Promise(function(resolve, reject) {
        Promise.all([findIcon(iconName, prefix), mask.iconName ? findIcon(mask.iconName, mask.prefix) : Promise.resolve({
          found: false,
          width: 512,
          height: 512,
          icon: {}
        })]).then(function(_ref2) {
          var _ref22 = _slicedToArray(_ref2, 2), main = _ref22[0], mask2 = _ref22[1];
          resolve([node, makeInlineSvgAbstract({
            icons: {
              main,
              mask: mask2
            },
            prefix,
            iconName,
            transform,
            symbol,
            maskId,
            title,
            titleId,
            extra,
            watchable: true
          })]);
        }).catch(reject);
      });
    };
    providers$$1.generateAbstractIcon = function(_ref3) {
      var children = _ref3.children, attributes = _ref3.attributes, main = _ref3.main, transform = _ref3.transform, styles2 = _ref3.styles;
      var styleString = joinStyles(styles2);
      if (styleString.length > 0) {
        attributes["style"] = styleString;
      }
      var nextChild;
      if (transformIsMeaningful(transform)) {
        nextChild = callProvided("generateAbstractTransformGrouping", {
          main,
          transform,
          containerWidth: main.width,
          iconWidth: main.width
        });
      }
      children.push(nextChild || main.icon);
      return {
        children,
        attributes
      };
    };
  }
};
var Layers = {
  mixout: function mixout3() {
    return {
      layer: function layer2(assembler) {
        var params = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        var _params$classes = params.classes, classes = _params$classes === void 0 ? [] : _params$classes;
        return domVariants({
          type: "layer"
        }, function() {
          callHooks("beforeDOMElementCreation", {
            assembler,
            params
          });
          var children = [];
          assembler(function(args) {
            Array.isArray(args) ? args.map(function(a) {
              children = children.concat(a.abstract);
            }) : children = children.concat(args.abstract);
          });
          return [{
            tag: "span",
            attributes: {
              class: ["".concat(config.cssPrefix, "-layers")].concat(_toConsumableArray(classes)).join(" ")
            },
            children
          }];
        });
      }
    };
  }
};
var LayersCounter = {
  mixout: function mixout4() {
    return {
      counter: function counter2(content) {
        var params = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        var _params$title = params.title, title = _params$title === void 0 ? null : _params$title, _params$classes = params.classes, classes = _params$classes === void 0 ? [] : _params$classes, _params$attributes = params.attributes, attributes = _params$attributes === void 0 ? {} : _params$attributes, _params$styles = params.styles, styles2 = _params$styles === void 0 ? {} : _params$styles;
        return domVariants({
          type: "counter",
          content
        }, function() {
          callHooks("beforeDOMElementCreation", {
            content,
            params
          });
          return makeLayersCounterAbstract({
            content: content.toString(),
            title,
            extra: {
              attributes,
              styles: styles2,
              classes: ["".concat(config.cssPrefix, "-layers-counter")].concat(_toConsumableArray(classes))
            }
          });
        });
      }
    };
  }
};
var LayersText = {
  mixout: function mixout5() {
    return {
      text: function text2(content) {
        var params = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        var _params$transform = params.transform, transform = _params$transform === void 0 ? meaninglessTransform : _params$transform, _params$title = params.title, title = _params$title === void 0 ? null : _params$title, _params$classes = params.classes, classes = _params$classes === void 0 ? [] : _params$classes, _params$attributes = params.attributes, attributes = _params$attributes === void 0 ? {} : _params$attributes, _params$styles = params.styles, styles2 = _params$styles === void 0 ? {} : _params$styles;
        return domVariants({
          type: "text",
          content
        }, function() {
          callHooks("beforeDOMElementCreation", {
            content,
            params
          });
          return makeLayersTextAbstract({
            content,
            transform: _objectSpread2(_objectSpread2({}, meaninglessTransform), transform),
            title,
            extra: {
              attributes,
              styles: styles2,
              classes: ["".concat(config.cssPrefix, "-layers-text")].concat(_toConsumableArray(classes))
            }
          });
        });
      }
    };
  },
  provides: function provides2(providers$$1) {
    providers$$1.generateLayersText = function(node, nodeMeta) {
      var title = nodeMeta.title, transform = nodeMeta.transform, extra = nodeMeta.extra;
      var width = null;
      var height = null;
      if (IS_IE) {
        var computedFontSize = parseInt(getComputedStyle(node).fontSize, 10);
        var boundingClientRect = node.getBoundingClientRect();
        width = boundingClientRect.width / computedFontSize;
        height = boundingClientRect.height / computedFontSize;
      }
      if (config.autoA11y && !title) {
        extra.attributes["aria-hidden"] = "true";
      }
      return Promise.resolve([node, makeLayersTextAbstract({
        content: node.innerHTML,
        width,
        height,
        transform,
        title,
        extra,
        watchable: true
      })]);
    };
  }
};
var CLEAN_CONTENT_PATTERN = new RegExp('"', "ug");
var SECONDARY_UNICODE_RANGE = [1105920, 1112319];
function hexValueFromContent(content) {
  var cleaned = content.replace(CLEAN_CONTENT_PATTERN, "");
  var codePoint = codePointAt(cleaned, 0);
  var isPrependTen = codePoint >= SECONDARY_UNICODE_RANGE[0] && codePoint <= SECONDARY_UNICODE_RANGE[1];
  var isDoubled = cleaned.length === 2 ? cleaned[0] === cleaned[1] : false;
  return {
    value: isDoubled ? toHex(cleaned[0]) : toHex(cleaned),
    isSecondary: isPrependTen || isDoubled
  };
}
function replaceForPosition(node, position) {
  var pendingAttribute = "".concat(DATA_FA_PSEUDO_ELEMENT_PENDING).concat(position.replace(":", "-"));
  return new Promise(function(resolve, reject) {
    if (node.getAttribute(pendingAttribute) !== null) {
      return resolve();
    }
    var children = toArray(node.children);
    var alreadyProcessedPseudoElement = children.filter(function(c) {
      return c.getAttribute(DATA_FA_PSEUDO_ELEMENT) === position;
    })[0];
    var styles2 = WINDOW.getComputedStyle(node, position);
    var fontFamily = styles2.getPropertyValue("font-family").match(FONT_FAMILY_PATTERN);
    var fontWeight = styles2.getPropertyValue("font-weight");
    var content = styles2.getPropertyValue("content");
    if (alreadyProcessedPseudoElement && !fontFamily) {
      node.removeChild(alreadyProcessedPseudoElement);
      return resolve();
    } else if (fontFamily && content !== "none" && content !== "") {
      var _content = styles2.getPropertyValue("content");
      var family = ~["Sharp"].indexOf(fontFamily[2]) ? FAMILY_SHARP : FAMILY_CLASSIC;
      var prefix = ~["Solid", "Regular", "Light", "Thin", "Duotone", "Brands", "Kit"].indexOf(fontFamily[2]) ? STYLE_TO_PREFIX[family][fontFamily[2].toLowerCase()] : FONT_WEIGHT_TO_PREFIX[family][fontWeight];
      var _hexValueFromContent = hexValueFromContent(_content), hexValue = _hexValueFromContent.value, isSecondary = _hexValueFromContent.isSecondary;
      var isV4 = fontFamily[0].startsWith("FontAwesome");
      var iconName = byUnicode(prefix, hexValue);
      var iconIdentifier = iconName;
      if (isV4) {
        var iconName4 = byOldUnicode(hexValue);
        if (iconName4.iconName && iconName4.prefix) {
          iconName = iconName4.iconName;
          prefix = iconName4.prefix;
        }
      }
      if (iconName && !isSecondary && (!alreadyProcessedPseudoElement || alreadyProcessedPseudoElement.getAttribute(DATA_PREFIX) !== prefix || alreadyProcessedPseudoElement.getAttribute(DATA_ICON) !== iconIdentifier)) {
        node.setAttribute(pendingAttribute, iconIdentifier);
        if (alreadyProcessedPseudoElement) {
          node.removeChild(alreadyProcessedPseudoElement);
        }
        var meta = blankMeta();
        var extra = meta.extra;
        extra.attributes[DATA_FA_PSEUDO_ELEMENT] = position;
        findIcon(iconName, prefix).then(function(main) {
          var _abstract = makeInlineSvgAbstract(_objectSpread2(_objectSpread2({}, meta), {}, {
            icons: {
              main,
              mask: emptyCanonicalIcon()
            },
            prefix,
            iconName: iconIdentifier,
            extra,
            watchable: true
          }));
          var element = DOCUMENT2.createElementNS("http://www.w3.org/2000/svg", "svg");
          if (position === "::before") {
            node.insertBefore(element, node.firstChild);
          } else {
            node.appendChild(element);
          }
          element.outerHTML = _abstract.map(function(a) {
            return toHtml(a);
          }).join("\n");
          node.removeAttribute(pendingAttribute);
          resolve();
        }).catch(reject);
      } else {
        resolve();
      }
    } else {
      resolve();
    }
  });
}
function replace2(node) {
  return Promise.all([replaceForPosition(node, "::before"), replaceForPosition(node, "::after")]);
}
function processable(node) {
  return node.parentNode !== document.head && !~TAGNAMES_TO_SKIP_FOR_PSEUDOELEMENTS.indexOf(node.tagName.toUpperCase()) && !node.getAttribute(DATA_FA_PSEUDO_ELEMENT) && (!node.parentNode || node.parentNode.tagName !== "svg");
}
function searchPseudoElements(root) {
  if (!IS_DOM) return;
  return new Promise(function(resolve, reject) {
    var operations = toArray(root.querySelectorAll("*")).filter(processable).map(replace2);
    var end3 = perf.begin("searchPseudoElements");
    disableObservation();
    Promise.all(operations).then(function() {
      end3();
      enableObservation();
      resolve();
    }).catch(function() {
      end3();
      enableObservation();
      reject();
    });
  });
}
var PseudoElements = {
  hooks: function hooks3() {
    return {
      mutationObserverCallbacks: function mutationObserverCallbacks(accumulator) {
        accumulator.pseudoElementsCallback = searchPseudoElements;
        return accumulator;
      }
    };
  },
  provides: function provides3(providers$$1) {
    providers$$1.pseudoElements2svg = function(params) {
      var _params$node = params.node, node = _params$node === void 0 ? DOCUMENT2 : _params$node;
      if (config.searchPseudoElements) {
        searchPseudoElements(node);
      }
    };
  }
};
var _unwatched = false;
var MutationObserver$1 = {
  mixout: function mixout6() {
    return {
      dom: {
        unwatch: function unwatch() {
          disableObservation();
          _unwatched = true;
        }
      }
    };
  },
  hooks: function hooks4() {
    return {
      bootstrap: function bootstrap() {
        observe(chainHooks("mutationObserverCallbacks", {}));
      },
      noAuto: function noAuto3() {
        disconnect();
      },
      watch: function watch2(params) {
        var observeMutationsRoot = params.observeMutationsRoot;
        if (_unwatched) {
          enableObservation();
        } else {
          observe(chainHooks("mutationObserverCallbacks", {
            observeMutationsRoot
          }));
        }
      }
    };
  }
};
var parseTransformString = function parseTransformString2(transformString) {
  var transform = {
    size: 16,
    x: 0,
    y: 0,
    flipX: false,
    flipY: false,
    rotate: 0
  };
  return transformString.toLowerCase().split(" ").reduce(function(acc, n) {
    var parts = n.toLowerCase().split("-");
    var first = parts[0];
    var rest = parts.slice(1).join("-");
    if (first && rest === "h") {
      acc.flipX = true;
      return acc;
    }
    if (first && rest === "v") {
      acc.flipY = true;
      return acc;
    }
    rest = parseFloat(rest);
    if (isNaN(rest)) {
      return acc;
    }
    switch (first) {
      case "grow":
        acc.size = acc.size + rest;
        break;
      case "shrink":
        acc.size = acc.size - rest;
        break;
      case "left":
        acc.x = acc.x - rest;
        break;
      case "right":
        acc.x = acc.x + rest;
        break;
      case "up":
        acc.y = acc.y - rest;
        break;
      case "down":
        acc.y = acc.y + rest;
        break;
      case "rotate":
        acc.rotate = acc.rotate + rest;
        break;
    }
    return acc;
  }, transform);
};
var PowerTransforms = {
  mixout: function mixout7() {
    return {
      parse: {
        transform: function transform(transformString) {
          return parseTransformString(transformString);
        }
      }
    };
  },
  hooks: function hooks5() {
    return {
      parseNodeAttributes: function parseNodeAttributes(accumulator, node) {
        var transformString = node.getAttribute("data-fa-transform");
        if (transformString) {
          accumulator.transform = parseTransformString(transformString);
        }
        return accumulator;
      }
    };
  },
  provides: function provides4(providers2) {
    providers2.generateAbstractTransformGrouping = function(_ref2) {
      var main = _ref2.main, transform = _ref2.transform, containerWidth = _ref2.containerWidth, iconWidth = _ref2.iconWidth;
      var outer = {
        transform: "translate(".concat(containerWidth / 2, " 256)")
      };
      var innerTranslate = "translate(".concat(transform.x * 32, ", ").concat(transform.y * 32, ") ");
      var innerScale = "scale(".concat(transform.size / 16 * (transform.flipX ? -1 : 1), ", ").concat(transform.size / 16 * (transform.flipY ? -1 : 1), ") ");
      var innerRotate = "rotate(".concat(transform.rotate, " 0 0)");
      var inner = {
        transform: "".concat(innerTranslate, " ").concat(innerScale, " ").concat(innerRotate)
      };
      var path = {
        transform: "translate(".concat(iconWidth / 2 * -1, " -256)")
      };
      var operations = {
        outer,
        inner,
        path
      };
      return {
        tag: "g",
        attributes: _objectSpread2({}, operations.outer),
        children: [{
          tag: "g",
          attributes: _objectSpread2({}, operations.inner),
          children: [{
            tag: main.icon.tag,
            children: main.icon.children,
            attributes: _objectSpread2(_objectSpread2({}, main.icon.attributes), operations.path)
          }]
        }]
      };
    };
  }
};
var ALL_SPACE = {
  x: 0,
  y: 0,
  width: "100%",
  height: "100%"
};
function fillBlack(_abstract) {
  var force = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
  if (_abstract.attributes && (_abstract.attributes.fill || force)) {
    _abstract.attributes.fill = "black";
  }
  return _abstract;
}
function deGroup(_abstract2) {
  if (_abstract2.tag === "g") {
    return _abstract2.children;
  } else {
    return [_abstract2];
  }
}
var Masks = {
  hooks: function hooks6() {
    return {
      parseNodeAttributes: function parseNodeAttributes(accumulator, node) {
        var maskData = node.getAttribute("data-fa-mask");
        var mask = !maskData ? emptyCanonicalIcon() : getCanonicalIcon(maskData.split(" ").map(function(i) {
          return i.trim();
        }));
        if (!mask.prefix) {
          mask.prefix = getDefaultUsablePrefix();
        }
        accumulator.mask = mask;
        accumulator.maskId = node.getAttribute("data-fa-mask-id");
        return accumulator;
      }
    };
  },
  provides: function provides5(providers2) {
    providers2.generateAbstractMask = function(_ref2) {
      var children = _ref2.children, attributes = _ref2.attributes, main = _ref2.main, mask = _ref2.mask, explicitMaskId = _ref2.maskId, transform = _ref2.transform;
      var mainWidth = main.width, mainPath = main.icon;
      var maskWidth = mask.width, maskPath = mask.icon;
      var trans = transformForSvg({
        transform,
        containerWidth: maskWidth,
        iconWidth: mainWidth
      });
      var maskRect = {
        tag: "rect",
        attributes: _objectSpread2(_objectSpread2({}, ALL_SPACE), {}, {
          fill: "white"
        })
      };
      var maskInnerGroupChildrenMixin = mainPath.children ? {
        children: mainPath.children.map(fillBlack)
      } : {};
      var maskInnerGroup = {
        tag: "g",
        attributes: _objectSpread2({}, trans.inner),
        children: [fillBlack(_objectSpread2({
          tag: mainPath.tag,
          attributes: _objectSpread2(_objectSpread2({}, mainPath.attributes), trans.path)
        }, maskInnerGroupChildrenMixin))]
      };
      var maskOuterGroup = {
        tag: "g",
        attributes: _objectSpread2({}, trans.outer),
        children: [maskInnerGroup]
      };
      var maskId = "mask-".concat(explicitMaskId || nextUniqueId());
      var clipId = "clip-".concat(explicitMaskId || nextUniqueId());
      var maskTag = {
        tag: "mask",
        attributes: _objectSpread2(_objectSpread2({}, ALL_SPACE), {}, {
          id: maskId,
          maskUnits: "userSpaceOnUse",
          maskContentUnits: "userSpaceOnUse"
        }),
        children: [maskRect, maskOuterGroup]
      };
      var defs = {
        tag: "defs",
        children: [{
          tag: "clipPath",
          attributes: {
            id: clipId
          },
          children: deGroup(maskPath)
        }, maskTag]
      };
      children.push(defs, {
        tag: "rect",
        attributes: _objectSpread2({
          fill: "currentColor",
          "clip-path": "url(#".concat(clipId, ")"),
          mask: "url(#".concat(maskId, ")")
        }, ALL_SPACE)
      });
      return {
        children,
        attributes
      };
    };
  }
};
var MissingIconIndicator = {
  provides: function provides6(providers2) {
    var reduceMotion = false;
    if (WINDOW.matchMedia) {
      reduceMotion = WINDOW.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    providers2.missingIconAbstract = function() {
      var gChildren = [];
      var FILL = {
        fill: "currentColor"
      };
      var ANIMATION_BASE = {
        attributeType: "XML",
        repeatCount: "indefinite",
        dur: "2s"
      };
      gChildren.push({
        tag: "path",
        attributes: _objectSpread2(_objectSpread2({}, FILL), {}, {
          d: "M156.5,447.7l-12.6,29.5c-18.7-9.5-35.9-21.2-51.5-34.9l22.7-22.7C127.6,430.5,141.5,440,156.5,447.7z M40.6,272H8.5 c1.4,21.2,5.4,41.7,11.7,61.1L50,321.2C45.1,305.5,41.8,289,40.6,272z M40.6,240c1.4-18.8,5.2-37,11.1-54.1l-29.5-12.6 C14.7,194.3,10,216.7,8.5,240H40.6z M64.3,156.5c7.8-14.9,17.2-28.8,28.1-41.5L69.7,92.3c-13.7,15.6-25.5,32.8-34.9,51.5 L64.3,156.5z M397,419.6c-13.9,12-29.4,22.3-46.1,30.4l11.9,29.8c20.7-9.9,39.8-22.6,56.9-37.6L397,419.6z M115,92.4 c13.9-12,29.4-22.3,46.1-30.4l-11.9-29.8c-20.7,9.9-39.8,22.6-56.8,37.6L115,92.4z M447.7,355.5c-7.8,14.9-17.2,28.8-28.1,41.5 l22.7,22.7c13.7-15.6,25.5-32.9,34.9-51.5L447.7,355.5z M471.4,272c-1.4,18.8-5.2,37-11.1,54.1l29.5,12.6 c7.5-21.1,12.2-43.5,13.6-66.8H471.4z M321.2,462c-15.7,5-32.2,8.2-49.2,9.4v32.1c21.2-1.4,41.7-5.4,61.1-11.7L321.2,462z M240,471.4c-18.8-1.4-37-5.2-54.1-11.1l-12.6,29.5c21.1,7.5,43.5,12.2,66.8,13.6V471.4z M462,190.8c5,15.7,8.2,32.2,9.4,49.2h32.1 c-1.4-21.2-5.4-41.7-11.7-61.1L462,190.8z M92.4,397c-12-13.9-22.3-29.4-30.4-46.1l-29.8,11.9c9.9,20.7,22.6,39.8,37.6,56.9 L92.4,397z M272,40.6c18.8,1.4,36.9,5.2,54.1,11.1l12.6-29.5C317.7,14.7,295.3,10,272,8.5V40.6z M190.8,50 c15.7-5,32.2-8.2,49.2-9.4V8.5c-21.2,1.4-41.7,5.4-61.1,11.7L190.8,50z M442.3,92.3L419.6,115c12,13.9,22.3,29.4,30.5,46.1 l29.8-11.9C470,128.5,457.3,109.4,442.3,92.3z M397,92.4l22.7-22.7c-15.6-13.7-32.8-25.5-51.5-34.9l-12.6,29.5 C370.4,72.1,384.4,81.5,397,92.4z"
        })
      });
      var OPACITY_ANIMATE = _objectSpread2(_objectSpread2({}, ANIMATION_BASE), {}, {
        attributeName: "opacity"
      });
      var dot = {
        tag: "circle",
        attributes: _objectSpread2(_objectSpread2({}, FILL), {}, {
          cx: "256",
          cy: "364",
          r: "28"
        }),
        children: []
      };
      if (!reduceMotion) {
        dot.children.push({
          tag: "animate",
          attributes: _objectSpread2(_objectSpread2({}, ANIMATION_BASE), {}, {
            attributeName: "r",
            values: "28;14;28;28;14;28;"
          })
        }, {
          tag: "animate",
          attributes: _objectSpread2(_objectSpread2({}, OPACITY_ANIMATE), {}, {
            values: "1;0;1;1;0;1;"
          })
        });
      }
      gChildren.push(dot);
      gChildren.push({
        tag: "path",
        attributes: _objectSpread2(_objectSpread2({}, FILL), {}, {
          opacity: "1",
          d: "M263.7,312h-16c-6.6,0-12-5.4-12-12c0-71,77.4-63.9,77.4-107.8c0-20-17.8-40.2-57.4-40.2c-29.1,0-44.3,9.6-59.2,28.7 c-3.9,5-11.1,6-16.2,2.4l-13.1-9.2c-5.6-3.9-6.9-11.8-2.6-17.2c21.2-27.2,46.4-44.7,91.2-44.7c52.3,0,97.4,29.8,97.4,80.2 c0,67.6-77.4,63.5-77.4,107.8C275.7,306.6,270.3,312,263.7,312z"
        }),
        children: reduceMotion ? [] : [{
          tag: "animate",
          attributes: _objectSpread2(_objectSpread2({}, OPACITY_ANIMATE), {}, {
            values: "1;0;0;0;0;1;"
          })
        }]
      });
      if (!reduceMotion) {
        gChildren.push({
          tag: "path",
          attributes: _objectSpread2(_objectSpread2({}, FILL), {}, {
            opacity: "0",
            d: "M232.5,134.5l7,168c0.3,6.4,5.6,11.5,12,11.5h9c6.4,0,11.7-5.1,12-11.5l7-168c0.3-6.8-5.2-12.5-12-12.5h-23 C237.7,122,232.2,127.7,232.5,134.5z"
          }),
          children: [{
            tag: "animate",
            attributes: _objectSpread2(_objectSpread2({}, OPACITY_ANIMATE), {}, {
              values: "0;0;1;1;0;0;"
            })
          }]
        });
      }
      return {
        tag: "g",
        attributes: {
          "class": "missing"
        },
        children: gChildren
      };
    };
  }
};
var SvgSymbols = {
  hooks: function hooks7() {
    return {
      parseNodeAttributes: function parseNodeAttributes(accumulator, node) {
        var symbolData = node.getAttribute("data-fa-symbol");
        var symbol = symbolData === null ? false : symbolData === "" ? true : symbolData;
        accumulator["symbol"] = symbol;
        return accumulator;
      }
    };
  }
};
var plugins = [InjectCSS, ReplaceElements, Layers, LayersCounter, LayersText, PseudoElements, MutationObserver$1, PowerTransforms, Masks, MissingIconIndicator, SvgSymbols];
registerPlugins(plugins, {
  mixoutsTo: api
});
var noAuto$1 = api.noAuto;
var config$1 = api.config;
var library$1 = api.library;
var dom$1 = api.dom;
var parse$1 = api.parse;
var findIconDefinition$1 = api.findIconDefinition;
var toHtml$1 = api.toHtml;
var icon2 = api.icon;
var layer = api.layer;
var text = api.text;
var counter = api.counter;

// node_modules/@fortawesome/angular-fontawesome/fesm2022/angular-fontawesome.mjs
var _c0 = ["*"];
var faWarnIfIconDefinitionMissing = (iconSpec) => {
  throw new Error(`Could not find icon with iconName=${iconSpec.iconName} and prefix=${iconSpec.prefix} in the icon library.`);
};
var faWarnIfIconSpecMissing = () => {
  throw new Error("Property `icon` is required for `fa-icon`/`fa-duotone-icon` components.");
};
var faClassList = (props) => {
  const classes = {
    [`fa-${props.animation}`]: props.animation != null && !props.animation.startsWith("spin"),
    "fa-spin": props.animation === "spin" || props.animation === "spin-reverse",
    "fa-spin-pulse": props.animation === "spin-pulse" || props.animation === "spin-pulse-reverse",
    "fa-spin-reverse": props.animation === "spin-reverse" || props.animation === "spin-pulse-reverse",
    // According to https://fontawesome.com/docs/web/style/animate#spin fa-pulse
    // class is deprecated, remove the below line when Font Awesome 5 support
    // is dropped.
    "fa-pulse": props.animation === "spin-pulse" || props.animation === "spin-pulse-reverse",
    "fa-fw": props.fixedWidth,
    "fa-border": props.border,
    "fa-inverse": props.inverse,
    "fa-layers-counter": props.counter,
    "fa-flip-horizontal": props.flip === "horizontal" || props.flip === "both",
    "fa-flip-vertical": props.flip === "vertical" || props.flip === "both",
    [`fa-${props.size}`]: props.size !== null,
    [`fa-rotate-${props.rotate}`]: props.rotate !== null,
    [`fa-pull-${props.pull}`]: props.pull !== null,
    [`fa-stack-${props.stackItemSize}`]: props.stackItemSize != null
  };
  return Object.keys(classes).map((key) => classes[key] ? key : null).filter((key) => key);
};
var cssInserted = /* @__PURE__ */ new WeakSet();
var autoCssId = "fa-auto-css";
function ensureCss2(document2, config2) {
  if (!config2.autoAddCss) {
    return;
  }
  if (cssInserted.has(document2)) {
    return;
  }
  if (document2.getElementById(autoCssId) != null) {
    config2.autoAddCss = false;
    cssInserted.add(document2);
    return;
  }
  const style = document2.createElement("style");
  style.setAttribute("type", "text/css");
  style.setAttribute("id", autoCssId);
  style.innerHTML = dom$1.css();
  const headChildren = document2.head.childNodes;
  let beforeChild = null;
  for (let i = headChildren.length - 1; i > -1; i--) {
    const child = headChildren[i];
    const tagName = child.nodeName.toUpperCase();
    if (["STYLE", "LINK"].indexOf(tagName) > -1) {
      beforeChild = child;
    }
  }
  document2.head.insertBefore(style, beforeChild);
  config2.autoAddCss = false;
  cssInserted.add(document2);
}
var isIconLookup = (i) => i.prefix !== void 0 && i.iconName !== void 0;
var faNormalizeIconSpec = (iconSpec, defaultPrefix) => {
  if (isIconLookup(iconSpec)) {
    return iconSpec;
  }
  if (Array.isArray(iconSpec) && iconSpec.length === 2) {
    return {
      prefix: iconSpec[0],
      iconName: iconSpec[1]
    };
  }
  return {
    prefix: defaultPrefix,
    iconName: iconSpec
  };
};
var _FaConfig = class _FaConfig {
  constructor() {
    this.defaultPrefix = "fas";
    this.fallbackIcon = null;
    this._autoAddCss = true;
  }
  /**
   * Automatically add Font Awesome styles to the document when icon is rendered.
   *
   * For the majority of the cases the automatically added CSS is sufficient,
   * please refer to the linked guide for more information on when to disable
   * this feature.
   *
   * @see {@link: https://github.com/FortAwesome/angular-fontawesome/blob/main/docs/guide/adding-css.md}
   * @default true
   */
  set autoAddCss(value) {
    config$1.autoAddCss = value;
    this._autoAddCss = value;
  }
  get autoAddCss() {
    return this._autoAddCss;
  }
};
_FaConfig.\u0275fac = function FaConfig_Factory(t) {
  return new (t || _FaConfig)();
};
_FaConfig.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
  token: _FaConfig,
  factory: _FaConfig.\u0275fac,
  providedIn: "root"
});
var FaConfig = _FaConfig;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FaConfig, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
var _FaIconLibrary = class _FaIconLibrary {
  constructor() {
    this.definitions = {};
  }
  addIcons(...icons) {
    for (const icon3 of icons) {
      if (!(icon3.prefix in this.definitions)) {
        this.definitions[icon3.prefix] = {};
      }
      this.definitions[icon3.prefix][icon3.iconName] = icon3;
      for (const alias of icon3.icon[2]) {
        if (typeof alias === "string") {
          this.definitions[icon3.prefix][alias] = icon3;
        }
      }
    }
  }
  addIconPacks(...packs) {
    for (const pack of packs) {
      const icons = Object.keys(pack).map((key) => pack[key]);
      this.addIcons(...icons);
    }
  }
  getIconDefinition(prefix, name) {
    if (prefix in this.definitions && name in this.definitions[prefix]) {
      return this.definitions[prefix][name];
    }
    return null;
  }
};
_FaIconLibrary.\u0275fac = function FaIconLibrary_Factory(t) {
  return new (t || _FaIconLibrary)();
};
_FaIconLibrary.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
  token: _FaIconLibrary,
  factory: _FaIconLibrary.\u0275fac,
  providedIn: "root"
});
var FaIconLibrary = _FaIconLibrary;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FaIconLibrary, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
var _FaStackItemSizeDirective = class _FaStackItemSizeDirective {
  constructor() {
    this.stackItemSize = "1x";
  }
  ngOnChanges(changes) {
    if ("size" in changes) {
      throw new Error('fa-icon is not allowed to customize size when used inside fa-stack. Set size on the enclosing fa-stack instead: <fa-stack size="4x">...</fa-stack>.');
    }
  }
};
_FaStackItemSizeDirective.\u0275fac = function FaStackItemSizeDirective_Factory(t) {
  return new (t || _FaStackItemSizeDirective)();
};
_FaStackItemSizeDirective.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
  type: _FaStackItemSizeDirective,
  selectors: [["fa-icon", "stackItemSize", ""], ["fa-duotone-icon", "stackItemSize", ""]],
  inputs: {
    stackItemSize: "stackItemSize",
    size: "size"
  },
  standalone: true,
  features: [\u0275\u0275NgOnChangesFeature]
});
var FaStackItemSizeDirective = _FaStackItemSizeDirective;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FaStackItemSizeDirective, [{
    type: Directive,
    args: [{
      // eslint-disable-next-line @angular-eslint/directive-selector
      selector: "fa-icon[stackItemSize],fa-duotone-icon[stackItemSize]",
      standalone: true
    }]
  }], null, {
    stackItemSize: [{
      type: Input
    }],
    size: [{
      type: Input
    }]
  });
})();
var _FaStackComponent = class _FaStackComponent {
  constructor(renderer, elementRef) {
    this.renderer = renderer;
    this.elementRef = elementRef;
  }
  ngOnInit() {
    this.renderer.addClass(this.elementRef.nativeElement, "fa-stack");
  }
  ngOnChanges(changes) {
    if ("size" in changes) {
      if (changes.size.currentValue != null) {
        this.renderer.addClass(this.elementRef.nativeElement, `fa-${changes.size.currentValue}`);
      }
      if (changes.size.previousValue != null) {
        this.renderer.removeClass(this.elementRef.nativeElement, `fa-${changes.size.previousValue}`);
      }
    }
  }
};
_FaStackComponent.\u0275fac = function FaStackComponent_Factory(t) {
  return new (t || _FaStackComponent)(\u0275\u0275directiveInject(Renderer2), \u0275\u0275directiveInject(ElementRef));
};
_FaStackComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
  type: _FaStackComponent,
  selectors: [["fa-stack"]],
  inputs: {
    size: "size"
  },
  standalone: true,
  features: [\u0275\u0275NgOnChangesFeature, \u0275\u0275StandaloneFeature],
  ngContentSelectors: _c0,
  decls: 1,
  vars: 0,
  template: function FaStackComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275projectionDef();
      \u0275\u0275projection(0);
    }
  },
  encapsulation: 2
});
var FaStackComponent = _FaStackComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FaStackComponent, [{
    type: Component,
    args: [{
      selector: "fa-stack",
      standalone: true,
      template: `<ng-content></ng-content>`
    }]
  }], () => [{
    type: Renderer2
  }, {
    type: ElementRef
  }], {
    size: [{
      type: Input
    }]
  });
})();
var _FaIconComponent = class _FaIconComponent {
  constructor(sanitizer, config2, iconLibrary, stackItem, stack) {
    this.sanitizer = sanitizer;
    this.config = config2;
    this.iconLibrary = iconLibrary;
    this.stackItem = stackItem;
    this.document = inject(DOCUMENT);
    if (stack != null && stackItem == null) {
      console.error('FontAwesome: fa-icon and fa-duotone-icon elements must specify stackItemSize attribute when wrapped into fa-stack. Example: <fa-icon stackItemSize="2x"></fa-icon>.');
    }
  }
  ngOnChanges(changes) {
    if (this.icon == null && this.config.fallbackIcon == null) {
      faWarnIfIconSpecMissing();
      return;
    }
    if (changes) {
      const iconDefinition = this.findIconDefinition(this.icon ?? this.config.fallbackIcon);
      if (iconDefinition != null) {
        const params = this.buildParams();
        ensureCss2(this.document, this.config);
        const renderedIcon = icon2(iconDefinition, params);
        this.renderedIconHTML = this.sanitizer.bypassSecurityTrustHtml(renderedIcon.html.join("\n"));
      }
    }
  }
  /**
   * Programmatically trigger rendering of the icon.
   *
   * This method is useful, when creating {@link FaIconComponent} dynamically or
   * changing its inputs programmatically as in these cases icon won't be
   * re-rendered automatically.
   */
  render() {
    this.ngOnChanges({});
  }
  findIconDefinition(i) {
    const lookup = faNormalizeIconSpec(i, this.config.defaultPrefix);
    if ("icon" in lookup) {
      return lookup;
    }
    const definition = this.iconLibrary.getIconDefinition(lookup.prefix, lookup.iconName);
    if (definition != null) {
      return definition;
    }
    faWarnIfIconDefinitionMissing(lookup);
    return null;
  }
  buildParams() {
    const classOpts = {
      flip: this.flip,
      animation: this.animation,
      border: this.border,
      inverse: this.inverse,
      size: this.size || null,
      pull: this.pull || null,
      rotate: this.rotate || null,
      fixedWidth: typeof this.fixedWidth === "boolean" ? this.fixedWidth : this.config.fixedWidth,
      stackItemSize: this.stackItem != null ? this.stackItem.stackItemSize : null
    };
    const parsedTransform = typeof this.transform === "string" ? parse$1.transform(this.transform) : this.transform;
    return {
      title: this.title,
      transform: parsedTransform,
      classes: faClassList(classOpts),
      mask: this.mask != null ? this.findIconDefinition(this.mask) : null,
      symbol: this.symbol,
      attributes: {
        role: this.a11yRole
      }
    };
  }
};
_FaIconComponent.\u0275fac = function FaIconComponent_Factory(t) {
  return new (t || _FaIconComponent)(\u0275\u0275directiveInject(DomSanitizer), \u0275\u0275directiveInject(FaConfig), \u0275\u0275directiveInject(FaIconLibrary), \u0275\u0275directiveInject(FaStackItemSizeDirective, 8), \u0275\u0275directiveInject(FaStackComponent, 8));
};
_FaIconComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
  type: _FaIconComponent,
  selectors: [["fa-icon"]],
  hostAttrs: [1, "ng-fa-icon"],
  hostVars: 2,
  hostBindings: function FaIconComponent_HostBindings(rf, ctx) {
    if (rf & 2) {
      \u0275\u0275hostProperty("innerHTML", ctx.renderedIconHTML, \u0275\u0275sanitizeHtml);
      \u0275\u0275attribute("title", ctx.title);
    }
  },
  inputs: {
    icon: "icon",
    title: "title",
    animation: "animation",
    mask: "mask",
    flip: "flip",
    size: "size",
    pull: "pull",
    border: "border",
    inverse: "inverse",
    symbol: "symbol",
    rotate: "rotate",
    fixedWidth: "fixedWidth",
    transform: "transform",
    a11yRole: "a11yRole"
  },
  standalone: true,
  features: [\u0275\u0275NgOnChangesFeature, \u0275\u0275StandaloneFeature],
  decls: 0,
  vars: 0,
  template: function FaIconComponent_Template(rf, ctx) {
  },
  encapsulation: 2
});
var FaIconComponent = _FaIconComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FaIconComponent, [{
    type: Component,
    args: [{
      selector: "fa-icon",
      standalone: true,
      template: ``,
      host: {
        class: "ng-fa-icon",
        "[attr.title]": "title"
      }
    }]
  }], () => [{
    type: DomSanitizer
  }, {
    type: FaConfig
  }, {
    type: FaIconLibrary
  }, {
    type: FaStackItemSizeDirective,
    decorators: [{
      type: Optional
    }]
  }, {
    type: FaStackComponent,
    decorators: [{
      type: Optional
    }]
  }], {
    icon: [{
      type: Input
    }],
    title: [{
      type: Input
    }],
    animation: [{
      type: Input
    }],
    mask: [{
      type: Input
    }],
    flip: [{
      type: Input
    }],
    size: [{
      type: Input
    }],
    pull: [{
      type: Input
    }],
    border: [{
      type: Input
    }],
    inverse: [{
      type: Input
    }],
    symbol: [{
      type: Input
    }],
    rotate: [{
      type: Input
    }],
    fixedWidth: [{
      type: Input
    }],
    transform: [{
      type: Input
    }],
    a11yRole: [{
      type: Input
    }],
    renderedIconHTML: [{
      type: HostBinding,
      args: ["innerHTML"]
    }]
  });
})();
var _FaDuotoneIconComponent = class _FaDuotoneIconComponent extends FaIconComponent {
  findIconDefinition(i) {
    const definition = super.findIconDefinition(i);
    if (definition != null && !Array.isArray(definition.icon[4])) {
      throw new Error(`The specified icon does not appear to be a Duotone icon. Check that you specified the correct style: <fa-duotone-icon [icon]="['fad', '${definition.iconName}']"></fa-duotone-icon> or use: <fa-icon icon="${definition.iconName}"></fa-icon> instead.`);
    }
    return definition;
  }
  buildParams() {
    const params = super.buildParams();
    if (this.swapOpacity === true || this.swapOpacity === "true") {
      if (Array.isArray(params.classes)) {
        params.classes.push("fa-swap-opacity");
      } else if (typeof params.classes === "string") {
        params.classes = [params.classes, "fa-swap-opacity"];
      } else {
        params.classes = ["fa-swap-opacity"];
      }
    }
    if (params.styles == null) {
      params.styles = {};
    }
    if (this.primaryOpacity != null) {
      params.styles["--fa-primary-opacity"] = this.primaryOpacity.toString();
    }
    if (this.secondaryOpacity != null) {
      params.styles["--fa-secondary-opacity"] = this.secondaryOpacity.toString();
    }
    if (this.primaryColor != null) {
      params.styles["--fa-primary-color"] = this.primaryColor;
    }
    if (this.secondaryColor != null) {
      params.styles["--fa-secondary-color"] = this.secondaryColor;
    }
    return params;
  }
};
_FaDuotoneIconComponent.\u0275fac = /* @__PURE__ */ (() => {
  let \u0275FaDuotoneIconComponent_BaseFactory;
  return function FaDuotoneIconComponent_Factory(t) {
    return (\u0275FaDuotoneIconComponent_BaseFactory || (\u0275FaDuotoneIconComponent_BaseFactory = \u0275\u0275getInheritedFactory(_FaDuotoneIconComponent)))(t || _FaDuotoneIconComponent);
  };
})();
_FaDuotoneIconComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
  type: _FaDuotoneIconComponent,
  selectors: [["fa-duotone-icon"]],
  inputs: {
    swapOpacity: "swapOpacity",
    primaryOpacity: "primaryOpacity",
    secondaryOpacity: "secondaryOpacity",
    primaryColor: "primaryColor",
    secondaryColor: "secondaryColor"
  },
  standalone: true,
  features: [\u0275\u0275InheritDefinitionFeature, \u0275\u0275StandaloneFeature],
  decls: 0,
  vars: 0,
  template: function FaDuotoneIconComponent_Template(rf, ctx) {
  },
  encapsulation: 2
});
var FaDuotoneIconComponent = _FaDuotoneIconComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FaDuotoneIconComponent, [{
    type: Component,
    args: [{
      selector: "fa-duotone-icon",
      standalone: true,
      template: ``
    }]
  }], null, {
    swapOpacity: [{
      type: Input
    }],
    primaryOpacity: [{
      type: Input
    }],
    secondaryOpacity: [{
      type: Input
    }],
    primaryColor: [{
      type: Input
    }],
    secondaryColor: [{
      type: Input
    }]
  });
})();
var faWarnIfParentNotExist = (parent, parentName, childName) => {
  if (!parent) {
    throw new Error(`${childName} should be used as child of ${parentName} only.`);
  }
};
var _FaLayersComponent = class _FaLayersComponent {
  constructor(renderer, elementRef, config2) {
    this.renderer = renderer;
    this.elementRef = elementRef;
    this.config = config2;
    this.document = inject(DOCUMENT);
  }
  ngOnInit() {
    this.renderer.addClass(this.elementRef.nativeElement, "fa-layers");
    ensureCss2(this.document, this.config);
    this.fixedWidth = typeof this.fixedWidth === "boolean" ? this.fixedWidth : this.config.fixedWidth;
  }
  ngOnChanges(changes) {
    if ("size" in changes) {
      if (changes.size.currentValue != null) {
        this.renderer.addClass(this.elementRef.nativeElement, `fa-${changes.size.currentValue}`);
      }
      if (changes.size.previousValue != null) {
        this.renderer.removeClass(this.elementRef.nativeElement, `fa-${changes.size.previousValue}`);
      }
    }
  }
};
_FaLayersComponent.\u0275fac = function FaLayersComponent_Factory(t) {
  return new (t || _FaLayersComponent)(\u0275\u0275directiveInject(Renderer2), \u0275\u0275directiveInject(ElementRef), \u0275\u0275directiveInject(FaConfig));
};
_FaLayersComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
  type: _FaLayersComponent,
  selectors: [["fa-layers"]],
  hostVars: 2,
  hostBindings: function FaLayersComponent_HostBindings(rf, ctx) {
    if (rf & 2) {
      \u0275\u0275classProp("fa-fw", ctx.fixedWidth);
    }
  },
  inputs: {
    size: "size",
    fixedWidth: "fixedWidth"
  },
  standalone: true,
  features: [\u0275\u0275NgOnChangesFeature, \u0275\u0275StandaloneFeature],
  ngContentSelectors: _c0,
  decls: 1,
  vars: 0,
  template: function FaLayersComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275projectionDef();
      \u0275\u0275projection(0);
    }
  },
  encapsulation: 2
});
var FaLayersComponent = _FaLayersComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FaLayersComponent, [{
    type: Component,
    args: [{
      selector: "fa-layers",
      standalone: true,
      template: `<ng-content></ng-content>`
    }]
  }], () => [{
    type: Renderer2
  }, {
    type: ElementRef
  }, {
    type: FaConfig
  }], {
    size: [{
      type: Input
    }],
    fixedWidth: [{
      type: Input
    }, {
      type: HostBinding,
      args: ["class.fa-fw"]
    }]
  });
})();
var _FaLayersCounterComponent = class _FaLayersCounterComponent {
  constructor(parent, sanitizer) {
    this.parent = parent;
    this.sanitizer = sanitizer;
    this.document = inject(DOCUMENT);
    this.config = inject(FaConfig);
    faWarnIfParentNotExist(this.parent, "FaLayersComponent", this.constructor.name);
  }
  ngOnChanges(changes) {
    if (changes) {
      const params = this.buildParams();
      this.updateContent(params);
    }
  }
  buildParams() {
    return {
      title: this.title,
      classes: this.position != null ? [`fa-layers-${this.position}`] : void 0
    };
  }
  updateContent(params) {
    ensureCss2(this.document, this.config);
    this.renderedHTML = this.sanitizer.bypassSecurityTrustHtml(counter(this.content || "", params).html.join(""));
  }
};
_FaLayersCounterComponent.\u0275fac = function FaLayersCounterComponent_Factory(t) {
  return new (t || _FaLayersCounterComponent)(\u0275\u0275directiveInject(FaLayersComponent, 8), \u0275\u0275directiveInject(DomSanitizer));
};
_FaLayersCounterComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
  type: _FaLayersCounterComponent,
  selectors: [["fa-layers-counter"]],
  hostAttrs: [1, "ng-fa-layers-counter"],
  hostVars: 1,
  hostBindings: function FaLayersCounterComponent_HostBindings(rf, ctx) {
    if (rf & 2) {
      \u0275\u0275hostProperty("innerHTML", ctx.renderedHTML, \u0275\u0275sanitizeHtml);
    }
  },
  inputs: {
    content: "content",
    title: "title",
    position: "position"
  },
  standalone: true,
  features: [\u0275\u0275NgOnChangesFeature, \u0275\u0275StandaloneFeature],
  decls: 0,
  vars: 0,
  template: function FaLayersCounterComponent_Template(rf, ctx) {
  },
  encapsulation: 2
});
var FaLayersCounterComponent = _FaLayersCounterComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FaLayersCounterComponent, [{
    type: Component,
    args: [{
      selector: "fa-layers-counter",
      standalone: true,
      template: "",
      host: {
        class: "ng-fa-layers-counter"
      }
    }]
  }], () => [{
    type: FaLayersComponent,
    decorators: [{
      type: Optional
    }]
  }, {
    type: DomSanitizer
  }], {
    content: [{
      type: Input
    }],
    title: [{
      type: Input
    }],
    position: [{
      type: Input
    }],
    renderedHTML: [{
      type: HostBinding,
      args: ["innerHTML"]
    }]
  });
})();
var _FaLayersTextComponent = class _FaLayersTextComponent {
  constructor(parent, sanitizer) {
    this.parent = parent;
    this.sanitizer = sanitizer;
    this.document = inject(DOCUMENT);
    this.config = inject(FaConfig);
    faWarnIfParentNotExist(this.parent, "FaLayersComponent", this.constructor.name);
  }
  ngOnChanges(changes) {
    if (changes) {
      const params = this.buildParams();
      this.updateContent(params);
    }
  }
  /**
   * Updating params by component props.
   */
  buildParams() {
    const classOpts = {
      flip: this.flip,
      border: this.border,
      inverse: this.inverse,
      size: this.size || null,
      pull: this.pull || null,
      rotate: this.rotate || null,
      fixedWidth: this.fixedWidth
    };
    const parsedTransform = typeof this.transform === "string" ? parse$1.transform(this.transform) : this.transform;
    return {
      transform: parsedTransform,
      classes: faClassList(classOpts),
      title: this.title
    };
  }
  updateContent(params) {
    ensureCss2(this.document, this.config);
    this.renderedHTML = this.sanitizer.bypassSecurityTrustHtml(text(this.content || "", params).html.join("\n"));
  }
};
_FaLayersTextComponent.\u0275fac = function FaLayersTextComponent_Factory(t) {
  return new (t || _FaLayersTextComponent)(\u0275\u0275directiveInject(FaLayersComponent, 8), \u0275\u0275directiveInject(DomSanitizer));
};
_FaLayersTextComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
  type: _FaLayersTextComponent,
  selectors: [["fa-layers-text"]],
  hostAttrs: [1, "ng-fa-layers-text"],
  hostVars: 1,
  hostBindings: function FaLayersTextComponent_HostBindings(rf, ctx) {
    if (rf & 2) {
      \u0275\u0275hostProperty("innerHTML", ctx.renderedHTML, \u0275\u0275sanitizeHtml);
    }
  },
  inputs: {
    content: "content",
    title: "title",
    flip: "flip",
    size: "size",
    pull: "pull",
    border: "border",
    inverse: "inverse",
    rotate: "rotate",
    fixedWidth: "fixedWidth",
    transform: "transform"
  },
  standalone: true,
  features: [\u0275\u0275NgOnChangesFeature, \u0275\u0275StandaloneFeature],
  decls: 0,
  vars: 0,
  template: function FaLayersTextComponent_Template(rf, ctx) {
  },
  encapsulation: 2
});
var FaLayersTextComponent = _FaLayersTextComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FaLayersTextComponent, [{
    type: Component,
    args: [{
      selector: "fa-layers-text",
      standalone: true,
      template: "",
      host: {
        class: "ng-fa-layers-text"
      }
    }]
  }], () => [{
    type: FaLayersComponent,
    decorators: [{
      type: Optional
    }]
  }, {
    type: DomSanitizer
  }], {
    content: [{
      type: Input
    }],
    title: [{
      type: Input
    }],
    flip: [{
      type: Input
    }],
    size: [{
      type: Input
    }],
    pull: [{
      type: Input
    }],
    border: [{
      type: Input
    }],
    inverse: [{
      type: Input
    }],
    rotate: [{
      type: Input
    }],
    fixedWidth: [{
      type: Input
    }],
    transform: [{
      type: Input
    }],
    renderedHTML: [{
      type: HostBinding,
      args: ["innerHTML"]
    }]
  });
})();
var _FontAwesomeModule = class _FontAwesomeModule {
};
_FontAwesomeModule.\u0275fac = function FontAwesomeModule_Factory(t) {
  return new (t || _FontAwesomeModule)();
};
_FontAwesomeModule.\u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
  type: _FontAwesomeModule
});
_FontAwesomeModule.\u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({});
var FontAwesomeModule = _FontAwesomeModule;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FontAwesomeModule, [{
    type: NgModule,
    args: [{
      imports: [FaIconComponent, FaDuotoneIconComponent, FaLayersComponent, FaLayersTextComponent, FaLayersCounterComponent, FaStackComponent, FaStackItemSizeDirective],
      exports: [FaIconComponent, FaDuotoneIconComponent, FaLayersComponent, FaLayersTextComponent, FaLayersCounterComponent, FaStackComponent, FaStackItemSizeDirective]
    }]
  }], null, null);
})();

// src/app/components/header/header.component.ts
var _c02 = ["mobilenav"];
var _c1 = ["closingdiv"];
var _c2 = ["cookiebanner"];
var _c3 = ["colorPicker"];
var _c4 = (a0) => ({ "darkmode": a0 });
function HeaderComponent_For_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 27);
    \u0275\u0275listener("click", function HeaderComponent_For_6_Template_div_click_0_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.farbeAusAuswahl($event.target));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const color_r4 = ctx.$implicit;
    \u0275\u0275styleProp("background-color", color_r4);
  }
}
function HeaderComponent_For_33_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 27);
    \u0275\u0275listener("click", function HeaderComponent_For_33_Template_div_click_0_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.farbeAusAuswahl($event.target));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const color_r6 = ctx.$implicit;
    \u0275\u0275styleProp("background-color", color_r6);
  }
}
var _HeaderComponent = class _HeaderComponent {
  constructor(cs, farbConv, dl) {
    this.cs = cs;
    this.farbConv = farbConv;
    this.dl = dl;
    this.faMoon = faMoon;
    this.colors = ["hsl(195, 75%, 50%)", "hsl(0, 60%, 50%)", "hsl(323, 82%, 50%)", "hsl(132, 64%, 50%)", "hsl(35, 100%, 50%)", "hsl(173, 63%, 50%)", "hsl(281, 94%, 50%)", "hsl(81, 56%, 50%)", "hsl(0, 0%, 50%)", "hsl(334, 100%, 50%)", "hsl(225, 6%, 50%)", "hsl(110, 69%, 50%)"];
    this.farbe = "var(--hintergrund)";
    this.men\u00FCoffen = false;
    this.isDisplayed = false;
  }
  ngAfterViewInit() {
    this.cs.cookieRequestList.subscribe((c) => {
      this.showCookieBanner();
    });
  }
  toggle() {
    this.mobilenav.nativeElement.classList.toggle("mobilenavsichtbar");
    this.closingdiv.nativeElement.classList.toggle("unsichtbar");
    this.men\u00FCoffen = !this.men\u00FCoffen;
  }
  togglebodydiv() {
    if (this.men\u00FCoffen == true) {
      this.mobilenav.nativeElement.classList.toggle("mobilenavsichtbar");
      this.closingdiv.nativeElement.classList.toggle("unsichtbar");
      this.men\u00FCoffen = false;
    }
  }
  // Farbe aus Auswahl ##########################################################################
  farbeAusAuswahl(btn) {
    let farbe = btn.style.backgroundColor;
    let sep = farbe.indexOf(",") > -1 ? "," : " ";
    let rgb = farbe.substring(4).split(")")[0].split(sep);
    let r = +rgb[0], g = +rgb[1], b = +rgb[2];
    let hslfromrgb = this.farbConv.RGBToHSL(r, g, b);
    this.dl.Farbe\u00C4ndern(hslfromrgb["h"], hslfromrgb["s"], hslfromrgb["l"]);
  }
  // Eigene Farbe ################################################################################
  CustomColor(color) {
    let hslfromhex = this.farbConv.HexToHSL(color.value);
    this.dl.Farbe\u00C4ndern(hslfromhex["h"], hslfromhex["s"], hslfromhex["l"]);
  }
  // Darkmode ################################################################################
  switchMode() {
    this.dl.togledesignScheme();
  }
  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  showCookieBanner() {
    if (this.isDisplayed)
      return;
    if (this.cs.cookieRequestList.value.length == 0)
      return;
    this.consent = this.cs.cookieRequestList.value[0].consent;
    this.cookiebanner.nativeElement.classList.remove("ausgeblendet");
    this.isDisplayed = true;
  }
  akzeptieren() {
    return __async(this, null, function* () {
      this.cs.setcookie(this.cs.cookieRequestList.value[0]);
      this.nextBanner();
    });
  }
  nextBanner() {
    return __async(this, null, function* () {
      this.cookiebanner.nativeElement.classList.add("ausgeblendet");
      var c = this.cs.cookieRequestList.value[0];
      this.cs.cookieRequested(c);
      yield this.delay(1e3);
      this.isDisplayed = false;
      this.showCookieBanner();
    });
  }
};
_HeaderComponent.\u0275fac = function HeaderComponent_Factory(t) {
  return new (t || _HeaderComponent)(\u0275\u0275directiveInject(CookiesService), \u0275\u0275directiveInject(FarbconverterService), \u0275\u0275directiveInject(DesignloaderService));
};
_HeaderComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _HeaderComponent, selectors: [["app-header"]], viewQuery: function HeaderComponent_Query(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275viewQuery(_c02, 5);
    \u0275\u0275viewQuery(_c1, 5);
    \u0275\u0275viewQuery(_c2, 5);
    \u0275\u0275viewQuery(_c3, 5);
  }
  if (rf & 2) {
    let _t;
    \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.mobilenav = _t.first);
    \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.closingdiv = _t.first);
    \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.cookiebanner = _t.first);
    \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.colorPicker = _t.first);
  }
}, inputs: { farbe: "farbe" }, decls: 60, vars: 10, consts: [["colorPicker", ""], ["mobilenav", ""], ["closingdiv", ""], ["cookiebanner", ""], [3, "ngClass"], [1, "desktopheader"], [1, "farbauswahlbuttondiv"], [1, "btnDesign", "farbauswahlbutton"], [1, "farbauswahl"], [1, "btnDesign", 3, "background-color"], [1, "anderefarbediv"], ["type", "color", "name", "farbe", 3, "change", "value"], [1, "btnDesign", "darkmodebtn", 3, "click"], [3, "icon"], ["routerLink", ""], ["routerLink", "/grundbuchrecht/einleitung"], [1, "mobileheader"], [1, "mobileheadercontent"], [1, "fa-solid", "fa-house"], [1, "mobilemen\xFCbutton", 3, "click"], [1, "designButtonsDiv"], [1, "mobilenav"], [1, "closingdiv", "unsichtbar", 3, "click"], [1, "cookiebanner", "ausgeblendet"], [3, "innerText"], ["id", "cookiejabtn", 1, "btntext", 3, "click"], ["id", "cookieneinbtn", 1, "btntext", 3, "click"], [1, "btnDesign", 3, "click"]], template: function HeaderComponent_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "header", 4)(1, "div", 5)(2, "div", 6);
    \u0275\u0275element(3, "div", 7);
    \u0275\u0275elementStart(4, "div", 8);
    \u0275\u0275repeaterCreate(5, HeaderComponent_For_6_Template, 1, 2, "div", 9, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementStart(7, "div", 10)(8, "span");
    \u0275\u0275text(9, "Eigene Farbe ausw\xE4hlen");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "input", 11, 0);
    \u0275\u0275listener("change", function HeaderComponent_Template_input_change_10_listener($event) {
      \u0275\u0275restoreView(_r1);
      return \u0275\u0275resetView(ctx.CustomColor($event.target));
    });
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(12, "div", 12);
    \u0275\u0275listener("click", function HeaderComponent_Template_div_click_12_listener() {
      \u0275\u0275restoreView(_r1);
      return \u0275\u0275resetView(ctx.switchMode());
    });
    \u0275\u0275element(13, "fa-icon", 13);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "nav")(15, "ul")(16, "li")(17, "a", 14);
    \u0275\u0275text(18, "Home");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(19, "li")(20, "a", 15);
    \u0275\u0275text(21, "Grundbuchrecht");
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275elementStart(22, "div", 16)(23, "div", 17)(24, "a", 14);
    \u0275\u0275element(25, "i", 18);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "button", 19);
    \u0275\u0275listener("click", function HeaderComponent_Template_button_click_26_listener() {
      \u0275\u0275restoreView(_r1);
      return \u0275\u0275resetView(ctx.toggle());
    });
    \u0275\u0275text(27, "Men\xFC");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "div", 20)(29, "div", 6);
    \u0275\u0275element(30, "div", 7);
    \u0275\u0275elementStart(31, "div", 8);
    \u0275\u0275repeaterCreate(32, HeaderComponent_For_33_Template, 1, 2, "div", 9, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementStart(34, "div", 10)(35, "span");
    \u0275\u0275text(36, "Eigene Farbe ausw\xE4hlen");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(37, "input", 11, 0);
    \u0275\u0275listener("change", function HeaderComponent_Template_input_change_37_listener($event) {
      \u0275\u0275restoreView(_r1);
      return \u0275\u0275resetView(ctx.CustomColor($event.target));
    });
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(39, "div", 12);
    \u0275\u0275listener("click", function HeaderComponent_Template_div_click_39_listener() {
      \u0275\u0275restoreView(_r1);
      return \u0275\u0275resetView(ctx.switchMode());
    });
    \u0275\u0275element(40, "fa-icon", 13);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(41, "nav", 21, 1)(43, "ul")(44, "li")(45, "a", 14);
    \u0275\u0275text(46, "Home");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(47, "li")(48, "a", 15);
    \u0275\u0275text(49, "Grundbuchrecht");
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275elementStart(50, "div", 22, 2);
    \u0275\u0275listener("click", function HeaderComponent_Template_div_click_50_listener() {
      \u0275\u0275restoreView(_r1);
      return \u0275\u0275resetView(ctx.togglebodydiv());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(52, "div", 23, 3)(54, "div");
    \u0275\u0275element(55, "span", 24);
    \u0275\u0275elementStart(56, "button", 25);
    \u0275\u0275listener("click", function HeaderComponent_Template_button_click_56_listener() {
      \u0275\u0275restoreView(_r1);
      return \u0275\u0275resetView(ctx.akzeptieren());
    });
    \u0275\u0275text(57, "Ja");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(58, "button", 26);
    \u0275\u0275listener("click", function HeaderComponent_Template_button_click_58_listener() {
      \u0275\u0275restoreView(_r1);
      return \u0275\u0275resetView(ctx.nextBanner());
    });
    \u0275\u0275text(59, "Nein");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(8, _c4, ctx.dl.darkmode.value));
    \u0275\u0275advance();
    \u0275\u0275styleProp("background-color", ctx.farbe);
    \u0275\u0275advance(4);
    \u0275\u0275repeater(ctx.colors);
    \u0275\u0275advance(5);
    \u0275\u0275property("value", ctx.dl.primaryColorHSL);
    \u0275\u0275advance(3);
    \u0275\u0275property("icon", ctx.faMoon);
    \u0275\u0275advance(19);
    \u0275\u0275repeater(ctx.colors);
    \u0275\u0275advance(5);
    \u0275\u0275property("value", ctx.dl.primaryColorHSL);
    \u0275\u0275advance(3);
    \u0275\u0275property("icon", ctx.faMoon);
    \u0275\u0275advance(15);
    \u0275\u0275property("innerText", ctx.consent);
  }
}, dependencies: [NgClass, RouterLink, FaIconComponent], styles: ["\n\nheader[_ngcontent-%COMP%] {\n  width: 100%;\n  position: fixed;\n  display: flex;\n  flex-direction: column;\n  z-index: 2;\n}\n.desktopheader[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  text-decoration: none;\n  display: flex;\n  align-items: center;\n  height: 100%;\n}\n.cookiebanner[_ngcontent-%COMP%] {\n  width: 100%;\n  max-height: 5em;\n  transition: max-height 0.2s linear;\n  overflow: hidden;\n  display: flex;\n  z-index: -2;\n}\n.cookiebanner[_ngcontent-%COMP%]   div[_ngcontent-%COMP%] {\n  background-color: var(--hintergrund-variant-darker);\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  width: 100%;\n}\n.cookiebanner[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: clamp(0.7rem, 1.5vw, 1rem);\n}\n.ausgeblendet[_ngcontent-%COMP%] {\n  max-height: 0;\n  overflow: hidden;\n  transition: max-height 0.2s linear;\n}\n.desktopheader[_ngcontent-%COMP%] {\n  display: flex;\n  height: 3em;\n  align-items: center;\n  width: 100%;\n}\n.desktopheader[_ngcontent-%COMP%]   .btnDesign[_ngcontent-%COMP%]:hover {\n  transform: scale(1.05);\n}\nheader[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  font-size: 1.2rem;\n}\nheader[_ngcontent-%COMP%]   nav[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  height: 100%;\n  box-shadow: none;\n  background-color: inherit;\n}\nheader[_ngcontent-%COMP%]   nav[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%] {\n  display: flex;\n  height: auto;\n  margin: 0;\n  position: relative;\n  align-items: center;\n  background-color: inherit;\n  padding-left: 2vw;\n}\nheader[_ngcontent-%COMP%]   nav[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  margin-right: 1.5vw;\n  height: 100%;\n  background-color: inherit;\n}\n.desktopheader[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:hover {\n  border-bottom: 3px solid var(--primary-variant-darker);\n  background-color: var(--hintergrund);\n  padding: 2% 0 0 0;\n  box-sizing: border-box;\n}\n.darkmode[_ngcontent-%COMP%]   header[_ngcontent-%COMP%]   nav[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:hover {\n  background-color: #646464;\n  border-bottom: 3px solid var(--primary-variant-much-brighter);\n}\nheader[_ngcontent-%COMP%]   nav[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:hover   a[_ngcontent-%COMP%] {\n  color: rgb(121, 121, 121);\n  font-weight: 500;\n}\nheader[_ngcontent-%COMP%]   nav[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  color: var(--schrift);\n  list-style-type: none;\n  font-size: 20px;\n}\n.darkmode[_ngcontent-%COMP%]   header[_ngcontent-%COMP%]   nav[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  color: whitesmoke;\n}\n.btnDesign[_ngcontent-%COMP%] {\n  border: 2px solid #707070;\n  height: 2.3rem;\n  width: 2.3rem;\n  border-radius: 8px;\n  cursor: pointer;\n}\n.darkmodebtn[_ngcontent-%COMP%] {\n  box-sizing: border-box;\n  display: flex;\n  justify-content: center;\n  margin: 0 0.5em;\n}\n.darkmodebtn[_ngcontent-%COMP%]   fa-icon[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n}\n.farbauswahlbutton[_ngcontent-%COMP%] {\n  background-color: var(--primary-color);\n  box-sizing: border-box;\n  margin-left: 1em;\n}\n.farbauswahlbuttondiv[_ngcontent-%COMP%] {\n  height: 100%;\n  display: flex;\n  align-items: center;\n}\n.farbauswahlbuttondiv[_ngcontent-%COMP%]:hover   .farbauswahl[_ngcontent-%COMP%], \n.farbauswahl[_ngcontent-%COMP%]:hover {\n  top: 3em;\n  transition: top 80ms ease-in-out;\n}\n.farbauswahl[_ngcontent-%COMP%] {\n  z-index: -1;\n  display: grid;\n  grid-template-columns: auto auto auto auto;\n  gap: 0.2rem;\n  top: -15em;\n  position: absolute;\n  background-color: var(--hintergrund-variant-darker);\n  height: 200px;\n  width: 200px;\n  padding: 0.5em;\n  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);\n  border-radius: 0 0 10px 10px;\n  border-top: none;\n}\n.anderefarbediv[_ngcontent-%COMP%] {\n  grid-column-start: 1;\n  grid-column-end: 5;\n  display: flex;\n  align-items: center;\n  justify-content: space-around;\n  flex-direction: column;\n}\n.anderefarbediv[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  margin-left: 4px;\n}\n.anderefarbediv[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  border-radius: 10px;\n  height: 40px;\n  width: 90px;\n  border: none;\n  background: none;\n}\n.anderefarbediv[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]::-webkit-color-swatch-wrapper {\n  padding: 0;\n}\n.anderefarbediv[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]::-webkit-color-swatch {\n  border: 2px solid #707070;\n  border-radius: 10px;\n  background-color: unset;\n}\n.mobileheader[_ngcontent-%COMP%] {\n  display: none;\n}\n.mobileheader[_ngcontent-%COMP%]   .mobileheadercontent[_ngcontent-%COMP%] {\n  height: 3em;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  background-color: var(--hintergrund);\n}\n.mobileheader[_ngcontent-%COMP%]   .designButtonsDiv[_ngcontent-%COMP%] {\n  display: flex;\n  height: 100%;\n  align-items: center;\n}\n.mobileheader[_ngcontent-%COMP%]   nav[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  width: 100%;\n  margin: 0;\n}\n.mobileheader[_ngcontent-%COMP%]   nav[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  padding: 0.5em;\n  width: 100%;\n  align-items: center;\n  justify-content: center;\n}\n.mobileheader[_ngcontent-%COMP%]   nav[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:nth-of-type(2n-1) {\n  background-color: var(--hintergrund-variant-darker);\n}\n.mobileheader[_ngcontent-%COMP%]   .farbauswahl[_ngcontent-%COMP%] {\n  right: 0;\n}\n.mobileheader[_ngcontent-%COMP%]   .mobilenav[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: center;\n  max-height: 0;\n  overflow: hidden;\n  background-color: var(--hintergrund);\n}\n.mobileheader[_ngcontent-%COMP%]   .mobilenavsichtbar[_ngcontent-%COMP%] {\n  max-height: 500px;\n  transition: 1ms;\n}\n@media only screen and (max-width: 700px) {\n  .desktopheader[_ngcontent-%COMP%] {\n    display: none;\n  }\n  .mobileheader[_ngcontent-%COMP%] {\n    display: flex;\n    flex-direction: column;\n    justify-content: center;\n  }\n}\n.closingdiv[_ngcontent-%COMP%] {\n  height: 100vh;\n}\n.unsichtbar[_ngcontent-%COMP%] {\n  display: none;\n}\n/*# sourceMappingURL=header.component.css.map */"] });
var HeaderComponent = _HeaderComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(HeaderComponent, { className: "HeaderComponent", filePath: "src/app/components/header/header.component.ts", lineNumber: 13 });
})();

// src/app/auth.guard.ts
var _AuthGuard = class _AuthGuard {
  constructor(cs, router, platformId) {
    this.cs = cs;
    this.router = router;
    this.platformId = platformId;
  }
  canActivate(route, state) {
    if (!isPlatformBrowser(this.platformId))
      return false;
    const token = this.checkToken();
    if (!token)
      this.router.navigate(["/"]);
    return token;
  }
  checkToken() {
    if (!isPlatformBrowser(this.platformId))
      return false;
    const tokenCookie = this.cs.getCookie("loginToken");
    if (tokenCookie != "")
      return true;
    return false;
  }
};
_AuthGuard.\u0275fac = function AuthGuard_Factory(t) {
  return new (t || _AuthGuard)(\u0275\u0275inject(CookiesService), \u0275\u0275inject(Router), \u0275\u0275inject(PLATFORM_ID));
};
_AuthGuard.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AuthGuard, factory: _AuthGuard.\u0275fac, providedIn: "root" });
var AuthGuard = _AuthGuard;

// node_modules/@angular/forms/fesm2022/forms.mjs
var _BaseControlValueAccessor = class _BaseControlValueAccessor {
  constructor(_renderer, _elementRef) {
    this._renderer = _renderer;
    this._elementRef = _elementRef;
    this.onChange = (_) => {
    };
    this.onTouched = () => {
    };
  }
  /**
   * Helper method that sets a property on a target element using the current Renderer
   * implementation.
   * @nodoc
   */
  setProperty(key, value) {
    this._renderer.setProperty(this._elementRef.nativeElement, key, value);
  }
  /**
   * Registers a function called when the control is touched.
   * @nodoc
   */
  registerOnTouched(fn) {
    this.onTouched = fn;
  }
  /**
   * Registers a function called when the control value changes.
   * @nodoc
   */
  registerOnChange(fn) {
    this.onChange = fn;
  }
  /**
   * Sets the "disabled" property on the range input element.
   * @nodoc
   */
  setDisabledState(isDisabled) {
    this.setProperty("disabled", isDisabled);
  }
};
_BaseControlValueAccessor.\u0275fac = function BaseControlValueAccessor_Factory(t) {
  return new (t || _BaseControlValueAccessor)(\u0275\u0275directiveInject(Renderer2), \u0275\u0275directiveInject(ElementRef));
};
_BaseControlValueAccessor.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
  type: _BaseControlValueAccessor
});
var BaseControlValueAccessor = _BaseControlValueAccessor;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BaseControlValueAccessor, [{
    type: Directive
  }], () => [{
    type: Renderer2
  }, {
    type: ElementRef
  }], null);
})();
var _BuiltInControlValueAccessor = class _BuiltInControlValueAccessor extends BaseControlValueAccessor {
};
_BuiltInControlValueAccessor.\u0275fac = /* @__PURE__ */ (() => {
  let \u0275BuiltInControlValueAccessor_BaseFactory;
  return function BuiltInControlValueAccessor_Factory(t) {
    return (\u0275BuiltInControlValueAccessor_BaseFactory || (\u0275BuiltInControlValueAccessor_BaseFactory = \u0275\u0275getInheritedFactory(_BuiltInControlValueAccessor)))(t || _BuiltInControlValueAccessor);
  };
})();
_BuiltInControlValueAccessor.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
  type: _BuiltInControlValueAccessor,
  features: [\u0275\u0275InheritDefinitionFeature]
});
var BuiltInControlValueAccessor = _BuiltInControlValueAccessor;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BuiltInControlValueAccessor, [{
    type: Directive
  }], null, null);
})();
var NG_VALUE_ACCESSOR = new InjectionToken(ngDevMode ? "NgValueAccessor" : "");
var CHECKBOX_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CheckboxControlValueAccessor),
  multi: true
};
var _CheckboxControlValueAccessor = class _CheckboxControlValueAccessor extends BuiltInControlValueAccessor {
  /**
   * Sets the "checked" property on the input element.
   * @nodoc
   */
  writeValue(value) {
    this.setProperty("checked", value);
  }
};
_CheckboxControlValueAccessor.\u0275fac = /* @__PURE__ */ (() => {
  let \u0275CheckboxControlValueAccessor_BaseFactory;
  return function CheckboxControlValueAccessor_Factory(t) {
    return (\u0275CheckboxControlValueAccessor_BaseFactory || (\u0275CheckboxControlValueAccessor_BaseFactory = \u0275\u0275getInheritedFactory(_CheckboxControlValueAccessor)))(t || _CheckboxControlValueAccessor);
  };
})();
_CheckboxControlValueAccessor.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
  type: _CheckboxControlValueAccessor,
  selectors: [["input", "type", "checkbox", "formControlName", ""], ["input", "type", "checkbox", "formControl", ""], ["input", "type", "checkbox", "ngModel", ""]],
  hostBindings: function CheckboxControlValueAccessor_HostBindings(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275listener("change", function CheckboxControlValueAccessor_change_HostBindingHandler($event) {
        return ctx.onChange($event.target.checked);
      })("blur", function CheckboxControlValueAccessor_blur_HostBindingHandler() {
        return ctx.onTouched();
      });
    }
  },
  features: [\u0275\u0275ProvidersFeature([CHECKBOX_VALUE_ACCESSOR]), \u0275\u0275InheritDefinitionFeature]
});
var CheckboxControlValueAccessor = _CheckboxControlValueAccessor;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CheckboxControlValueAccessor, [{
    type: Directive,
    args: [{
      selector: "input[type=checkbox][formControlName],input[type=checkbox][formControl],input[type=checkbox][ngModel]",
      host: {
        "(change)": "onChange($event.target.checked)",
        "(blur)": "onTouched()"
      },
      providers: [CHECKBOX_VALUE_ACCESSOR]
    }]
  }], null, null);
})();
var DEFAULT_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DefaultValueAccessor),
  multi: true
};
function _isAndroid() {
  const userAgent2 = getDOM() ? getDOM().getUserAgent() : "";
  return /android (\d+)/.test(userAgent2.toLowerCase());
}
var COMPOSITION_BUFFER_MODE = new InjectionToken(ngDevMode ? "CompositionEventMode" : "");
var _DefaultValueAccessor = class _DefaultValueAccessor extends BaseControlValueAccessor {
  constructor(renderer, elementRef, _compositionMode) {
    super(renderer, elementRef);
    this._compositionMode = _compositionMode;
    this._composing = false;
    if (this._compositionMode == null) {
      this._compositionMode = !_isAndroid();
    }
  }
  /**
   * Sets the "value" property on the input element.
   * @nodoc
   */
  writeValue(value) {
    const normalizedValue = value == null ? "" : value;
    this.setProperty("value", normalizedValue);
  }
  /** @internal */
  _handleInput(value) {
    if (!this._compositionMode || this._compositionMode && !this._composing) {
      this.onChange(value);
    }
  }
  /** @internal */
  _compositionStart() {
    this._composing = true;
  }
  /** @internal */
  _compositionEnd(value) {
    this._composing = false;
    this._compositionMode && this.onChange(value);
  }
};
_DefaultValueAccessor.\u0275fac = function DefaultValueAccessor_Factory(t) {
  return new (t || _DefaultValueAccessor)(\u0275\u0275directiveInject(Renderer2), \u0275\u0275directiveInject(ElementRef), \u0275\u0275directiveInject(COMPOSITION_BUFFER_MODE, 8));
};
_DefaultValueAccessor.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
  type: _DefaultValueAccessor,
  selectors: [["input", "formControlName", "", 3, "type", "checkbox"], ["textarea", "formControlName", ""], ["input", "formControl", "", 3, "type", "checkbox"], ["textarea", "formControl", ""], ["input", "ngModel", "", 3, "type", "checkbox"], ["textarea", "ngModel", ""], ["", "ngDefaultControl", ""]],
  hostBindings: function DefaultValueAccessor_HostBindings(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275listener("input", function DefaultValueAccessor_input_HostBindingHandler($event) {
        return ctx._handleInput($event.target.value);
      })("blur", function DefaultValueAccessor_blur_HostBindingHandler() {
        return ctx.onTouched();
      })("compositionstart", function DefaultValueAccessor_compositionstart_HostBindingHandler() {
        return ctx._compositionStart();
      })("compositionend", function DefaultValueAccessor_compositionend_HostBindingHandler($event) {
        return ctx._compositionEnd($event.target.value);
      });
    }
  },
  features: [\u0275\u0275ProvidersFeature([DEFAULT_VALUE_ACCESSOR]), \u0275\u0275InheritDefinitionFeature]
});
var DefaultValueAccessor = _DefaultValueAccessor;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DefaultValueAccessor, [{
    type: Directive,
    args: [{
      selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]",
      // TODO: vsavkin replace the above selector with the one below it once
      // https://github.com/angular/angular/issues/3011 is implemented
      // selector: '[ngModel],[formControl],[formControlName]',
      host: {
        "(input)": "$any(this)._handleInput($event.target.value)",
        "(blur)": "onTouched()",
        "(compositionstart)": "$any(this)._compositionStart()",
        "(compositionend)": "$any(this)._compositionEnd($event.target.value)"
      },
      providers: [DEFAULT_VALUE_ACCESSOR]
    }]
  }], () => [{
    type: Renderer2
  }, {
    type: ElementRef
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [COMPOSITION_BUFFER_MODE]
    }]
  }], null);
})();
function isEmptyInputValue(value) {
  return value == null || (typeof value === "string" || Array.isArray(value)) && value.length === 0;
}
function hasValidLength(value) {
  return value != null && typeof value.length === "number";
}
var NG_VALIDATORS = new InjectionToken(ngDevMode ? "NgValidators" : "");
var NG_ASYNC_VALIDATORS = new InjectionToken(ngDevMode ? "NgAsyncValidators" : "");
var EMAIL_REGEXP = /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
var Validators = class {
  /**
   * @description
   * Validator that requires the control's value to be greater than or equal to the provided number.
   *
   * @usageNotes
   *
   * ### Validate against a minimum of 3
   *
   * ```typescript
   * const control = new FormControl(2, Validators.min(3));
   *
   * console.log(control.errors); // {min: {min: 3, actual: 2}}
   * ```
   *
   * @returns A validator function that returns an error map with the
   * `min` property if the validation check fails, otherwise `null`.
   *
   * @see {@link updateValueAndValidity()}
   *
   */
  static min(min) {
    return minValidator(min);
  }
  /**
   * @description
   * Validator that requires the control's value to be less than or equal to the provided number.
   *
   * @usageNotes
   *
   * ### Validate against a maximum of 15
   *
   * ```typescript
   * const control = new FormControl(16, Validators.max(15));
   *
   * console.log(control.errors); // {max: {max: 15, actual: 16}}
   * ```
   *
   * @returns A validator function that returns an error map with the
   * `max` property if the validation check fails, otherwise `null`.
   *
   * @see {@link updateValueAndValidity()}
   *
   */
  static max(max) {
    return maxValidator(max);
  }
  /**
   * @description
   * Validator that requires the control have a non-empty value.
   *
   * @usageNotes
   *
   * ### Validate that the field is non-empty
   *
   * ```typescript
   * const control = new FormControl('', Validators.required);
   *
   * console.log(control.errors); // {required: true}
   * ```
   *
   * @returns An error map with the `required` property
   * if the validation check fails, otherwise `null`.
   *
   * @see {@link updateValueAndValidity()}
   *
   */
  static required(control) {
    return requiredValidator(control);
  }
  /**
   * @description
   * Validator that requires the control's value be true. This validator is commonly
   * used for required checkboxes.
   *
   * @usageNotes
   *
   * ### Validate that the field value is true
   *
   * ```typescript
   * const control = new FormControl('some value', Validators.requiredTrue);
   *
   * console.log(control.errors); // {required: true}
   * ```
   *
   * @returns An error map that contains the `required` property
   * set to `true` if the validation check fails, otherwise `null`.
   *
   * @see {@link updateValueAndValidity()}
   *
   */
  static requiredTrue(control) {
    return requiredTrueValidator(control);
  }
  /**
   * @description
   * Validator that requires the control's value pass an email validation test.
   *
   * Tests the value using a [regular
   * expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)
   * pattern suitable for common use cases. The pattern is based on the definition of a valid email
   * address in the [WHATWG HTML
   * specification](https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address) with
   * some enhancements to incorporate more RFC rules (such as rules related to domain names and the
   * lengths of different parts of the address).
   *
   * The differences from the WHATWG version include:
   * - Disallow `local-part` (the part before the `@` symbol) to begin or end with a period (`.`).
   * - Disallow `local-part` to be longer than 64 characters.
   * - Disallow the whole address to be longer than 254 characters.
   *
   * If this pattern does not satisfy your business needs, you can use `Validators.pattern()` to
   * validate the value against a different pattern.
   *
   * @usageNotes
   *
   * ### Validate that the field matches a valid email pattern
   *
   * ```typescript
   * const control = new FormControl('bad@', Validators.email);
   *
   * console.log(control.errors); // {email: true}
   * ```
   *
   * @returns An error map with the `email` property
   * if the validation check fails, otherwise `null`.
   *
   * @see {@link updateValueAndValidity()}
   *
   */
  static email(control) {
    return emailValidator(control);
  }
  /**
   * @description
   * Validator that requires the length of the control's value to be greater than or equal
   * to the provided minimum length. This validator is also provided by default if you use the
   * the HTML5 `minlength` attribute. Note that the `minLength` validator is intended to be used
   * only for types that have a numeric `length` property, such as strings or arrays. The
   * `minLength` validator logic is also not invoked for values when their `length` property is 0
   * (for example in case of an empty string or an empty array), to support optional controls. You
   * can use the standard `required` validator if empty values should not be considered valid.
   *
   * @usageNotes
   *
   * ### Validate that the field has a minimum of 3 characters
   *
   * ```typescript
   * const control = new FormControl('ng', Validators.minLength(3));
   *
   * console.log(control.errors); // {minlength: {requiredLength: 3, actualLength: 2}}
   * ```
   *
   * ```html
   * <input minlength="5">
   * ```
   *
   * @returns A validator function that returns an error map with the
   * `minlength` property if the validation check fails, otherwise `null`.
   *
   * @see {@link updateValueAndValidity()}
   *
   */
  static minLength(minLength) {
    return minLengthValidator(minLength);
  }
  /**
   * @description
   * Validator that requires the length of the control's value to be less than or equal
   * to the provided maximum length. This validator is also provided by default if you use the
   * the HTML5 `maxlength` attribute. Note that the `maxLength` validator is intended to be used
   * only for types that have a numeric `length` property, such as strings or arrays.
   *
   * @usageNotes
   *
   * ### Validate that the field has maximum of 5 characters
   *
   * ```typescript
   * const control = new FormControl('Angular', Validators.maxLength(5));
   *
   * console.log(control.errors); // {maxlength: {requiredLength: 5, actualLength: 7}}
   * ```
   *
   * ```html
   * <input maxlength="5">
   * ```
   *
   * @returns A validator function that returns an error map with the
   * `maxlength` property if the validation check fails, otherwise `null`.
   *
   * @see {@link updateValueAndValidity()}
   *
   */
  static maxLength(maxLength) {
    return maxLengthValidator(maxLength);
  }
  /**
   * @description
   * Validator that requires the control's value to match a regex pattern. This validator is also
   * provided by default if you use the HTML5 `pattern` attribute.
   *
   * @usageNotes
   *
   * ### Validate that the field only contains letters or spaces
   *
   * ```typescript
   * const control = new FormControl('1', Validators.pattern('[a-zA-Z ]*'));
   *
   * console.log(control.errors); // {pattern: {requiredPattern: '^[a-zA-Z ]*$', actualValue: '1'}}
   * ```
   *
   * ```html
   * <input pattern="[a-zA-Z ]*">
   * ```
   *
   * ### Pattern matching with the global or sticky flag
   *
   * `RegExp` objects created with the `g` or `y` flags that are passed into `Validators.pattern`
   * can produce different results on the same input when validations are run consecutively. This is
   * due to how the behavior of `RegExp.prototype.test` is
   * specified in [ECMA-262](https://tc39.es/ecma262/#sec-regexpbuiltinexec)
   * (`RegExp` preserves the index of the last match when the global or sticky flag is used).
   * Due to this behavior, it is recommended that when using
   * `Validators.pattern` you **do not** pass in a `RegExp` object with either the global or sticky
   * flag enabled.
   *
   * ```typescript
   * // Not recommended (since the `g` flag is used)
   * const controlOne = new FormControl('1', Validators.pattern(/foo/g));
   *
   * // Good
   * const controlTwo = new FormControl('1', Validators.pattern(/foo/));
   * ```
   *
   * @param pattern A regular expression to be used as is to test the values, or a string.
   * If a string is passed, the `^` character is prepended and the `$` character is
   * appended to the provided string (if not already present), and the resulting regular
   * expression is used to test the values.
   *
   * @returns A validator function that returns an error map with the
   * `pattern` property if the validation check fails, otherwise `null`.
   *
   * @see {@link updateValueAndValidity()}
   *
   */
  static pattern(pattern) {
    return patternValidator(pattern);
  }
  /**
   * @description
   * Validator that performs no operation.
   *
   * @see {@link updateValueAndValidity()}
   *
   */
  static nullValidator(control) {
    return nullValidator(control);
  }
  static compose(validators) {
    return compose(validators);
  }
  /**
   * @description
   * Compose multiple async validators into a single function that returns the union
   * of the individual error objects for the provided control.
   *
   * @returns A validator function that returns an error map with the
   * merged error objects of the async validators if the validation check fails, otherwise `null`.
   *
   * @see {@link updateValueAndValidity()}
   *
   */
  static composeAsync(validators) {
    return composeAsync(validators);
  }
};
function minValidator(min) {
  return (control) => {
    if (isEmptyInputValue(control.value) || isEmptyInputValue(min)) {
      return null;
    }
    const value = parseFloat(control.value);
    return !isNaN(value) && value < min ? {
      "min": {
        "min": min,
        "actual": control.value
      }
    } : null;
  };
}
function maxValidator(max) {
  return (control) => {
    if (isEmptyInputValue(control.value) || isEmptyInputValue(max)) {
      return null;
    }
    const value = parseFloat(control.value);
    return !isNaN(value) && value > max ? {
      "max": {
        "max": max,
        "actual": control.value
      }
    } : null;
  };
}
function requiredValidator(control) {
  return isEmptyInputValue(control.value) ? {
    "required": true
  } : null;
}
function requiredTrueValidator(control) {
  return control.value === true ? null : {
    "required": true
  };
}
function emailValidator(control) {
  if (isEmptyInputValue(control.value)) {
    return null;
  }
  return EMAIL_REGEXP.test(control.value) ? null : {
    "email": true
  };
}
function minLengthValidator(minLength) {
  return (control) => {
    if (isEmptyInputValue(control.value) || !hasValidLength(control.value)) {
      return null;
    }
    return control.value.length < minLength ? {
      "minlength": {
        "requiredLength": minLength,
        "actualLength": control.value.length
      }
    } : null;
  };
}
function maxLengthValidator(maxLength) {
  return (control) => {
    return hasValidLength(control.value) && control.value.length > maxLength ? {
      "maxlength": {
        "requiredLength": maxLength,
        "actualLength": control.value.length
      }
    } : null;
  };
}
function patternValidator(pattern) {
  if (!pattern) return nullValidator;
  let regex;
  let regexStr;
  if (typeof pattern === "string") {
    regexStr = "";
    if (pattern.charAt(0) !== "^") regexStr += "^";
    regexStr += pattern;
    if (pattern.charAt(pattern.length - 1) !== "$") regexStr += "$";
    regex = new RegExp(regexStr);
  } else {
    regexStr = pattern.toString();
    regex = pattern;
  }
  return (control) => {
    if (isEmptyInputValue(control.value)) {
      return null;
    }
    const value = control.value;
    return regex.test(value) ? null : {
      "pattern": {
        "requiredPattern": regexStr,
        "actualValue": value
      }
    };
  };
}
function nullValidator(control) {
  return null;
}
function isPresent(o) {
  return o != null;
}
function toObservable(value) {
  const obs = isPromise(value) ? from(value) : value;
  if ((typeof ngDevMode === "undefined" || ngDevMode) && !isSubscribable(obs)) {
    let errorMessage = `Expected async validator to return Promise or Observable.`;
    if (typeof value === "object") {
      errorMessage += " Are you using a synchronous validator where an async validator is expected?";
    }
    throw new RuntimeError(-1101, errorMessage);
  }
  return obs;
}
function mergeErrors(arrayOfErrors) {
  let res = {};
  arrayOfErrors.forEach((errors) => {
    res = errors != null ? __spreadValues(__spreadValues({}, res), errors) : res;
  });
  return Object.keys(res).length === 0 ? null : res;
}
function executeValidators(control, validators) {
  return validators.map((validator) => validator(control));
}
function isValidatorFn(validator) {
  return !validator.validate;
}
function normalizeValidators(validators) {
  return validators.map((validator) => {
    return isValidatorFn(validator) ? validator : (c) => validator.validate(c);
  });
}
function compose(validators) {
  if (!validators) return null;
  const presentValidators = validators.filter(isPresent);
  if (presentValidators.length == 0) return null;
  return function(control) {
    return mergeErrors(executeValidators(control, presentValidators));
  };
}
function composeValidators(validators) {
  return validators != null ? compose(normalizeValidators(validators)) : null;
}
function composeAsync(validators) {
  if (!validators) return null;
  const presentValidators = validators.filter(isPresent);
  if (presentValidators.length == 0) return null;
  return function(control) {
    const observables = executeValidators(control, presentValidators).map(toObservable);
    return forkJoin(observables).pipe(map(mergeErrors));
  };
}
function composeAsyncValidators(validators) {
  return validators != null ? composeAsync(normalizeValidators(validators)) : null;
}
function mergeValidators(controlValidators, dirValidator) {
  if (controlValidators === null) return [dirValidator];
  return Array.isArray(controlValidators) ? [...controlValidators, dirValidator] : [controlValidators, dirValidator];
}
function getControlValidators(control) {
  return control._rawValidators;
}
function getControlAsyncValidators(control) {
  return control._rawAsyncValidators;
}
function makeValidatorsArray(validators) {
  if (!validators) return [];
  return Array.isArray(validators) ? validators : [validators];
}
function hasValidator(validators, validator) {
  return Array.isArray(validators) ? validators.includes(validator) : validators === validator;
}
function addValidators(validators, currentValidators) {
  const current = makeValidatorsArray(currentValidators);
  const validatorsToAdd = makeValidatorsArray(validators);
  validatorsToAdd.forEach((v) => {
    if (!hasValidator(current, v)) {
      current.push(v);
    }
  });
  return current;
}
function removeValidators(validators, currentValidators) {
  return makeValidatorsArray(currentValidators).filter((v) => !hasValidator(validators, v));
}
var AbstractControlDirective = class {
  constructor() {
    this._rawValidators = [];
    this._rawAsyncValidators = [];
    this._onDestroyCallbacks = [];
  }
  /**
   * @description
   * Reports the value of the control if it is present, otherwise null.
   */
  get value() {
    return this.control ? this.control.value : null;
  }
  /**
   * @description
   * Reports whether the control is valid. A control is considered valid if no
   * validation errors exist with the current value.
   * If the control is not present, null is returned.
   */
  get valid() {
    return this.control ? this.control.valid : null;
  }
  /**
   * @description
   * Reports whether the control is invalid, meaning that an error exists in the input value.
   * If the control is not present, null is returned.
   */
  get invalid() {
    return this.control ? this.control.invalid : null;
  }
  /**
   * @description
   * Reports whether a control is pending, meaning that async validation is occurring and
   * errors are not yet available for the input value. If the control is not present, null is
   * returned.
   */
  get pending() {
    return this.control ? this.control.pending : null;
  }
  /**
   * @description
   * Reports whether the control is disabled, meaning that the control is disabled
   * in the UI and is exempt from validation checks and excluded from aggregate
   * values of ancestor controls. If the control is not present, null is returned.
   */
  get disabled() {
    return this.control ? this.control.disabled : null;
  }
  /**
   * @description
   * Reports whether the control is enabled, meaning that the control is included in ancestor
   * calculations of validity or value. If the control is not present, null is returned.
   */
  get enabled() {
    return this.control ? this.control.enabled : null;
  }
  /**
   * @description
   * Reports the control's validation errors. If the control is not present, null is returned.
   */
  get errors() {
    return this.control ? this.control.errors : null;
  }
  /**
   * @description
   * Reports whether the control is pristine, meaning that the user has not yet changed
   * the value in the UI. If the control is not present, null is returned.
   */
  get pristine() {
    return this.control ? this.control.pristine : null;
  }
  /**
   * @description
   * Reports whether the control is dirty, meaning that the user has changed
   * the value in the UI. If the control is not present, null is returned.
   */
  get dirty() {
    return this.control ? this.control.dirty : null;
  }
  /**
   * @description
   * Reports whether the control is touched, meaning that the user has triggered
   * a `blur` event on it. If the control is not present, null is returned.
   */
  get touched() {
    return this.control ? this.control.touched : null;
  }
  /**
   * @description
   * Reports the validation status of the control. Possible values include:
   * 'VALID', 'INVALID', 'DISABLED', and 'PENDING'.
   * If the control is not present, null is returned.
   */
  get status() {
    return this.control ? this.control.status : null;
  }
  /**
   * @description
   * Reports whether the control is untouched, meaning that the user has not yet triggered
   * a `blur` event on it. If the control is not present, null is returned.
   */
  get untouched() {
    return this.control ? this.control.untouched : null;
  }
  /**
   * @description
   * Returns a multicasting observable that emits a validation status whenever it is
   * calculated for the control. If the control is not present, null is returned.
   */
  get statusChanges() {
    return this.control ? this.control.statusChanges : null;
  }
  /**
   * @description
   * Returns a multicasting observable of value changes for the control that emits every time the
   * value of the control changes in the UI or programmatically.
   * If the control is not present, null is returned.
   */
  get valueChanges() {
    return this.control ? this.control.valueChanges : null;
  }
  /**
   * @description
   * Returns an array that represents the path from the top-level form to this control.
   * Each index is the string name of the control on that level.
   */
  get path() {
    return null;
  }
  /**
   * Sets synchronous validators for this directive.
   * @internal
   */
  _setValidators(validators) {
    this._rawValidators = validators || [];
    this._composedValidatorFn = composeValidators(this._rawValidators);
  }
  /**
   * Sets asynchronous validators for this directive.
   * @internal
   */
  _setAsyncValidators(validators) {
    this._rawAsyncValidators = validators || [];
    this._composedAsyncValidatorFn = composeAsyncValidators(this._rawAsyncValidators);
  }
  /**
   * @description
   * Synchronous validator function composed of all the synchronous validators registered with this
   * directive.
   */
  get validator() {
    return this._composedValidatorFn || null;
  }
  /**
   * @description
   * Asynchronous validator function composed of all the asynchronous validators registered with
   * this directive.
   */
  get asyncValidator() {
    return this._composedAsyncValidatorFn || null;
  }
  /**
   * Internal function to register callbacks that should be invoked
   * when directive instance is being destroyed.
   * @internal
   */
  _registerOnDestroy(fn) {
    this._onDestroyCallbacks.push(fn);
  }
  /**
   * Internal function to invoke all registered "on destroy" callbacks.
   * Note: calling this function also clears the list of callbacks.
   * @internal
   */
  _invokeOnDestroyCallbacks() {
    this._onDestroyCallbacks.forEach((fn) => fn());
    this._onDestroyCallbacks = [];
  }
  /**
   * @description
   * Resets the control with the provided value if the control is present.
   */
  reset(value = void 0) {
    if (this.control) this.control.reset(value);
  }
  /**
   * @description
   * Reports whether the control with the given path has the error specified.
   *
   * @param errorCode The code of the error to check
   * @param path A list of control names that designates how to move from the current control
   * to the control that should be queried for errors.
   *
   * @usageNotes
   * For example, for the following `FormGroup`:
   *
   * ```
   * form = new FormGroup({
   *   address: new FormGroup({ street: new FormControl() })
   * });
   * ```
   *
   * The path to the 'street' control from the root form would be 'address' -> 'street'.
   *
   * It can be provided to this method in one of two formats:
   *
   * 1. An array of string control names, e.g. `['address', 'street']`
   * 1. A period-delimited list of control names in one string, e.g. `'address.street'`
   *
   * If no path is given, this method checks for the error on the current control.
   *
   * @returns whether the given error is present in the control at the given path.
   *
   * If the control is not present, false is returned.
   */
  hasError(errorCode, path) {
    return this.control ? this.control.hasError(errorCode, path) : false;
  }
  /**
   * @description
   * Reports error data for the control with the given path.
   *
   * @param errorCode The code of the error to check
   * @param path A list of control names that designates how to move from the current control
   * to the control that should be queried for errors.
   *
   * @usageNotes
   * For example, for the following `FormGroup`:
   *
   * ```
   * form = new FormGroup({
   *   address: new FormGroup({ street: new FormControl() })
   * });
   * ```
   *
   * The path to the 'street' control from the root form would be 'address' -> 'street'.
   *
   * It can be provided to this method in one of two formats:
   *
   * 1. An array of string control names, e.g. `['address', 'street']`
   * 1. A period-delimited list of control names in one string, e.g. `'address.street'`
   *
   * @returns error data for that particular error. If the control or error is not present,
   * null is returned.
   */
  getError(errorCode, path) {
    return this.control ? this.control.getError(errorCode, path) : null;
  }
};
var ControlContainer = class extends AbstractControlDirective {
  /**
   * @description
   * The top-level form directive for the control.
   */
  get formDirective() {
    return null;
  }
  /**
   * @description
   * The path to this group.
   */
  get path() {
    return null;
  }
};
var NgControl = class extends AbstractControlDirective {
  constructor() {
    super(...arguments);
    this._parent = null;
    this.name = null;
    this.valueAccessor = null;
  }
};
var AbstractControlStatus = class {
  constructor(cd) {
    this._cd = cd;
  }
  get isTouched() {
    return !!this._cd?.control?.touched;
  }
  get isUntouched() {
    return !!this._cd?.control?.untouched;
  }
  get isPristine() {
    return !!this._cd?.control?.pristine;
  }
  get isDirty() {
    return !!this._cd?.control?.dirty;
  }
  get isValid() {
    return !!this._cd?.control?.valid;
  }
  get isInvalid() {
    return !!this._cd?.control?.invalid;
  }
  get isPending() {
    return !!this._cd?.control?.pending;
  }
  get isSubmitted() {
    return !!this._cd?.submitted;
  }
};
var ngControlStatusHost = {
  "[class.ng-untouched]": "isUntouched",
  "[class.ng-touched]": "isTouched",
  "[class.ng-pristine]": "isPristine",
  "[class.ng-dirty]": "isDirty",
  "[class.ng-valid]": "isValid",
  "[class.ng-invalid]": "isInvalid",
  "[class.ng-pending]": "isPending"
};
var ngGroupStatusHost = __spreadProps(__spreadValues({}, ngControlStatusHost), {
  "[class.ng-submitted]": "isSubmitted"
});
var _NgControlStatus = class _NgControlStatus extends AbstractControlStatus {
  constructor(cd) {
    super(cd);
  }
};
_NgControlStatus.\u0275fac = function NgControlStatus_Factory(t) {
  return new (t || _NgControlStatus)(\u0275\u0275directiveInject(NgControl, 2));
};
_NgControlStatus.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
  type: _NgControlStatus,
  selectors: [["", "formControlName", ""], ["", "ngModel", ""], ["", "formControl", ""]],
  hostVars: 14,
  hostBindings: function NgControlStatus_HostBindings(rf, ctx) {
    if (rf & 2) {
      \u0275\u0275classProp("ng-untouched", ctx.isUntouched)("ng-touched", ctx.isTouched)("ng-pristine", ctx.isPristine)("ng-dirty", ctx.isDirty)("ng-valid", ctx.isValid)("ng-invalid", ctx.isInvalid)("ng-pending", ctx.isPending);
    }
  },
  features: [\u0275\u0275InheritDefinitionFeature]
});
var NgControlStatus = _NgControlStatus;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NgControlStatus, [{
    type: Directive,
    args: [{
      selector: "[formControlName],[ngModel],[formControl]",
      host: ngControlStatusHost
    }]
  }], () => [{
    type: NgControl,
    decorators: [{
      type: Self
    }]
  }], null);
})();
var _NgControlStatusGroup = class _NgControlStatusGroup extends AbstractControlStatus {
  constructor(cd) {
    super(cd);
  }
};
_NgControlStatusGroup.\u0275fac = function NgControlStatusGroup_Factory(t) {
  return new (t || _NgControlStatusGroup)(\u0275\u0275directiveInject(ControlContainer, 10));
};
_NgControlStatusGroup.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
  type: _NgControlStatusGroup,
  selectors: [["", "formGroupName", ""], ["", "formArrayName", ""], ["", "ngModelGroup", ""], ["", "formGroup", ""], ["form", 3, "ngNoForm", ""], ["", "ngForm", ""]],
  hostVars: 16,
  hostBindings: function NgControlStatusGroup_HostBindings(rf, ctx) {
    if (rf & 2) {
      \u0275\u0275classProp("ng-untouched", ctx.isUntouched)("ng-touched", ctx.isTouched)("ng-pristine", ctx.isPristine)("ng-dirty", ctx.isDirty)("ng-valid", ctx.isValid)("ng-invalid", ctx.isInvalid)("ng-pending", ctx.isPending)("ng-submitted", ctx.isSubmitted);
    }
  },
  features: [\u0275\u0275InheritDefinitionFeature]
});
var NgControlStatusGroup = _NgControlStatusGroup;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NgControlStatusGroup, [{
    type: Directive,
    args: [{
      selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],form:not([ngNoForm]),[ngForm]",
      host: ngGroupStatusHost
    }]
  }], () => [{
    type: ControlContainer,
    decorators: [{
      type: Optional
    }, {
      type: Self
    }]
  }], null);
})();
var formControlNameExample = `
  <div [formGroup]="myGroup">
    <input formControlName="firstName">
  </div>

  In your class:

  this.myGroup = new FormGroup({
      firstName: new FormControl()
  });`;
var formGroupNameExample = `
  <div [formGroup]="myGroup">
      <div formGroupName="person">
        <input formControlName="firstName">
      </div>
  </div>

  In your class:

  this.myGroup = new FormGroup({
      person: new FormGroup({ firstName: new FormControl() })
  });`;
var formArrayNameExample = `
  <div [formGroup]="myGroup">
    <div formArrayName="cities">
      <div *ngFor="let city of cityArray.controls; index as i">
        <input [formControlName]="i">
      </div>
    </div>
  </div>

  In your class:

  this.cityArray = new FormArray([new FormControl('SF')]);
  this.myGroup = new FormGroup({
    cities: this.cityArray
  });`;
var ngModelGroupExample = `
  <form>
      <div ngModelGroup="person">
        <input [(ngModel)]="person.name" name="firstName">
      </div>
  </form>`;
var ngModelWithFormGroupExample = `
  <div [formGroup]="myGroup">
      <input formControlName="firstName">
      <input [(ngModel)]="showMoreControls" [ngModelOptions]="{standalone: true}">
  </div>
`;
function controlParentException(nameOrIndex) {
  return new RuntimeError(1050, `formControlName must be used with a parent formGroup directive. You'll want to add a formGroup
      directive and pass it an existing FormGroup instance (you can create one in your class).

      ${describeFormControl(nameOrIndex)}

    Example:

    ${formControlNameExample}`);
}
function describeFormControl(nameOrIndex) {
  if (nameOrIndex == null || nameOrIndex === "") {
    return "";
  }
  const valueType = typeof nameOrIndex === "string" ? "name" : "index";
  return `Affected Form Control ${valueType}: "${nameOrIndex}"`;
}
function ngModelGroupException() {
  return new RuntimeError(1051, `formControlName cannot be used with an ngModelGroup parent. It is only compatible with parents
      that also have a "form" prefix: formGroupName, formArrayName, or formGroup.

      Option 1:  Update the parent to be formGroupName (reactive form strategy)

      ${formGroupNameExample}

      Option 2: Use ngModel instead of formControlName (template-driven strategy)

      ${ngModelGroupExample}`);
}
function missingFormException() {
  return new RuntimeError(1052, `formGroup expects a FormGroup instance. Please pass one in.

      Example:

      ${formControlNameExample}`);
}
function groupParentException() {
  return new RuntimeError(1053, `formGroupName must be used with a parent formGroup directive.  You'll want to add a formGroup
    directive and pass it an existing FormGroup instance (you can create one in your class).

    Example:

    ${formGroupNameExample}`);
}
function arrayParentException() {
  return new RuntimeError(1054, `formArrayName must be used with a parent formGroup directive.  You'll want to add a formGroup
      directive and pass it an existing FormGroup instance (you can create one in your class).

      Example:

      ${formArrayNameExample}`);
}
var disabledAttrWarning = `
  It looks like you're using the disabled attribute with a reactive form directive. If you set disabled to true
  when you set up this control in your component class, the disabled attribute will actually be set in the DOM for
  you. We recommend using this approach to avoid 'changed after checked' errors.

  Example:
  // Specify the \`disabled\` property at control creation time:
  form = new FormGroup({
    first: new FormControl({value: 'Nancy', disabled: true}, Validators.required),
    last: new FormControl('Drew', Validators.required)
  });

  // Controls can also be enabled/disabled after creation:
  form.get('first')?.enable();
  form.get('last')?.disable();
`;
var asyncValidatorsDroppedWithOptsWarning = `
  It looks like you're constructing using a FormControl with both an options argument and an
  async validators argument. Mixing these arguments will cause your async validators to be dropped.
  You should either put all your validators in the options object, or in separate validators
  arguments. For example:

  // Using validators arguments
  fc = new FormControl(42, Validators.required, myAsyncValidator);

  // Using AbstractControlOptions
  fc = new FormControl(42, {validators: Validators.required, asyncValidators: myAV});

  // Do NOT mix them: async validators will be dropped!
  fc = new FormControl(42, {validators: Validators.required}, /* Oops! */ myAsyncValidator);
`;
function ngModelWarning(directiveName) {
  return `
  It looks like you're using ngModel on the same form field as ${directiveName}.
  Support for using the ngModel input property and ngModelChange event with
  reactive form directives has been deprecated in Angular v6 and will be removed
  in a future version of Angular.

  For more information on this, see our API docs here:
  https://angular.io/api/forms/${directiveName === "formControl" ? "FormControlDirective" : "FormControlName"}#use-with-ngmodel
  `;
}
function describeKey(isFormGroup, key) {
  return isFormGroup ? `with name: '${key}'` : `at index: ${key}`;
}
function noControlsError(isFormGroup) {
  return `
    There are no form controls registered with this ${isFormGroup ? "group" : "array"} yet. If you're using ngModel,
    you may want to check next tick (e.g. use setTimeout).
  `;
}
function missingControlError(isFormGroup, key) {
  return `Cannot find form control ${describeKey(isFormGroup, key)}`;
}
function missingControlValueError(isFormGroup, key) {
  return `Must supply a value for form control ${describeKey(isFormGroup, key)}`;
}
var VALID = "VALID";
var INVALID = "INVALID";
var PENDING = "PENDING";
var DISABLED = "DISABLED";
var ControlEvent = class {
};
var ValueChangeEvent = class extends ControlEvent {
  constructor(value, source) {
    super();
    this.value = value;
    this.source = source;
  }
};
var PristineChangeEvent = class extends ControlEvent {
  constructor(pristine, source) {
    super();
    this.pristine = pristine;
    this.source = source;
  }
};
var TouchedChangeEvent = class extends ControlEvent {
  constructor(touched, source) {
    super();
    this.touched = touched;
    this.source = source;
  }
};
var StatusChangeEvent = class extends ControlEvent {
  constructor(status, source) {
    super();
    this.status = status;
    this.source = source;
  }
};
var FormSubmittedEvent = class extends ControlEvent {
  constructor(source) {
    super();
    this.source = source;
  }
};
var FormResetEvent = class extends ControlEvent {
  constructor(source) {
    super();
    this.source = source;
  }
};
function pickValidators(validatorOrOpts) {
  return (isOptionsObj(validatorOrOpts) ? validatorOrOpts.validators : validatorOrOpts) || null;
}
function coerceToValidator(validator) {
  return Array.isArray(validator) ? composeValidators(validator) : validator || null;
}
function pickAsyncValidators(asyncValidator, validatorOrOpts) {
  if (typeof ngDevMode === "undefined" || ngDevMode) {
    if (isOptionsObj(validatorOrOpts) && asyncValidator) {
      console.warn(asyncValidatorsDroppedWithOptsWarning);
    }
  }
  return (isOptionsObj(validatorOrOpts) ? validatorOrOpts.asyncValidators : asyncValidator) || null;
}
function coerceToAsyncValidator(asyncValidator) {
  return Array.isArray(asyncValidator) ? composeAsyncValidators(asyncValidator) : asyncValidator || null;
}
function isOptionsObj(validatorOrOpts) {
  return validatorOrOpts != null && !Array.isArray(validatorOrOpts) && typeof validatorOrOpts === "object";
}
function assertControlPresent(parent, isGroup, key) {
  const controls = parent.controls;
  const collection = isGroup ? Object.keys(controls) : controls;
  if (!collection.length) {
    throw new RuntimeError(1e3, typeof ngDevMode === "undefined" || ngDevMode ? noControlsError(isGroup) : "");
  }
  if (!controls[key]) {
    throw new RuntimeError(1001, typeof ngDevMode === "undefined" || ngDevMode ? missingControlError(isGroup, key) : "");
  }
}
function assertAllValuesPresent(control, isGroup, value) {
  control._forEachChild((_, key) => {
    if (value[key] === void 0) {
      throw new RuntimeError(1002, typeof ngDevMode === "undefined" || ngDevMode ? missingControlValueError(isGroup, key) : "");
    }
  });
}
var AbstractControl = class {
  /**
   * Initialize the AbstractControl instance.
   *
   * @param validators The function or array of functions that is used to determine the validity of
   *     this control synchronously.
   * @param asyncValidators The function or array of functions that is used to determine validity of
   *     this control asynchronously.
   */
  constructor(validators, asyncValidators) {
    this._pendingDirty = false;
    this._hasOwnPendingAsyncValidator = null;
    this._pendingTouched = false;
    this._onCollectionChange = () => {
    };
    this._parent = null;
    this.pristine = true;
    this.touched = false;
    this._events = new Subject();
    this.events = this._events.asObservable();
    this._onDisabledChange = [];
    this._assignValidators(validators);
    this._assignAsyncValidators(asyncValidators);
  }
  /**
   * Returns the function that is used to determine the validity of this control synchronously.
   * If multiple validators have been added, this will be a single composed function.
   * See `Validators.compose()` for additional information.
   */
  get validator() {
    return this._composedValidatorFn;
  }
  set validator(validatorFn) {
    this._rawValidators = this._composedValidatorFn = validatorFn;
  }
  /**
   * Returns the function that is used to determine the validity of this control asynchronously.
   * If multiple validators have been added, this will be a single composed function.
   * See `Validators.compose()` for additional information.
   */
  get asyncValidator() {
    return this._composedAsyncValidatorFn;
  }
  set asyncValidator(asyncValidatorFn) {
    this._rawAsyncValidators = this._composedAsyncValidatorFn = asyncValidatorFn;
  }
  /**
   * The parent control.
   */
  get parent() {
    return this._parent;
  }
  /**
   * A control is `valid` when its `status` is `VALID`.
   *
   * @see {@link AbstractControl.status}
   *
   * @returns True if the control has passed all of its validation tests,
   * false otherwise.
   */
  get valid() {
    return this.status === VALID;
  }
  /**
   * A control is `invalid` when its `status` is `INVALID`.
   *
   * @see {@link AbstractControl.status}
   *
   * @returns True if this control has failed one or more of its validation checks,
   * false otherwise.
   */
  get invalid() {
    return this.status === INVALID;
  }
  /**
   * A control is `pending` when its `status` is `PENDING`.
   *
   * @see {@link AbstractControl.status}
   *
   * @returns True if this control is in the process of conducting a validation check,
   * false otherwise.
   */
  get pending() {
    return this.status == PENDING;
  }
  /**
   * A control is `disabled` when its `status` is `DISABLED`.
   *
   * Disabled controls are exempt from validation checks and
   * are not included in the aggregate value of their ancestor
   * controls.
   *
   * @see {@link AbstractControl.status}
   *
   * @returns True if the control is disabled, false otherwise.
   */
  get disabled() {
    return this.status === DISABLED;
  }
  /**
   * A control is `enabled` as long as its `status` is not `DISABLED`.
   *
   * @returns True if the control has any status other than 'DISABLED',
   * false if the status is 'DISABLED'.
   *
   * @see {@link AbstractControl.status}
   *
   */
  get enabled() {
    return this.status !== DISABLED;
  }
  /**
   * A control is `dirty` if the user has changed the value
   * in the UI.
   *
   * @returns True if the user has changed the value of this control in the UI; compare `pristine`.
   * Programmatic changes to a control's value do not mark it dirty.
   */
  get dirty() {
    return !this.pristine;
  }
  /**
   * True if the control has not been marked as touched
   *
   * A control is `untouched` if the user has not yet triggered
   * a `blur` event on it.
   */
  get untouched() {
    return !this.touched;
  }
  /**
   * Reports the update strategy of the `AbstractControl` (meaning
   * the event on which the control updates itself).
   * Possible values: `'change'` | `'blur'` | `'submit'`
   * Default value: `'change'`
   */
  get updateOn() {
    return this._updateOn ? this._updateOn : this.parent ? this.parent.updateOn : "change";
  }
  /**
   * Sets the synchronous validators that are active on this control.  Calling
   * this overwrites any existing synchronous validators.
   *
   * When you add or remove a validator at run time, you must call
   * `updateValueAndValidity()` for the new validation to take effect.
   *
   * If you want to add a new validator without affecting existing ones, consider
   * using `addValidators()` method instead.
   */
  setValidators(validators) {
    this._assignValidators(validators);
  }
  /**
   * Sets the asynchronous validators that are active on this control. Calling this
   * overwrites any existing asynchronous validators.
   *
   * When you add or remove a validator at run time, you must call
   * `updateValueAndValidity()` for the new validation to take effect.
   *
   * If you want to add a new validator without affecting existing ones, consider
   * using `addAsyncValidators()` method instead.
   */
  setAsyncValidators(validators) {
    this._assignAsyncValidators(validators);
  }
  /**
   * Add a synchronous validator or validators to this control, without affecting other validators.
   *
   * When you add or remove a validator at run time, you must call
   * `updateValueAndValidity()` for the new validation to take effect.
   *
   * Adding a validator that already exists will have no effect. If duplicate validator functions
   * are present in the `validators` array, only the first instance would be added to a form
   * control.
   *
   * @param validators The new validator function or functions to add to this control.
   */
  addValidators(validators) {
    this.setValidators(addValidators(validators, this._rawValidators));
  }
  /**
   * Add an asynchronous validator or validators to this control, without affecting other
   * validators.
   *
   * When you add or remove a validator at run time, you must call
   * `updateValueAndValidity()` for the new validation to take effect.
   *
   * Adding a validator that already exists will have no effect.
   *
   * @param validators The new asynchronous validator function or functions to add to this control.
   */
  addAsyncValidators(validators) {
    this.setAsyncValidators(addValidators(validators, this._rawAsyncValidators));
  }
  /**
   * Remove a synchronous validator from this control, without affecting other validators.
   * Validators are compared by function reference; you must pass a reference to the exact same
   * validator function as the one that was originally set. If a provided validator is not found,
   * it is ignored.
   *
   * @usageNotes
   *
   * ### Reference to a ValidatorFn
   *
   * ```
   * // Reference to the RequiredValidator
   * const ctrl = new FormControl<string | null>('', Validators.required);
   * ctrl.removeValidators(Validators.required);
   *
   * // Reference to anonymous function inside MinValidator
   * const minValidator = Validators.min(3);
   * const ctrl = new FormControl<string | null>('', minValidator);
   * expect(ctrl.hasValidator(minValidator)).toEqual(true)
   * expect(ctrl.hasValidator(Validators.min(3))).toEqual(false)
   *
   * ctrl.removeValidators(minValidator);
   * ```
   *
   * When you add or remove a validator at run time, you must call
   * `updateValueAndValidity()` for the new validation to take effect.
   *
   * @param validators The validator or validators to remove.
   */
  removeValidators(validators) {
    this.setValidators(removeValidators(validators, this._rawValidators));
  }
  /**
   * Remove an asynchronous validator from this control, without affecting other validators.
   * Validators are compared by function reference; you must pass a reference to the exact same
   * validator function as the one that was originally set. If a provided validator is not found, it
   * is ignored.
   *
   * When you add or remove a validator at run time, you must call
   * `updateValueAndValidity()` for the new validation to take effect.
   *
   * @param validators The asynchronous validator or validators to remove.
   */
  removeAsyncValidators(validators) {
    this.setAsyncValidators(removeValidators(validators, this._rawAsyncValidators));
  }
  /**
   * Check whether a synchronous validator function is present on this control. The provided
   * validator must be a reference to the exact same function that was provided.
   *
   * @usageNotes
   *
   * ### Reference to a ValidatorFn
   *
   * ```
   * // Reference to the RequiredValidator
   * const ctrl = new FormControl<number | null>(0, Validators.required);
   * expect(ctrl.hasValidator(Validators.required)).toEqual(true)
   *
   * // Reference to anonymous function inside MinValidator
   * const minValidator = Validators.min(3);
   * const ctrl = new FormControl<number | null>(0, minValidator);
   * expect(ctrl.hasValidator(minValidator)).toEqual(true)
   * expect(ctrl.hasValidator(Validators.min(3))).toEqual(false)
   * ```
   *
   * @param validator The validator to check for presence. Compared by function reference.
   * @returns Whether the provided validator was found on this control.
   */
  hasValidator(validator) {
    return hasValidator(this._rawValidators, validator);
  }
  /**
   * Check whether an asynchronous validator function is present on this control. The provided
   * validator must be a reference to the exact same function that was provided.
   *
   * @param validator The asynchronous validator to check for presence. Compared by function
   *     reference.
   * @returns Whether the provided asynchronous validator was found on this control.
   */
  hasAsyncValidator(validator) {
    return hasValidator(this._rawAsyncValidators, validator);
  }
  /**
   * Empties out the synchronous validator list.
   *
   * When you add or remove a validator at run time, you must call
   * `updateValueAndValidity()` for the new validation to take effect.
   *
   */
  clearValidators() {
    this.validator = null;
  }
  /**
   * Empties out the async validator list.
   *
   * When you add or remove a validator at run time, you must call
   * `updateValueAndValidity()` for the new validation to take effect.
   *
   */
  clearAsyncValidators() {
    this.asyncValidator = null;
  }
  markAsTouched(opts = {}) {
    const changed = this.touched === false;
    this.touched = true;
    const sourceControl = opts.sourceControl ?? this;
    if (this._parent && !opts.onlySelf) {
      this._parent.markAsTouched(__spreadProps(__spreadValues({}, opts), {
        sourceControl
      }));
    }
    if (changed && opts.emitEvent !== false) {
      this._events.next(new TouchedChangeEvent(true, sourceControl));
    }
  }
  /**
   * Marks the control and all its descendant controls as `touched`.
   * @see {@link markAsTouched()}
   *
   * @param opts Configuration options that determine how the control propagates changes
   * and emits events after marking is applied.
   * * `emitEvent`: When true or not supplied (the default), the `events`
   * observable emits a `TouchedChangeEvent` with the `touched` property being `true`.
   * When false, no events are emitted.
   */
  markAllAsTouched(opts = {}) {
    this.markAsTouched({
      onlySelf: true,
      emitEvent: opts.emitEvent,
      sourceControl: this
    });
    this._forEachChild((control) => control.markAllAsTouched(opts));
  }
  markAsUntouched(opts = {}) {
    const changed = this.touched === true;
    this.touched = false;
    this._pendingTouched = false;
    const sourceControl = opts.sourceControl ?? this;
    this._forEachChild((control) => {
      control.markAsUntouched({
        onlySelf: true,
        emitEvent: opts.emitEvent,
        sourceControl
      });
    });
    if (this._parent && !opts.onlySelf) {
      this._parent._updateTouched(opts, sourceControl);
    }
    if (changed && opts.emitEvent !== false) {
      this._events.next(new TouchedChangeEvent(false, sourceControl));
    }
  }
  markAsDirty(opts = {}) {
    const changed = this.pristine === true;
    this.pristine = false;
    const sourceControl = opts.sourceControl ?? this;
    if (this._parent && !opts.onlySelf) {
      this._parent.markAsDirty(__spreadProps(__spreadValues({}, opts), {
        sourceControl
      }));
    }
    if (changed && opts.emitEvent !== false) {
      this._events.next(new PristineChangeEvent(false, sourceControl));
    }
  }
  markAsPristine(opts = {}) {
    const changed = this.pristine === false;
    this.pristine = true;
    this._pendingDirty = false;
    const sourceControl = opts.sourceControl ?? this;
    this._forEachChild((control) => {
      control.markAsPristine({
        onlySelf: true,
        emitEvent: opts.emitEvent
      });
    });
    if (this._parent && !opts.onlySelf) {
      this._parent._updatePristine(opts, sourceControl);
    }
    if (changed && opts.emitEvent !== false) {
      this._events.next(new PristineChangeEvent(true, sourceControl));
    }
  }
  markAsPending(opts = {}) {
    this.status = PENDING;
    const sourceControl = opts.sourceControl ?? this;
    if (opts.emitEvent !== false) {
      this._events.next(new StatusChangeEvent(this.status, sourceControl));
      this.statusChanges.emit(this.status);
    }
    if (this._parent && !opts.onlySelf) {
      this._parent.markAsPending(__spreadProps(__spreadValues({}, opts), {
        sourceControl
      }));
    }
  }
  disable(opts = {}) {
    const skipPristineCheck = this._parentMarkedDirty(opts.onlySelf);
    this.status = DISABLED;
    this.errors = null;
    this._forEachChild((control) => {
      control.disable(__spreadProps(__spreadValues({}, opts), {
        onlySelf: true
      }));
    });
    this._updateValue();
    const sourceControl = opts.sourceControl ?? this;
    if (opts.emitEvent !== false) {
      this._events.next(new ValueChangeEvent(this.value, sourceControl));
      this._events.next(new StatusChangeEvent(this.status, sourceControl));
      this.valueChanges.emit(this.value);
      this.statusChanges.emit(this.status);
    }
    this._updateAncestors(__spreadProps(__spreadValues({}, opts), {
      skipPristineCheck
    }), this);
    this._onDisabledChange.forEach((changeFn) => changeFn(true));
  }
  /**
   * Enables the control. This means the control is included in validation checks and
   * the aggregate value of its parent. Its status recalculates based on its value and
   * its validators.
   *
   * By default, if the control has children, all children are enabled.
   *
   * @see {@link AbstractControl.status}
   *
   * @param opts Configure options that control how the control propagates changes and
   * emits events when marked as untouched
   * * `onlySelf`: When true, mark only this control. When false or not supplied,
   * marks all direct ancestors. Default is false.
   * * `emitEvent`: When true or not supplied (the default), the `statusChanges`,
   * `valueChanges` and `events`
   * observables emit events with the latest status and value when the control is enabled.
   * When false, no events are emitted.
   */
  enable(opts = {}) {
    const skipPristineCheck = this._parentMarkedDirty(opts.onlySelf);
    this.status = VALID;
    this._forEachChild((control) => {
      control.enable(__spreadProps(__spreadValues({}, opts), {
        onlySelf: true
      }));
    });
    this.updateValueAndValidity({
      onlySelf: true,
      emitEvent: opts.emitEvent
    });
    this._updateAncestors(__spreadProps(__spreadValues({}, opts), {
      skipPristineCheck
    }), this);
    this._onDisabledChange.forEach((changeFn) => changeFn(false));
  }
  _updateAncestors(opts, sourceControl) {
    if (this._parent && !opts.onlySelf) {
      this._parent.updateValueAndValidity(opts);
      if (!opts.skipPristineCheck) {
        this._parent._updatePristine({}, sourceControl);
      }
      this._parent._updateTouched({}, sourceControl);
    }
  }
  /**
   * Sets the parent of the control
   *
   * @param parent The new parent.
   */
  setParent(parent) {
    this._parent = parent;
  }
  /**
   * The raw value of this control. For most control implementations, the raw value will include
   * disabled children.
   */
  getRawValue() {
    return this.value;
  }
  updateValueAndValidity(opts = {}) {
    this._setInitialStatus();
    this._updateValue();
    if (this.enabled) {
      const shouldHaveEmitted = this._cancelExistingSubscription();
      this.errors = this._runValidator();
      this.status = this._calculateStatus();
      if (this.status === VALID || this.status === PENDING) {
        this._runAsyncValidator(shouldHaveEmitted, opts.emitEvent);
      }
    }
    const sourceControl = opts.sourceControl ?? this;
    if (opts.emitEvent !== false) {
      this._events.next(new ValueChangeEvent(this.value, sourceControl));
      this._events.next(new StatusChangeEvent(this.status, sourceControl));
      this.valueChanges.emit(this.value);
      this.statusChanges.emit(this.status);
    }
    if (this._parent && !opts.onlySelf) {
      this._parent.updateValueAndValidity(__spreadProps(__spreadValues({}, opts), {
        sourceControl
      }));
    }
  }
  /** @internal */
  _updateTreeValidity(opts = {
    emitEvent: true
  }) {
    this._forEachChild((ctrl) => ctrl._updateTreeValidity(opts));
    this.updateValueAndValidity({
      onlySelf: true,
      emitEvent: opts.emitEvent
    });
  }
  _setInitialStatus() {
    this.status = this._allControlsDisabled() ? DISABLED : VALID;
  }
  _runValidator() {
    return this.validator ? this.validator(this) : null;
  }
  _runAsyncValidator(shouldHaveEmitted, emitEvent) {
    if (this.asyncValidator) {
      this.status = PENDING;
      this._hasOwnPendingAsyncValidator = {
        emitEvent: emitEvent !== false
      };
      const obs = toObservable(this.asyncValidator(this));
      this._asyncValidationSubscription = obs.subscribe((errors) => {
        this._hasOwnPendingAsyncValidator = null;
        this.setErrors(errors, {
          emitEvent,
          shouldHaveEmitted
        });
      });
    }
  }
  _cancelExistingSubscription() {
    if (this._asyncValidationSubscription) {
      this._asyncValidationSubscription.unsubscribe();
      const shouldHaveEmitted = this._hasOwnPendingAsyncValidator?.emitEvent ?? false;
      this._hasOwnPendingAsyncValidator = null;
      return shouldHaveEmitted;
    }
    return false;
  }
  setErrors(errors, opts = {}) {
    this.errors = errors;
    this._updateControlsErrors(opts.emitEvent !== false, this, opts.shouldHaveEmitted);
  }
  /**
   * Retrieves a child control given the control's name or path.
   *
   * @param path A dot-delimited string or array of string/number values that define the path to the
   * control. If a string is provided, passing it as a string literal will result in improved type
   * information. Likewise, if an array is provided, passing it `as const` will cause improved type
   * information to be available.
   *
   * @usageNotes
   * ### Retrieve a nested control
   *
   * For example, to get a `name` control nested within a `person` sub-group:
   *
   * * `this.form.get('person.name');`
   *
   * -OR-
   *
   * * `this.form.get(['person', 'name'] as const);` // `as const` gives improved typings
   *
   * ### Retrieve a control in a FormArray
   *
   * When accessing an element inside a FormArray, you can use an element index.
   * For example, to get a `price` control from the first element in an `items` array you can use:
   *
   * * `this.form.get('items.0.price');`
   *
   * -OR-
   *
   * * `this.form.get(['items', 0, 'price']);`
   */
  get(path) {
    let currPath = path;
    if (currPath == null) return null;
    if (!Array.isArray(currPath)) currPath = currPath.split(".");
    if (currPath.length === 0) return null;
    return currPath.reduce((control, name) => control && control._find(name), this);
  }
  /**
   * @description
   * Reports error data for the control with the given path.
   *
   * @param errorCode The code of the error to check
   * @param path A list of control names that designates how to move from the current control
   * to the control that should be queried for errors.
   *
   * @usageNotes
   * For example, for the following `FormGroup`:
   *
   * ```
   * form = new FormGroup({
   *   address: new FormGroup({ street: new FormControl() })
   * });
   * ```
   *
   * The path to the 'street' control from the root form would be 'address' -> 'street'.
   *
   * It can be provided to this method in one of two formats:
   *
   * 1. An array of string control names, e.g. `['address', 'street']`
   * 1. A period-delimited list of control names in one string, e.g. `'address.street'`
   *
   * @returns error data for that particular error. If the control or error is not present,
   * null is returned.
   */
  getError(errorCode, path) {
    const control = path ? this.get(path) : this;
    return control && control.errors ? control.errors[errorCode] : null;
  }
  /**
   * @description
   * Reports whether the control with the given path has the error specified.
   *
   * @param errorCode The code of the error to check
   * @param path A list of control names that designates how to move from the current control
   * to the control that should be queried for errors.
   *
   * @usageNotes
   * For example, for the following `FormGroup`:
   *
   * ```
   * form = new FormGroup({
   *   address: new FormGroup({ street: new FormControl() })
   * });
   * ```
   *
   * The path to the 'street' control from the root form would be 'address' -> 'street'.
   *
   * It can be provided to this method in one of two formats:
   *
   * 1. An array of string control names, e.g. `['address', 'street']`
   * 1. A period-delimited list of control names in one string, e.g. `'address.street'`
   *
   * If no path is given, this method checks for the error on the current control.
   *
   * @returns whether the given error is present in the control at the given path.
   *
   * If the control is not present, false is returned.
   */
  hasError(errorCode, path) {
    return !!this.getError(errorCode, path);
  }
  /**
   * Retrieves the top-level ancestor of this control.
   */
  get root() {
    let x = this;
    while (x._parent) {
      x = x._parent;
    }
    return x;
  }
  /** @internal */
  _updateControlsErrors(emitEvent, changedControl, shouldHaveEmitted) {
    this.status = this._calculateStatus();
    if (emitEvent) {
      this.statusChanges.emit(this.status);
    }
    if (emitEvent || shouldHaveEmitted) {
      this._events.next(new StatusChangeEvent(this.status, changedControl));
    }
    if (this._parent) {
      this._parent._updateControlsErrors(emitEvent, changedControl, shouldHaveEmitted);
    }
  }
  /** @internal */
  _initObservables() {
    this.valueChanges = new EventEmitter();
    this.statusChanges = new EventEmitter();
  }
  _calculateStatus() {
    if (this._allControlsDisabled()) return DISABLED;
    if (this.errors) return INVALID;
    if (this._hasOwnPendingAsyncValidator || this._anyControlsHaveStatus(PENDING)) return PENDING;
    if (this._anyControlsHaveStatus(INVALID)) return INVALID;
    return VALID;
  }
  /** @internal */
  _anyControlsHaveStatus(status) {
    return this._anyControls((control) => control.status === status);
  }
  /** @internal */
  _anyControlsDirty() {
    return this._anyControls((control) => control.dirty);
  }
  /** @internal */
  _anyControlsTouched() {
    return this._anyControls((control) => control.touched);
  }
  /** @internal */
  _updatePristine(opts, changedControl) {
    const newPristine = !this._anyControlsDirty();
    const changed = this.pristine !== newPristine;
    this.pristine = newPristine;
    if (this._parent && !opts.onlySelf) {
      this._parent._updatePristine(opts, changedControl);
    }
    if (changed) {
      this._events.next(new PristineChangeEvent(this.pristine, changedControl));
    }
  }
  /** @internal */
  _updateTouched(opts = {}, changedControl) {
    this.touched = this._anyControlsTouched();
    this._events.next(new TouchedChangeEvent(this.touched, changedControl));
    if (this._parent && !opts.onlySelf) {
      this._parent._updateTouched(opts, changedControl);
    }
  }
  /** @internal */
  _registerOnCollectionChange(fn) {
    this._onCollectionChange = fn;
  }
  /** @internal */
  _setUpdateStrategy(opts) {
    if (isOptionsObj(opts) && opts.updateOn != null) {
      this._updateOn = opts.updateOn;
    }
  }
  /**
   * Check to see if parent has been marked artificially dirty.
   *
   * @internal
   */
  _parentMarkedDirty(onlySelf) {
    const parentDirty = this._parent && this._parent.dirty;
    return !onlySelf && !!parentDirty && !this._parent._anyControlsDirty();
  }
  /** @internal */
  _find(name) {
    return null;
  }
  /**
   * Internal implementation of the `setValidators` method. Needs to be separated out into a
   * different method, because it is called in the constructor and it can break cases where
   * a control is extended.
   */
  _assignValidators(validators) {
    this._rawValidators = Array.isArray(validators) ? validators.slice() : validators;
    this._composedValidatorFn = coerceToValidator(this._rawValidators);
  }
  /**
   * Internal implementation of the `setAsyncValidators` method. Needs to be separated out into a
   * different method, because it is called in the constructor and it can break cases where
   * a control is extended.
   */
  _assignAsyncValidators(validators) {
    this._rawAsyncValidators = Array.isArray(validators) ? validators.slice() : validators;
    this._composedAsyncValidatorFn = coerceToAsyncValidator(this._rawAsyncValidators);
  }
};
var FormGroup = class extends AbstractControl {
  /**
   * Creates a new `FormGroup` instance.
   *
   * @param controls A collection of child controls. The key for each child is the name
   * under which it is registered.
   *
   * @param validatorOrOpts A synchronous validator function, or an array of
   * such functions, or an `AbstractControlOptions` object that contains validation functions
   * and a validation trigger.
   *
   * @param asyncValidator A single async validator or array of async validator functions
   *
   */
  constructor(controls, validatorOrOpts, asyncValidator) {
    super(pickValidators(validatorOrOpts), pickAsyncValidators(asyncValidator, validatorOrOpts));
    (typeof ngDevMode === "undefined" || ngDevMode) && validateFormGroupControls(controls);
    this.controls = controls;
    this._initObservables();
    this._setUpdateStrategy(validatorOrOpts);
    this._setUpControls();
    this.updateValueAndValidity({
      onlySelf: true,
      // If `asyncValidator` is present, it will trigger control status change from `PENDING` to
      // `VALID` or `INVALID`. The status should be broadcasted via the `statusChanges` observable,
      // so we set `emitEvent` to `true` to allow that during the control creation process.
      emitEvent: !!this.asyncValidator
    });
  }
  registerControl(name, control) {
    if (this.controls[name]) return this.controls[name];
    this.controls[name] = control;
    control.setParent(this);
    control._registerOnCollectionChange(this._onCollectionChange);
    return control;
  }
  addControl(name, control, options = {}) {
    this.registerControl(name, control);
    this.updateValueAndValidity({
      emitEvent: options.emitEvent
    });
    this._onCollectionChange();
  }
  /**
   * Remove a control from this group. In a strongly-typed group, required controls cannot be
   * removed.
   *
   * This method also updates the value and validity of the control.
   *
   * @param name The control name to remove from the collection
   * @param options Specifies whether this FormGroup instance should emit events after a
   *     control is removed.
   * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
   * `valueChanges` observables emit events with the latest status and value when the control is
   * removed. When false, no events are emitted.
   */
  removeControl(name, options = {}) {
    if (this.controls[name]) this.controls[name]._registerOnCollectionChange(() => {
    });
    delete this.controls[name];
    this.updateValueAndValidity({
      emitEvent: options.emitEvent
    });
    this._onCollectionChange();
  }
  setControl(name, control, options = {}) {
    if (this.controls[name]) this.controls[name]._registerOnCollectionChange(() => {
    });
    delete this.controls[name];
    if (control) this.registerControl(name, control);
    this.updateValueAndValidity({
      emitEvent: options.emitEvent
    });
    this._onCollectionChange();
  }
  contains(controlName) {
    return this.controls.hasOwnProperty(controlName) && this.controls[controlName].enabled;
  }
  /**
   * Sets the value of the `FormGroup`. It accepts an object that matches
   * the structure of the group, with control names as keys.
   *
   * @usageNotes
   * ### Set the complete value for the form group
   *
   * ```
   * const form = new FormGroup({
   *   first: new FormControl(),
   *   last: new FormControl()
   * });
   *
   * console.log(form.value);   // {first: null, last: null}
   *
   * form.setValue({first: 'Nancy', last: 'Drew'});
   * console.log(form.value);   // {first: 'Nancy', last: 'Drew'}
   * ```
   *
   * @throws When strict checks fail, such as setting the value of a control
   * that doesn't exist or if you exclude a value of a control that does exist.
   *
   * @param value The new value for the control that matches the structure of the group.
   * @param options Configuration options that determine how the control propagates changes
   * and emits events after the value changes.
   * The configuration options are passed to the {@link AbstractControl#updateValueAndValidity
   * updateValueAndValidity} method.
   *
   * * `onlySelf`: When true, each change only affects this control, and not its parent. Default is
   * false.
   * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
   * `valueChanges`
   * observables emit events with the latest status and value when the control value is updated.
   * When false, no events are emitted.
   */
  setValue(value, options = {}) {
    assertAllValuesPresent(this, true, value);
    Object.keys(value).forEach((name) => {
      assertControlPresent(this, true, name);
      this.controls[name].setValue(value[name], {
        onlySelf: true,
        emitEvent: options.emitEvent
      });
    });
    this.updateValueAndValidity(options);
  }
  /**
   * Patches the value of the `FormGroup`. It accepts an object with control
   * names as keys, and does its best to match the values to the correct controls
   * in the group.
   *
   * It accepts both super-sets and sub-sets of the group without throwing an error.
   *
   * @usageNotes
   * ### Patch the value for a form group
   *
   * ```
   * const form = new FormGroup({
   *    first: new FormControl(),
   *    last: new FormControl()
   * });
   * console.log(form.value);   // {first: null, last: null}
   *
   * form.patchValue({first: 'Nancy'});
   * console.log(form.value);   // {first: 'Nancy', last: null}
   * ```
   *
   * @param value The object that matches the structure of the group.
   * @param options Configuration options that determine how the control propagates changes and
   * emits events after the value is patched.
   * * `onlySelf`: When true, each change only affects this control and not its parent. Default is
   * true.
   * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
   * `valueChanges` observables emit events with the latest status and value when the control value
   * is updated. When false, no events are emitted. The configuration options are passed to
   * the {@link AbstractControl#updateValueAndValidity updateValueAndValidity} method.
   */
  patchValue(value, options = {}) {
    if (value == null) return;
    Object.keys(value).forEach((name) => {
      const control = this.controls[name];
      if (control) {
        control.patchValue(
          /* Guaranteed to be present, due to the outer forEach. */
          value[name],
          {
            onlySelf: true,
            emitEvent: options.emitEvent
          }
        );
      }
    });
    this.updateValueAndValidity(options);
  }
  /**
   * Resets the `FormGroup`, marks all descendants `pristine` and `untouched` and sets
   * the value of all descendants to their default values, or null if no defaults were provided.
   *
   * You reset to a specific form state by passing in a map of states
   * that matches the structure of your form, with control names as keys. The state
   * is a standalone value or a form state object with both a value and a disabled
   * status.
   *
   * @param value Resets the control with an initial value,
   * or an object that defines the initial value and disabled state.
   *
   * @param options Configuration options that determine how the control propagates changes
   * and emits events when the group is reset.
   * * `onlySelf`: When true, each change only affects this control, and not its parent. Default is
   * false.
   * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
   * `valueChanges`
   * observables emit events with the latest status and value when the control is reset.
   * When false, no events are emitted.
   * The configuration options are passed to the {@link AbstractControl#updateValueAndValidity
   * updateValueAndValidity} method.
   *
   * @usageNotes
   *
   * ### Reset the form group values
   *
   * ```ts
   * const form = new FormGroup({
   *   first: new FormControl('first name'),
   *   last: new FormControl('last name')
   * });
   *
   * console.log(form.value);  // {first: 'first name', last: 'last name'}
   *
   * form.reset({ first: 'name', last: 'last name' });
   *
   * console.log(form.value);  // {first: 'name', last: 'last name'}
   * ```
   *
   * ### Reset the form group values and disabled status
   *
   * ```
   * const form = new FormGroup({
   *   first: new FormControl('first name'),
   *   last: new FormControl('last name')
   * });
   *
   * form.reset({
   *   first: {value: 'name', disabled: true},
   *   last: 'last'
   * });
   *
   * console.log(form.value);  // {last: 'last'}
   * console.log(form.get('first').status);  // 'DISABLED'
   * ```
   */
  reset(value = {}, options = {}) {
    this._forEachChild((control, name) => {
      control.reset(value ? value[name] : null, {
        onlySelf: true,
        emitEvent: options.emitEvent
      });
    });
    this._updatePristine(options, this);
    this._updateTouched(options, this);
    this.updateValueAndValidity(options);
  }
  /**
   * The aggregate value of the `FormGroup`, including any disabled controls.
   *
   * Retrieves all values regardless of disabled status.
   */
  getRawValue() {
    return this._reduceChildren({}, (acc, control, name) => {
      acc[name] = control.getRawValue();
      return acc;
    });
  }
  /** @internal */
  _syncPendingControls() {
    let subtreeUpdated = this._reduceChildren(false, (updated, child) => {
      return child._syncPendingControls() ? true : updated;
    });
    if (subtreeUpdated) this.updateValueAndValidity({
      onlySelf: true
    });
    return subtreeUpdated;
  }
  /** @internal */
  _forEachChild(cb) {
    Object.keys(this.controls).forEach((key) => {
      const control = this.controls[key];
      control && cb(control, key);
    });
  }
  /** @internal */
  _setUpControls() {
    this._forEachChild((control) => {
      control.setParent(this);
      control._registerOnCollectionChange(this._onCollectionChange);
    });
  }
  /** @internal */
  _updateValue() {
    this.value = this._reduceValue();
  }
  /** @internal */
  _anyControls(condition) {
    for (const [controlName, control] of Object.entries(this.controls)) {
      if (this.contains(controlName) && condition(control)) {
        return true;
      }
    }
    return false;
  }
  /** @internal */
  _reduceValue() {
    let acc = {};
    return this._reduceChildren(acc, (acc2, control, name) => {
      if (control.enabled || this.disabled) {
        acc2[name] = control.value;
      }
      return acc2;
    });
  }
  /** @internal */
  _reduceChildren(initValue, fn) {
    let res = initValue;
    this._forEachChild((control, name) => {
      res = fn(res, control, name);
    });
    return res;
  }
  /** @internal */
  _allControlsDisabled() {
    for (const controlName of Object.keys(this.controls)) {
      if (this.controls[controlName].enabled) {
        return false;
      }
    }
    return Object.keys(this.controls).length > 0 || this.disabled;
  }
  /** @internal */
  _find(name) {
    return this.controls.hasOwnProperty(name) ? this.controls[name] : null;
  }
};
function validateFormGroupControls(controls) {
  const invalidKeys = Object.keys(controls).filter((key) => key.includes("."));
  if (invalidKeys.length > 0) {
    console.warn(`FormGroup keys cannot include \`.\`, please replace the keys for: ${invalidKeys.join(",")}.`);
  }
}
var FormRecord = class extends FormGroup {
};
var CALL_SET_DISABLED_STATE = new InjectionToken("CallSetDisabledState", {
  providedIn: "root",
  factory: () => setDisabledStateDefault
});
var setDisabledStateDefault = "always";
function controlPath(name, parent) {
  return [...parent.path, name];
}
function setUpControl(control, dir, callSetDisabledState = setDisabledStateDefault) {
  if (typeof ngDevMode === "undefined" || ngDevMode) {
    if (!control) _throwError(dir, "Cannot find control with");
    if (!dir.valueAccessor) _throwMissingValueAccessorError(dir);
  }
  setUpValidators(control, dir);
  dir.valueAccessor.writeValue(control.value);
  if (control.disabled || callSetDisabledState === "always") {
    dir.valueAccessor.setDisabledState?.(control.disabled);
  }
  setUpViewChangePipeline(control, dir);
  setUpModelChangePipeline(control, dir);
  setUpBlurPipeline(control, dir);
  setUpDisabledChangeHandler(control, dir);
}
function cleanUpControl(control, dir, validateControlPresenceOnChange = true) {
  const noop5 = () => {
    if (validateControlPresenceOnChange && (typeof ngDevMode === "undefined" || ngDevMode)) {
      _noControlError(dir);
    }
  };
  if (dir.valueAccessor) {
    dir.valueAccessor.registerOnChange(noop5);
    dir.valueAccessor.registerOnTouched(noop5);
  }
  cleanUpValidators(control, dir);
  if (control) {
    dir._invokeOnDestroyCallbacks();
    control._registerOnCollectionChange(() => {
    });
  }
}
function registerOnValidatorChange(validators, onChange2) {
  validators.forEach((validator) => {
    if (validator.registerOnValidatorChange) validator.registerOnValidatorChange(onChange2);
  });
}
function setUpDisabledChangeHandler(control, dir) {
  if (dir.valueAccessor.setDisabledState) {
    const onDisabledChange = (isDisabled) => {
      dir.valueAccessor.setDisabledState(isDisabled);
    };
    control.registerOnDisabledChange(onDisabledChange);
    dir._registerOnDestroy(() => {
      control._unregisterOnDisabledChange(onDisabledChange);
    });
  }
}
function setUpValidators(control, dir) {
  const validators = getControlValidators(control);
  if (dir.validator !== null) {
    control.setValidators(mergeValidators(validators, dir.validator));
  } else if (typeof validators === "function") {
    control.setValidators([validators]);
  }
  const asyncValidators = getControlAsyncValidators(control);
  if (dir.asyncValidator !== null) {
    control.setAsyncValidators(mergeValidators(asyncValidators, dir.asyncValidator));
  } else if (typeof asyncValidators === "function") {
    control.setAsyncValidators([asyncValidators]);
  }
  const onValidatorChange = () => control.updateValueAndValidity();
  registerOnValidatorChange(dir._rawValidators, onValidatorChange);
  registerOnValidatorChange(dir._rawAsyncValidators, onValidatorChange);
}
function cleanUpValidators(control, dir) {
  let isControlUpdated = false;
  if (control !== null) {
    if (dir.validator !== null) {
      const validators = getControlValidators(control);
      if (Array.isArray(validators) && validators.length > 0) {
        const updatedValidators = validators.filter((validator) => validator !== dir.validator);
        if (updatedValidators.length !== validators.length) {
          isControlUpdated = true;
          control.setValidators(updatedValidators);
        }
      }
    }
    if (dir.asyncValidator !== null) {
      const asyncValidators = getControlAsyncValidators(control);
      if (Array.isArray(asyncValidators) && asyncValidators.length > 0) {
        const updatedAsyncValidators = asyncValidators.filter((asyncValidator) => asyncValidator !== dir.asyncValidator);
        if (updatedAsyncValidators.length !== asyncValidators.length) {
          isControlUpdated = true;
          control.setAsyncValidators(updatedAsyncValidators);
        }
      }
    }
  }
  const noop5 = () => {
  };
  registerOnValidatorChange(dir._rawValidators, noop5);
  registerOnValidatorChange(dir._rawAsyncValidators, noop5);
  return isControlUpdated;
}
function setUpViewChangePipeline(control, dir) {
  dir.valueAccessor.registerOnChange((newValue) => {
    control._pendingValue = newValue;
    control._pendingChange = true;
    control._pendingDirty = true;
    if (control.updateOn === "change") updateControl(control, dir);
  });
}
function setUpBlurPipeline(control, dir) {
  dir.valueAccessor.registerOnTouched(() => {
    control._pendingTouched = true;
    if (control.updateOn === "blur" && control._pendingChange) updateControl(control, dir);
    if (control.updateOn !== "submit") control.markAsTouched();
  });
}
function updateControl(control, dir) {
  if (control._pendingDirty) control.markAsDirty();
  control.setValue(control._pendingValue, {
    emitModelToViewChange: false
  });
  dir.viewToModelUpdate(control._pendingValue);
  control._pendingChange = false;
}
function setUpModelChangePipeline(control, dir) {
  const onChange2 = (newValue, emitModelEvent) => {
    dir.valueAccessor.writeValue(newValue);
    if (emitModelEvent) dir.viewToModelUpdate(newValue);
  };
  control.registerOnChange(onChange2);
  dir._registerOnDestroy(() => {
    control._unregisterOnChange(onChange2);
  });
}
function setUpFormContainer(control, dir) {
  if (control == null && (typeof ngDevMode === "undefined" || ngDevMode)) _throwError(dir, "Cannot find control with");
  setUpValidators(control, dir);
}
function cleanUpFormContainer(control, dir) {
  return cleanUpValidators(control, dir);
}
function _noControlError(dir) {
  return _throwError(dir, "There is no FormControl instance attached to form control element with");
}
function _throwError(dir, message) {
  const messageEnd = _describeControlLocation(dir);
  throw new Error(`${message} ${messageEnd}`);
}
function _describeControlLocation(dir) {
  const path = dir.path;
  if (path && path.length > 1) return `path: '${path.join(" -> ")}'`;
  if (path?.[0]) return `name: '${path}'`;
  return "unspecified name attribute";
}
function _throwMissingValueAccessorError(dir) {
  const loc = _describeControlLocation(dir);
  throw new RuntimeError(-1203, `No value accessor for form control ${loc}.`);
}
function _throwInvalidValueAccessorError(dir) {
  const loc = _describeControlLocation(dir);
  throw new RuntimeError(1200, `Value accessor was not provided as an array for form control with ${loc}. Check that the \`NG_VALUE_ACCESSOR\` token is configured as a \`multi: true\` provider.`);
}
function isPropertyUpdated(changes, viewModel) {
  if (!changes.hasOwnProperty("model")) return false;
  const change = changes["model"];
  if (change.isFirstChange()) return true;
  return !Object.is(viewModel, change.currentValue);
}
function isBuiltInAccessor(valueAccessor) {
  return Object.getPrototypeOf(valueAccessor.constructor) === BuiltInControlValueAccessor;
}
function syncPendingControls(form, directives) {
  form._syncPendingControls();
  directives.forEach((dir) => {
    const control = dir.control;
    if (control.updateOn === "submit" && control._pendingChange) {
      dir.viewToModelUpdate(control._pendingValue);
      control._pendingChange = false;
    }
  });
}
function selectValueAccessor(dir, valueAccessors) {
  if (!valueAccessors) return null;
  if (!Array.isArray(valueAccessors) && (typeof ngDevMode === "undefined" || ngDevMode)) _throwInvalidValueAccessorError(dir);
  let defaultAccessor = void 0;
  let builtinAccessor = void 0;
  let customAccessor = void 0;
  valueAccessors.forEach((v) => {
    if (v.constructor === DefaultValueAccessor) {
      defaultAccessor = v;
    } else if (isBuiltInAccessor(v)) {
      if (builtinAccessor && (typeof ngDevMode === "undefined" || ngDevMode)) _throwError(dir, "More than one built-in value accessor matches form control with");
      builtinAccessor = v;
    } else {
      if (customAccessor && (typeof ngDevMode === "undefined" || ngDevMode)) _throwError(dir, "More than one custom value accessor matches form control with");
      customAccessor = v;
    }
  });
  if (customAccessor) return customAccessor;
  if (builtinAccessor) return builtinAccessor;
  if (defaultAccessor) return defaultAccessor;
  if (typeof ngDevMode === "undefined" || ngDevMode) {
    _throwError(dir, "No valid value accessor for form control with");
  }
  return null;
}
function removeListItem$1(list, el) {
  const index = list.indexOf(el);
  if (index > -1) list.splice(index, 1);
}
function _ngModelWarning(name, type, instance, warningConfig) {
  if (warningConfig === "never") return;
  if ((warningConfig === null || warningConfig === "once") && !type._ngModelWarningSentOnce || warningConfig === "always" && !instance._ngModelWarningSent) {
    console.warn(ngModelWarning(name));
    type._ngModelWarningSentOnce = true;
    instance._ngModelWarningSent = true;
  }
}
var formDirectiveProvider$1 = {
  provide: ControlContainer,
  useExisting: forwardRef(() => NgForm)
};
var resolvedPromise$1 = (() => Promise.resolve())();
var _NgForm = class _NgForm extends ControlContainer {
  constructor(validators, asyncValidators, callSetDisabledState) {
    super();
    this.callSetDisabledState = callSetDisabledState;
    this.submitted = false;
    this._directives = /* @__PURE__ */ new Set();
    this.ngSubmit = new EventEmitter();
    this.form = new FormGroup({}, composeValidators(validators), composeAsyncValidators(asyncValidators));
  }
  /** @nodoc */
  ngAfterViewInit() {
    this._setUpdateStrategy();
  }
  /**
   * @description
   * The directive instance.
   */
  get formDirective() {
    return this;
  }
  /**
   * @description
   * The internal `FormGroup` instance.
   */
  get control() {
    return this.form;
  }
  /**
   * @description
   * Returns an array representing the path to this group. Because this directive
   * always lives at the top level of a form, it is always an empty array.
   */
  get path() {
    return [];
  }
  /**
   * @description
   * Returns a map of the controls in this group.
   */
  get controls() {
    return this.form.controls;
  }
  /**
   * @description
   * Method that sets up the control directive in this group, re-calculates its value
   * and validity, and adds the instance to the internal list of directives.
   *
   * @param dir The `NgModel` directive instance.
   */
  addControl(dir) {
    resolvedPromise$1.then(() => {
      const container = this._findContainer(dir.path);
      dir.control = container.registerControl(dir.name, dir.control);
      setUpControl(dir.control, dir, this.callSetDisabledState);
      dir.control.updateValueAndValidity({
        emitEvent: false
      });
      this._directives.add(dir);
    });
  }
  /**
   * @description
   * Retrieves the `FormControl` instance from the provided `NgModel` directive.
   *
   * @param dir The `NgModel` directive instance.
   */
  getControl(dir) {
    return this.form.get(dir.path);
  }
  /**
   * @description
   * Removes the `NgModel` instance from the internal list of directives
   *
   * @param dir The `NgModel` directive instance.
   */
  removeControl(dir) {
    resolvedPromise$1.then(() => {
      const container = this._findContainer(dir.path);
      if (container) {
        container.removeControl(dir.name);
      }
      this._directives.delete(dir);
    });
  }
  /**
   * @description
   * Adds a new `NgModelGroup` directive instance to the form.
   *
   * @param dir The `NgModelGroup` directive instance.
   */
  addFormGroup(dir) {
    resolvedPromise$1.then(() => {
      const container = this._findContainer(dir.path);
      const group = new FormGroup({});
      setUpFormContainer(group, dir);
      container.registerControl(dir.name, group);
      group.updateValueAndValidity({
        emitEvent: false
      });
    });
  }
  /**
   * @description
   * Removes the `NgModelGroup` directive instance from the form.
   *
   * @param dir The `NgModelGroup` directive instance.
   */
  removeFormGroup(dir) {
    resolvedPromise$1.then(() => {
      const container = this._findContainer(dir.path);
      if (container) {
        container.removeControl(dir.name);
      }
    });
  }
  /**
   * @description
   * Retrieves the `FormGroup` for a provided `NgModelGroup` directive instance
   *
   * @param dir The `NgModelGroup` directive instance.
   */
  getFormGroup(dir) {
    return this.form.get(dir.path);
  }
  /**
   * Sets the new value for the provided `NgControl` directive.
   *
   * @param dir The `NgControl` directive instance.
   * @param value The new value for the directive's control.
   */
  updateModel(dir, value) {
    resolvedPromise$1.then(() => {
      const ctrl = this.form.get(dir.path);
      ctrl.setValue(value);
    });
  }
  /**
   * @description
   * Sets the value for this `FormGroup`.
   *
   * @param value The new value
   */
  setValue(value) {
    this.control.setValue(value);
  }
  /**
   * @description
   * Method called when the "submit" event is triggered on the form.
   * Triggers the `ngSubmit` emitter to emit the "submit" event as its payload.
   *
   * @param $event The "submit" event object
   */
  onSubmit($event) {
    this.submitted = true;
    syncPendingControls(this.form, this._directives);
    this.ngSubmit.emit($event);
    return $event?.target?.method === "dialog";
  }
  /**
   * @description
   * Method called when the "reset" event is triggered on the form.
   */
  onReset() {
    this.resetForm();
  }
  /**
   * @description
   * Resets the form to an initial value and resets its submitted status.
   *
   * @param value The new value for the form.
   */
  resetForm(value = void 0) {
    this.form.reset(value);
    this.submitted = false;
  }
  _setUpdateStrategy() {
    if (this.options && this.options.updateOn != null) {
      this.form._updateOn = this.options.updateOn;
    }
  }
  _findContainer(path) {
    path.pop();
    return path.length ? this.form.get(path) : this.form;
  }
};
_NgForm.\u0275fac = function NgForm_Factory(t) {
  return new (t || _NgForm)(\u0275\u0275directiveInject(NG_VALIDATORS, 10), \u0275\u0275directiveInject(NG_ASYNC_VALIDATORS, 10), \u0275\u0275directiveInject(CALL_SET_DISABLED_STATE, 8));
};
_NgForm.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
  type: _NgForm,
  selectors: [["form", 3, "ngNoForm", "", 3, "formGroup", ""], ["ng-form"], ["", "ngForm", ""]],
  hostBindings: function NgForm_HostBindings(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275listener("submit", function NgForm_submit_HostBindingHandler($event) {
        return ctx.onSubmit($event);
      })("reset", function NgForm_reset_HostBindingHandler() {
        return ctx.onReset();
      });
    }
  },
  inputs: {
    options: [0, "ngFormOptions", "options"]
  },
  outputs: {
    ngSubmit: "ngSubmit"
  },
  exportAs: ["ngForm"],
  features: [\u0275\u0275ProvidersFeature([formDirectiveProvider$1]), \u0275\u0275InheritDefinitionFeature]
});
var NgForm = _NgForm;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NgForm, [{
    type: Directive,
    args: [{
      selector: "form:not([ngNoForm]):not([formGroup]),ng-form,[ngForm]",
      providers: [formDirectiveProvider$1],
      host: {
        "(submit)": "onSubmit($event)",
        "(reset)": "onReset()"
      },
      outputs: ["ngSubmit"],
      exportAs: "ngForm"
    }]
  }], () => [{
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Self
    }, {
      type: Inject,
      args: [NG_VALIDATORS]
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Self
    }, {
      type: Inject,
      args: [NG_ASYNC_VALIDATORS]
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [CALL_SET_DISABLED_STATE]
    }]
  }], {
    options: [{
      type: Input,
      args: ["ngFormOptions"]
    }]
  });
})();
function removeListItem(list, el) {
  const index = list.indexOf(el);
  if (index > -1) list.splice(index, 1);
}
function isFormControlState(formState) {
  return typeof formState === "object" && formState !== null && Object.keys(formState).length === 2 && "value" in formState && "disabled" in formState;
}
var FormControl = class FormControl2 extends AbstractControl {
  constructor(formState = null, validatorOrOpts, asyncValidator) {
    super(pickValidators(validatorOrOpts), pickAsyncValidators(asyncValidator, validatorOrOpts));
    this.defaultValue = null;
    this._onChange = [];
    this._pendingChange = false;
    this._applyFormState(formState);
    this._setUpdateStrategy(validatorOrOpts);
    this._initObservables();
    this.updateValueAndValidity({
      onlySelf: true,
      // If `asyncValidator` is present, it will trigger control status change from `PENDING` to
      // `VALID` or `INVALID`.
      // The status should be broadcasted via the `statusChanges` observable, so we set
      // `emitEvent` to `true` to allow that during the control creation process.
      emitEvent: !!this.asyncValidator
    });
    if (isOptionsObj(validatorOrOpts) && (validatorOrOpts.nonNullable || validatorOrOpts.initialValueIsDefault)) {
      if (isFormControlState(formState)) {
        this.defaultValue = formState.value;
      } else {
        this.defaultValue = formState;
      }
    }
  }
  setValue(value, options = {}) {
    this.value = this._pendingValue = value;
    if (this._onChange.length && options.emitModelToViewChange !== false) {
      this._onChange.forEach((changeFn) => changeFn(this.value, options.emitViewToModelChange !== false));
    }
    this.updateValueAndValidity(options);
  }
  patchValue(value, options = {}) {
    this.setValue(value, options);
  }
  reset(formState = this.defaultValue, options = {}) {
    this._applyFormState(formState);
    this.markAsPristine(options);
    this.markAsUntouched(options);
    this.setValue(this.value, options);
    this._pendingChange = false;
  }
  /**  @internal */
  _updateValue() {
  }
  /**  @internal */
  _anyControls(condition) {
    return false;
  }
  /**  @internal */
  _allControlsDisabled() {
    return this.disabled;
  }
  registerOnChange(fn) {
    this._onChange.push(fn);
  }
  /** @internal */
  _unregisterOnChange(fn) {
    removeListItem(this._onChange, fn);
  }
  registerOnDisabledChange(fn) {
    this._onDisabledChange.push(fn);
  }
  /** @internal */
  _unregisterOnDisabledChange(fn) {
    removeListItem(this._onDisabledChange, fn);
  }
  /** @internal */
  _forEachChild(cb) {
  }
  /** @internal */
  _syncPendingControls() {
    if (this.updateOn === "submit") {
      if (this._pendingDirty) this.markAsDirty();
      if (this._pendingTouched) this.markAsTouched();
      if (this._pendingChange) {
        this.setValue(this._pendingValue, {
          onlySelf: true,
          emitModelToViewChange: false
        });
        return true;
      }
    }
    return false;
  }
  _applyFormState(formState) {
    if (isFormControlState(formState)) {
      this.value = this._pendingValue = formState.value;
      formState.disabled ? this.disable({
        onlySelf: true,
        emitEvent: false
      }) : this.enable({
        onlySelf: true,
        emitEvent: false
      });
    } else {
      this.value = this._pendingValue = formState;
    }
  }
};
var isFormControl = (control) => control instanceof FormControl;
var _AbstractFormGroupDirective = class _AbstractFormGroupDirective extends ControlContainer {
  /** @nodoc */
  ngOnInit() {
    this._checkParentType();
    this.formDirective.addFormGroup(this);
  }
  /** @nodoc */
  ngOnDestroy() {
    if (this.formDirective) {
      this.formDirective.removeFormGroup(this);
    }
  }
  /**
   * @description
   * The `FormGroup` bound to this directive.
   */
  get control() {
    return this.formDirective.getFormGroup(this);
  }
  /**
   * @description
   * The path to this group from the top-level directive.
   */
  get path() {
    return controlPath(this.name == null ? this.name : this.name.toString(), this._parent);
  }
  /**
   * @description
   * The top-level directive for this group if present, otherwise null.
   */
  get formDirective() {
    return this._parent ? this._parent.formDirective : null;
  }
  /** @internal */
  _checkParentType() {
  }
};
_AbstractFormGroupDirective.\u0275fac = /* @__PURE__ */ (() => {
  let \u0275AbstractFormGroupDirective_BaseFactory;
  return function AbstractFormGroupDirective_Factory(t) {
    return (\u0275AbstractFormGroupDirective_BaseFactory || (\u0275AbstractFormGroupDirective_BaseFactory = \u0275\u0275getInheritedFactory(_AbstractFormGroupDirective)))(t || _AbstractFormGroupDirective);
  };
})();
_AbstractFormGroupDirective.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
  type: _AbstractFormGroupDirective,
  features: [\u0275\u0275InheritDefinitionFeature]
});
var AbstractFormGroupDirective = _AbstractFormGroupDirective;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AbstractFormGroupDirective, [{
    type: Directive
  }], null, null);
})();
function modelParentException() {
  return new RuntimeError(1350, `
    ngModel cannot be used to register form controls with a parent formGroup directive.  Try using
    formGroup's partner directive "formControlName" instead.  Example:

    ${formControlNameExample}

    Or, if you'd like to avoid registering this form control, indicate that it's standalone in ngModelOptions:

    Example:

    ${ngModelWithFormGroupExample}`);
}
function formGroupNameException() {
  return new RuntimeError(1351, `
    ngModel cannot be used to register form controls with a parent formGroupName or formArrayName directive.

    Option 1: Use formControlName instead of ngModel (reactive strategy):

    ${formGroupNameExample}

    Option 2:  Update ngModel's parent be ngModelGroup (template-driven strategy):

    ${ngModelGroupExample}`);
}
function missingNameException() {
  return new RuntimeError(1352, `If ngModel is used within a form tag, either the name attribute must be set or the form
    control must be defined as 'standalone' in ngModelOptions.

    Example 1: <input [(ngModel)]="person.firstName" name="first">
    Example 2: <input [(ngModel)]="person.firstName" [ngModelOptions]="{standalone: true}">`);
}
function modelGroupParentException() {
  return new RuntimeError(1353, `
    ngModelGroup cannot be used with a parent formGroup directive.

    Option 1: Use formGroupName instead of ngModelGroup (reactive strategy):

    ${formGroupNameExample}

    Option 2:  Use a regular form tag instead of the formGroup directive (template-driven strategy):

    ${ngModelGroupExample}`);
}
var modelGroupProvider = {
  provide: ControlContainer,
  useExisting: forwardRef(() => NgModelGroup)
};
var _NgModelGroup = class _NgModelGroup extends AbstractFormGroupDirective {
  constructor(parent, validators, asyncValidators) {
    super();
    this.name = "";
    this._parent = parent;
    this._setValidators(validators);
    this._setAsyncValidators(asyncValidators);
  }
  /** @internal */
  _checkParentType() {
    if (!(this._parent instanceof _NgModelGroup) && !(this._parent instanceof NgForm) && (typeof ngDevMode === "undefined" || ngDevMode)) {
      throw modelGroupParentException();
    }
  }
};
_NgModelGroup.\u0275fac = function NgModelGroup_Factory(t) {
  return new (t || _NgModelGroup)(\u0275\u0275directiveInject(ControlContainer, 5), \u0275\u0275directiveInject(NG_VALIDATORS, 10), \u0275\u0275directiveInject(NG_ASYNC_VALIDATORS, 10));
};
_NgModelGroup.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
  type: _NgModelGroup,
  selectors: [["", "ngModelGroup", ""]],
  inputs: {
    name: [0, "ngModelGroup", "name"]
  },
  exportAs: ["ngModelGroup"],
  features: [\u0275\u0275ProvidersFeature([modelGroupProvider]), \u0275\u0275InheritDefinitionFeature]
});
var NgModelGroup = _NgModelGroup;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NgModelGroup, [{
    type: Directive,
    args: [{
      selector: "[ngModelGroup]",
      providers: [modelGroupProvider],
      exportAs: "ngModelGroup"
    }]
  }], () => [{
    type: ControlContainer,
    decorators: [{
      type: Host
    }, {
      type: SkipSelf
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Self
    }, {
      type: Inject,
      args: [NG_VALIDATORS]
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Self
    }, {
      type: Inject,
      args: [NG_ASYNC_VALIDATORS]
    }]
  }], {
    name: [{
      type: Input,
      args: ["ngModelGroup"]
    }]
  });
})();
var formControlBinding$1 = {
  provide: NgControl,
  useExisting: forwardRef(() => NgModel)
};
var resolvedPromise = (() => Promise.resolve())();
var _NgModel = class _NgModel extends NgControl {
  constructor(parent, validators, asyncValidators, valueAccessors, _changeDetectorRef, callSetDisabledState) {
    super();
    this._changeDetectorRef = _changeDetectorRef;
    this.callSetDisabledState = callSetDisabledState;
    this.control = new FormControl();
    this._registered = false;
    this.name = "";
    this.update = new EventEmitter();
    this._parent = parent;
    this._setValidators(validators);
    this._setAsyncValidators(asyncValidators);
    this.valueAccessor = selectValueAccessor(this, valueAccessors);
  }
  /** @nodoc */
  ngOnChanges(changes) {
    this._checkForErrors();
    if (!this._registered || "name" in changes) {
      if (this._registered) {
        this._checkName();
        if (this.formDirective) {
          const oldName = changes["name"].previousValue;
          this.formDirective.removeControl({
            name: oldName,
            path: this._getPath(oldName)
          });
        }
      }
      this._setUpControl();
    }
    if ("isDisabled" in changes) {
      this._updateDisabled(changes);
    }
    if (isPropertyUpdated(changes, this.viewModel)) {
      this._updateValue(this.model);
      this.viewModel = this.model;
    }
  }
  /** @nodoc */
  ngOnDestroy() {
    this.formDirective && this.formDirective.removeControl(this);
  }
  /**
   * @description
   * Returns an array that represents the path from the top-level form to this control.
   * Each index is the string name of the control on that level.
   */
  get path() {
    return this._getPath(this.name);
  }
  /**
   * @description
   * The top-level directive for this control if present, otherwise null.
   */
  get formDirective() {
    return this._parent ? this._parent.formDirective : null;
  }
  /**
   * @description
   * Sets the new value for the view model and emits an `ngModelChange` event.
   *
   * @param newValue The new value emitted by `ngModelChange`.
   */
  viewToModelUpdate(newValue) {
    this.viewModel = newValue;
    this.update.emit(newValue);
  }
  _setUpControl() {
    this._setUpdateStrategy();
    this._isStandalone() ? this._setUpStandalone() : this.formDirective.addControl(this);
    this._registered = true;
  }
  _setUpdateStrategy() {
    if (this.options && this.options.updateOn != null) {
      this.control._updateOn = this.options.updateOn;
    }
  }
  _isStandalone() {
    return !this._parent || !!(this.options && this.options.standalone);
  }
  _setUpStandalone() {
    setUpControl(this.control, this, this.callSetDisabledState);
    this.control.updateValueAndValidity({
      emitEvent: false
    });
  }
  _checkForErrors() {
    if (!this._isStandalone()) {
      this._checkParentType();
    }
    this._checkName();
  }
  _checkParentType() {
    if (typeof ngDevMode === "undefined" || ngDevMode) {
      if (!(this._parent instanceof NgModelGroup) && this._parent instanceof AbstractFormGroupDirective) {
        throw formGroupNameException();
      } else if (!(this._parent instanceof NgModelGroup) && !(this._parent instanceof NgForm)) {
        throw modelParentException();
      }
    }
  }
  _checkName() {
    if (this.options && this.options.name) this.name = this.options.name;
    if (!this._isStandalone() && !this.name && (typeof ngDevMode === "undefined" || ngDevMode)) {
      throw missingNameException();
    }
  }
  _updateValue(value) {
    resolvedPromise.then(() => {
      this.control.setValue(value, {
        emitViewToModelChange: false
      });
      this._changeDetectorRef?.markForCheck();
    });
  }
  _updateDisabled(changes) {
    const disabledValue = changes["isDisabled"].currentValue;
    const isDisabled = disabledValue !== 0 && booleanAttribute(disabledValue);
    resolvedPromise.then(() => {
      if (isDisabled && !this.control.disabled) {
        this.control.disable();
      } else if (!isDisabled && this.control.disabled) {
        this.control.enable();
      }
      this._changeDetectorRef?.markForCheck();
    });
  }
  _getPath(controlName) {
    return this._parent ? controlPath(controlName, this._parent) : [controlName];
  }
};
_NgModel.\u0275fac = function NgModel_Factory(t) {
  return new (t || _NgModel)(\u0275\u0275directiveInject(ControlContainer, 9), \u0275\u0275directiveInject(NG_VALIDATORS, 10), \u0275\u0275directiveInject(NG_ASYNC_VALIDATORS, 10), \u0275\u0275directiveInject(NG_VALUE_ACCESSOR, 10), \u0275\u0275directiveInject(ChangeDetectorRef, 8), \u0275\u0275directiveInject(CALL_SET_DISABLED_STATE, 8));
};
_NgModel.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
  type: _NgModel,
  selectors: [["", "ngModel", "", 3, "formControlName", "", 3, "formControl", ""]],
  inputs: {
    name: "name",
    isDisabled: [0, "disabled", "isDisabled"],
    model: [0, "ngModel", "model"],
    options: [0, "ngModelOptions", "options"]
  },
  outputs: {
    update: "ngModelChange"
  },
  exportAs: ["ngModel"],
  features: [\u0275\u0275ProvidersFeature([formControlBinding$1]), \u0275\u0275InheritDefinitionFeature, \u0275\u0275NgOnChangesFeature]
});
var NgModel = _NgModel;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NgModel, [{
    type: Directive,
    args: [{
      selector: "[ngModel]:not([formControlName]):not([formControl])",
      providers: [formControlBinding$1],
      exportAs: "ngModel"
    }]
  }], () => [{
    type: ControlContainer,
    decorators: [{
      type: Optional
    }, {
      type: Host
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Self
    }, {
      type: Inject,
      args: [NG_VALIDATORS]
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Self
    }, {
      type: Inject,
      args: [NG_ASYNC_VALIDATORS]
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Self
    }, {
      type: Inject,
      args: [NG_VALUE_ACCESSOR]
    }]
  }, {
    type: ChangeDetectorRef,
    decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [ChangeDetectorRef]
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [CALL_SET_DISABLED_STATE]
    }]
  }], {
    name: [{
      type: Input
    }],
    isDisabled: [{
      type: Input,
      args: ["disabled"]
    }],
    model: [{
      type: Input,
      args: ["ngModel"]
    }],
    options: [{
      type: Input,
      args: ["ngModelOptions"]
    }],
    update: [{
      type: Output,
      args: ["ngModelChange"]
    }]
  });
})();
var _\u0275NgNoValidate = class _\u0275NgNoValidate {
};
_\u0275NgNoValidate.\u0275fac = function \u0275NgNoValidate_Factory(t) {
  return new (t || _\u0275NgNoValidate)();
};
_\u0275NgNoValidate.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
  type: _\u0275NgNoValidate,
  selectors: [["form", 3, "ngNoForm", "", 3, "ngNativeValidate", ""]],
  hostAttrs: ["novalidate", ""]
});
var \u0275NgNoValidate = _\u0275NgNoValidate;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(\u0275NgNoValidate, [{
    type: Directive,
    args: [{
      selector: "form:not([ngNoForm]):not([ngNativeValidate])",
      host: {
        "novalidate": ""
      }
    }]
  }], null, null);
})();
var NUMBER_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => NumberValueAccessor),
  multi: true
};
var _NumberValueAccessor = class _NumberValueAccessor extends BuiltInControlValueAccessor {
  /**
   * Sets the "value" property on the input element.
   * @nodoc
   */
  writeValue(value) {
    const normalizedValue = value == null ? "" : value;
    this.setProperty("value", normalizedValue);
  }
  /**
   * Registers a function called when the control value changes.
   * @nodoc
   */
  registerOnChange(fn) {
    this.onChange = (value) => {
      fn(value == "" ? null : parseFloat(value));
    };
  }
};
_NumberValueAccessor.\u0275fac = /* @__PURE__ */ (() => {
  let \u0275NumberValueAccessor_BaseFactory;
  return function NumberValueAccessor_Factory(t) {
    return (\u0275NumberValueAccessor_BaseFactory || (\u0275NumberValueAccessor_BaseFactory = \u0275\u0275getInheritedFactory(_NumberValueAccessor)))(t || _NumberValueAccessor);
  };
})();
_NumberValueAccessor.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
  type: _NumberValueAccessor,
  selectors: [["input", "type", "number", "formControlName", ""], ["input", "type", "number", "formControl", ""], ["input", "type", "number", "ngModel", ""]],
  hostBindings: function NumberValueAccessor_HostBindings(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275listener("input", function NumberValueAccessor_input_HostBindingHandler($event) {
        return ctx.onChange($event.target.value);
      })("blur", function NumberValueAccessor_blur_HostBindingHandler() {
        return ctx.onTouched();
      });
    }
  },
  features: [\u0275\u0275ProvidersFeature([NUMBER_VALUE_ACCESSOR]), \u0275\u0275InheritDefinitionFeature]
});
var NumberValueAccessor = _NumberValueAccessor;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NumberValueAccessor, [{
    type: Directive,
    args: [{
      selector: "input[type=number][formControlName],input[type=number][formControl],input[type=number][ngModel]",
      host: {
        "(input)": "onChange($event.target.value)",
        "(blur)": "onTouched()"
      },
      providers: [NUMBER_VALUE_ACCESSOR]
    }]
  }], null, null);
})();
var RADIO_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => RadioControlValueAccessor),
  multi: true
};
function throwNameError() {
  throw new RuntimeError(1202, `
      If you define both a name and a formControlName attribute on your radio button, their values
      must match. Ex: <input type="radio" formControlName="food" name="food">
    `);
}
var _RadioControlRegistry = class _RadioControlRegistry {
  constructor() {
    this._accessors = [];
  }
  /**
   * @description
   * Adds a control to the internal registry. For internal use only.
   */
  add(control, accessor) {
    this._accessors.push([control, accessor]);
  }
  /**
   * @description
   * Removes a control from the internal registry. For internal use only.
   */
  remove(accessor) {
    for (let i = this._accessors.length - 1; i >= 0; --i) {
      if (this._accessors[i][1] === accessor) {
        this._accessors.splice(i, 1);
        return;
      }
    }
  }
  /**
   * @description
   * Selects a radio button. For internal use only.
   */
  select(accessor) {
    this._accessors.forEach((c) => {
      if (this._isSameGroup(c, accessor) && c[1] !== accessor) {
        c[1].fireUncheck(accessor.value);
      }
    });
  }
  _isSameGroup(controlPair, accessor) {
    if (!controlPair[0].control) return false;
    return controlPair[0]._parent === accessor._control._parent && controlPair[1].name === accessor.name;
  }
};
_RadioControlRegistry.\u0275fac = function RadioControlRegistry_Factory(t) {
  return new (t || _RadioControlRegistry)();
};
_RadioControlRegistry.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
  token: _RadioControlRegistry,
  factory: _RadioControlRegistry.\u0275fac,
  providedIn: "root"
});
var RadioControlRegistry = _RadioControlRegistry;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RadioControlRegistry, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
var _RadioControlValueAccessor = class _RadioControlValueAccessor extends BuiltInControlValueAccessor {
  constructor(renderer, elementRef, _registry, _injector) {
    super(renderer, elementRef);
    this._registry = _registry;
    this._injector = _injector;
    this.setDisabledStateFired = false;
    this.onChange = () => {
    };
    this.callSetDisabledState = inject(CALL_SET_DISABLED_STATE, {
      optional: true
    }) ?? setDisabledStateDefault;
  }
  /** @nodoc */
  ngOnInit() {
    this._control = this._injector.get(NgControl);
    this._checkName();
    this._registry.add(this._control, this);
  }
  /** @nodoc */
  ngOnDestroy() {
    this._registry.remove(this);
  }
  /**
   * Sets the "checked" property value on the radio input element.
   * @nodoc
   */
  writeValue(value) {
    this._state = value === this.value;
    this.setProperty("checked", this._state);
  }
  /**
   * Registers a function called when the control value changes.
   * @nodoc
   */
  registerOnChange(fn) {
    this._fn = fn;
    this.onChange = () => {
      fn(this.value);
      this._registry.select(this);
    };
  }
  /** @nodoc */
  setDisabledState(isDisabled) {
    if (this.setDisabledStateFired || isDisabled || this.callSetDisabledState === "whenDisabledForLegacyCode") {
      this.setProperty("disabled", isDisabled);
    }
    this.setDisabledStateFired = true;
  }
  /**
   * Sets the "value" on the radio input element and unchecks it.
   *
   * @param value
   */
  fireUncheck(value) {
    this.writeValue(value);
  }
  _checkName() {
    if (this.name && this.formControlName && this.name !== this.formControlName && (typeof ngDevMode === "undefined" || ngDevMode)) {
      throwNameError();
    }
    if (!this.name && this.formControlName) this.name = this.formControlName;
  }
};
_RadioControlValueAccessor.\u0275fac = function RadioControlValueAccessor_Factory(t) {
  return new (t || _RadioControlValueAccessor)(\u0275\u0275directiveInject(Renderer2), \u0275\u0275directiveInject(ElementRef), \u0275\u0275directiveInject(RadioControlRegistry), \u0275\u0275directiveInject(Injector));
};
_RadioControlValueAccessor.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
  type: _RadioControlValueAccessor,
  selectors: [["input", "type", "radio", "formControlName", ""], ["input", "type", "radio", "formControl", ""], ["input", "type", "radio", "ngModel", ""]],
  hostBindings: function RadioControlValueAccessor_HostBindings(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275listener("change", function RadioControlValueAccessor_change_HostBindingHandler() {
        return ctx.onChange();
      })("blur", function RadioControlValueAccessor_blur_HostBindingHandler() {
        return ctx.onTouched();
      });
    }
  },
  inputs: {
    name: "name",
    formControlName: "formControlName",
    value: "value"
  },
  features: [\u0275\u0275ProvidersFeature([RADIO_VALUE_ACCESSOR]), \u0275\u0275InheritDefinitionFeature]
});
var RadioControlValueAccessor = _RadioControlValueAccessor;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RadioControlValueAccessor, [{
    type: Directive,
    args: [{
      selector: "input[type=radio][formControlName],input[type=radio][formControl],input[type=radio][ngModel]",
      host: {
        "(change)": "onChange()",
        "(blur)": "onTouched()"
      },
      providers: [RADIO_VALUE_ACCESSOR]
    }]
  }], () => [{
    type: Renderer2
  }, {
    type: ElementRef
  }, {
    type: RadioControlRegistry
  }, {
    type: Injector
  }], {
    name: [{
      type: Input
    }],
    formControlName: [{
      type: Input
    }],
    value: [{
      type: Input
    }]
  });
})();
var RANGE_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => RangeValueAccessor),
  multi: true
};
var _RangeValueAccessor = class _RangeValueAccessor extends BuiltInControlValueAccessor {
  /**
   * Sets the "value" property on the input element.
   * @nodoc
   */
  writeValue(value) {
    this.setProperty("value", parseFloat(value));
  }
  /**
   * Registers a function called when the control value changes.
   * @nodoc
   */
  registerOnChange(fn) {
    this.onChange = (value) => {
      fn(value == "" ? null : parseFloat(value));
    };
  }
};
_RangeValueAccessor.\u0275fac = /* @__PURE__ */ (() => {
  let \u0275RangeValueAccessor_BaseFactory;
  return function RangeValueAccessor_Factory(t) {
    return (\u0275RangeValueAccessor_BaseFactory || (\u0275RangeValueAccessor_BaseFactory = \u0275\u0275getInheritedFactory(_RangeValueAccessor)))(t || _RangeValueAccessor);
  };
})();
_RangeValueAccessor.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
  type: _RangeValueAccessor,
  selectors: [["input", "type", "range", "formControlName", ""], ["input", "type", "range", "formControl", ""], ["input", "type", "range", "ngModel", ""]],
  hostBindings: function RangeValueAccessor_HostBindings(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275listener("change", function RangeValueAccessor_change_HostBindingHandler($event) {
        return ctx.onChange($event.target.value);
      })("input", function RangeValueAccessor_input_HostBindingHandler($event) {
        return ctx.onChange($event.target.value);
      })("blur", function RangeValueAccessor_blur_HostBindingHandler() {
        return ctx.onTouched();
      });
    }
  },
  features: [\u0275\u0275ProvidersFeature([RANGE_VALUE_ACCESSOR]), \u0275\u0275InheritDefinitionFeature]
});
var RangeValueAccessor = _RangeValueAccessor;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RangeValueAccessor, [{
    type: Directive,
    args: [{
      selector: "input[type=range][formControlName],input[type=range][formControl],input[type=range][ngModel]",
      host: {
        "(change)": "onChange($event.target.value)",
        "(input)": "onChange($event.target.value)",
        "(blur)": "onTouched()"
      },
      providers: [RANGE_VALUE_ACCESSOR]
    }]
  }], null, null);
})();
var NG_MODEL_WITH_FORM_CONTROL_WARNING = new InjectionToken(ngDevMode ? "NgModelWithFormControlWarning" : "");
var formControlBinding = {
  provide: NgControl,
  useExisting: forwardRef(() => FormControlDirective)
};
var _FormControlDirective = class _FormControlDirective extends NgControl {
  /**
   * @description
   * Triggers a warning in dev mode that this input should not be used with reactive forms.
   */
  set isDisabled(isDisabled) {
    if (typeof ngDevMode === "undefined" || ngDevMode) {
      console.warn(disabledAttrWarning);
    }
  }
  constructor(validators, asyncValidators, valueAccessors, _ngModelWarningConfig, callSetDisabledState) {
    super();
    this._ngModelWarningConfig = _ngModelWarningConfig;
    this.callSetDisabledState = callSetDisabledState;
    this.update = new EventEmitter();
    this._ngModelWarningSent = false;
    this._setValidators(validators);
    this._setAsyncValidators(asyncValidators);
    this.valueAccessor = selectValueAccessor(this, valueAccessors);
  }
  /** @nodoc */
  ngOnChanges(changes) {
    if (this._isControlChanged(changes)) {
      const previousForm = changes["form"].previousValue;
      if (previousForm) {
        cleanUpControl(
          previousForm,
          this,
          /* validateControlPresenceOnChange */
          false
        );
      }
      setUpControl(this.form, this, this.callSetDisabledState);
      this.form.updateValueAndValidity({
        emitEvent: false
      });
    }
    if (isPropertyUpdated(changes, this.viewModel)) {
      if (typeof ngDevMode === "undefined" || ngDevMode) {
        _ngModelWarning("formControl", _FormControlDirective, this, this._ngModelWarningConfig);
      }
      this.form.setValue(this.model);
      this.viewModel = this.model;
    }
  }
  /** @nodoc */
  ngOnDestroy() {
    if (this.form) {
      cleanUpControl(
        this.form,
        this,
        /* validateControlPresenceOnChange */
        false
      );
    }
  }
  /**
   * @description
   * Returns an array that represents the path from the top-level form to this control.
   * Each index is the string name of the control on that level.
   */
  get path() {
    return [];
  }
  /**
   * @description
   * The `FormControl` bound to this directive.
   */
  get control() {
    return this.form;
  }
  /**
   * @description
   * Sets the new value for the view model and emits an `ngModelChange` event.
   *
   * @param newValue The new value for the view model.
   */
  viewToModelUpdate(newValue) {
    this.viewModel = newValue;
    this.update.emit(newValue);
  }
  _isControlChanged(changes) {
    return changes.hasOwnProperty("form");
  }
};
_FormControlDirective._ngModelWarningSentOnce = false;
_FormControlDirective.\u0275fac = function FormControlDirective_Factory(t) {
  return new (t || _FormControlDirective)(\u0275\u0275directiveInject(NG_VALIDATORS, 10), \u0275\u0275directiveInject(NG_ASYNC_VALIDATORS, 10), \u0275\u0275directiveInject(NG_VALUE_ACCESSOR, 10), \u0275\u0275directiveInject(NG_MODEL_WITH_FORM_CONTROL_WARNING, 8), \u0275\u0275directiveInject(CALL_SET_DISABLED_STATE, 8));
};
_FormControlDirective.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
  type: _FormControlDirective,
  selectors: [["", "formControl", ""]],
  inputs: {
    form: [0, "formControl", "form"],
    isDisabled: [0, "disabled", "isDisabled"],
    model: [0, "ngModel", "model"]
  },
  outputs: {
    update: "ngModelChange"
  },
  exportAs: ["ngForm"],
  features: [\u0275\u0275ProvidersFeature([formControlBinding]), \u0275\u0275InheritDefinitionFeature, \u0275\u0275NgOnChangesFeature]
});
var FormControlDirective = _FormControlDirective;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FormControlDirective, [{
    type: Directive,
    args: [{
      selector: "[formControl]",
      providers: [formControlBinding],
      exportAs: "ngForm"
    }]
  }], () => [{
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Self
    }, {
      type: Inject,
      args: [NG_VALIDATORS]
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Self
    }, {
      type: Inject,
      args: [NG_ASYNC_VALIDATORS]
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Self
    }, {
      type: Inject,
      args: [NG_VALUE_ACCESSOR]
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [NG_MODEL_WITH_FORM_CONTROL_WARNING]
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [CALL_SET_DISABLED_STATE]
    }]
  }], {
    form: [{
      type: Input,
      args: ["formControl"]
    }],
    isDisabled: [{
      type: Input,
      args: ["disabled"]
    }],
    model: [{
      type: Input,
      args: ["ngModel"]
    }],
    update: [{
      type: Output,
      args: ["ngModelChange"]
    }]
  });
})();
var formDirectiveProvider = {
  provide: ControlContainer,
  useExisting: forwardRef(() => FormGroupDirective)
};
var _FormGroupDirective = class _FormGroupDirective extends ControlContainer {
  constructor(validators, asyncValidators, callSetDisabledState) {
    super();
    this.callSetDisabledState = callSetDisabledState;
    this.submitted = false;
    this._onCollectionChange = () => this._updateDomValue();
    this.directives = [];
    this.form = null;
    this.ngSubmit = new EventEmitter();
    this._setValidators(validators);
    this._setAsyncValidators(asyncValidators);
  }
  /** @nodoc */
  ngOnChanges(changes) {
    this._checkFormPresent();
    if (changes.hasOwnProperty("form")) {
      this._updateValidators();
      this._updateDomValue();
      this._updateRegistrations();
      this._oldForm = this.form;
    }
  }
  /** @nodoc */
  ngOnDestroy() {
    if (this.form) {
      cleanUpValidators(this.form, this);
      if (this.form._onCollectionChange === this._onCollectionChange) {
        this.form._registerOnCollectionChange(() => {
        });
      }
    }
  }
  /**
   * @description
   * Returns this directive's instance.
   */
  get formDirective() {
    return this;
  }
  /**
   * @description
   * Returns the `FormGroup` bound to this directive.
   */
  get control() {
    return this.form;
  }
  /**
   * @description
   * Returns an array representing the path to this group. Because this directive
   * always lives at the top level of a form, it always an empty array.
   */
  get path() {
    return [];
  }
  /**
   * @description
   * Method that sets up the control directive in this group, re-calculates its value
   * and validity, and adds the instance to the internal list of directives.
   *
   * @param dir The `FormControlName` directive instance.
   */
  addControl(dir) {
    const ctrl = this.form.get(dir.path);
    setUpControl(ctrl, dir, this.callSetDisabledState);
    ctrl.updateValueAndValidity({
      emitEvent: false
    });
    this.directives.push(dir);
    return ctrl;
  }
  /**
   * @description
   * Retrieves the `FormControl` instance from the provided `FormControlName` directive
   *
   * @param dir The `FormControlName` directive instance.
   */
  getControl(dir) {
    return this.form.get(dir.path);
  }
  /**
   * @description
   * Removes the `FormControlName` instance from the internal list of directives
   *
   * @param dir The `FormControlName` directive instance.
   */
  removeControl(dir) {
    cleanUpControl(
      dir.control || null,
      dir,
      /* validateControlPresenceOnChange */
      false
    );
    removeListItem$1(this.directives, dir);
  }
  /**
   * Adds a new `FormGroupName` directive instance to the form.
   *
   * @param dir The `FormGroupName` directive instance.
   */
  addFormGroup(dir) {
    this._setUpFormContainer(dir);
  }
  /**
   * Performs the necessary cleanup when a `FormGroupName` directive instance is removed from the
   * view.
   *
   * @param dir The `FormGroupName` directive instance.
   */
  removeFormGroup(dir) {
    this._cleanUpFormContainer(dir);
  }
  /**
   * @description
   * Retrieves the `FormGroup` for a provided `FormGroupName` directive instance
   *
   * @param dir The `FormGroupName` directive instance.
   */
  getFormGroup(dir) {
    return this.form.get(dir.path);
  }
  /**
   * Performs the necessary setup when a `FormArrayName` directive instance is added to the view.
   *
   * @param dir The `FormArrayName` directive instance.
   */
  addFormArray(dir) {
    this._setUpFormContainer(dir);
  }
  /**
   * Performs the necessary cleanup when a `FormArrayName` directive instance is removed from the
   * view.
   *
   * @param dir The `FormArrayName` directive instance.
   */
  removeFormArray(dir) {
    this._cleanUpFormContainer(dir);
  }
  /**
   * @description
   * Retrieves the `FormArray` for a provided `FormArrayName` directive instance.
   *
   * @param dir The `FormArrayName` directive instance.
   */
  getFormArray(dir) {
    return this.form.get(dir.path);
  }
  /**
   * Sets the new value for the provided `FormControlName` directive.
   *
   * @param dir The `FormControlName` directive instance.
   * @param value The new value for the directive's control.
   */
  updateModel(dir, value) {
    const ctrl = this.form.get(dir.path);
    ctrl.setValue(value);
  }
  /**
   * @description
   * Method called with the "submit" event is triggered on the form.
   * Triggers the `ngSubmit` emitter to emit the "submit" event as its payload.
   *
   * @param $event The "submit" event object
   */
  onSubmit($event) {
    this.submitted = true;
    syncPendingControls(this.form, this.directives);
    this.ngSubmit.emit($event);
    this.form._events.next(new FormSubmittedEvent(this.control));
    return $event?.target?.method === "dialog";
  }
  /**
   * @description
   * Method called when the "reset" event is triggered on the form.
   */
  onReset() {
    this.resetForm();
  }
  /**
   * @description
   * Resets the form to an initial value and resets its submitted status.
   *
   * @param value The new value for the form.
   */
  resetForm(value = void 0) {
    this.form.reset(value);
    this.submitted = false;
    this.form._events.next(new FormResetEvent(this.form));
  }
  /** @internal */
  _updateDomValue() {
    this.directives.forEach((dir) => {
      const oldCtrl = dir.control;
      const newCtrl = this.form.get(dir.path);
      if (oldCtrl !== newCtrl) {
        cleanUpControl(oldCtrl || null, dir);
        if (isFormControl(newCtrl)) {
          setUpControl(newCtrl, dir, this.callSetDisabledState);
          dir.control = newCtrl;
        }
      }
    });
    this.form._updateTreeValidity({
      emitEvent: false
    });
  }
  _setUpFormContainer(dir) {
    const ctrl = this.form.get(dir.path);
    setUpFormContainer(ctrl, dir);
    ctrl.updateValueAndValidity({
      emitEvent: false
    });
  }
  _cleanUpFormContainer(dir) {
    if (this.form) {
      const ctrl = this.form.get(dir.path);
      if (ctrl) {
        const isControlUpdated = cleanUpFormContainer(ctrl, dir);
        if (isControlUpdated) {
          ctrl.updateValueAndValidity({
            emitEvent: false
          });
        }
      }
    }
  }
  _updateRegistrations() {
    this.form._registerOnCollectionChange(this._onCollectionChange);
    if (this._oldForm) {
      this._oldForm._registerOnCollectionChange(() => {
      });
    }
  }
  _updateValidators() {
    setUpValidators(this.form, this);
    if (this._oldForm) {
      cleanUpValidators(this._oldForm, this);
    }
  }
  _checkFormPresent() {
    if (!this.form && (typeof ngDevMode === "undefined" || ngDevMode)) {
      throw missingFormException();
    }
  }
};
_FormGroupDirective.\u0275fac = function FormGroupDirective_Factory(t) {
  return new (t || _FormGroupDirective)(\u0275\u0275directiveInject(NG_VALIDATORS, 10), \u0275\u0275directiveInject(NG_ASYNC_VALIDATORS, 10), \u0275\u0275directiveInject(CALL_SET_DISABLED_STATE, 8));
};
_FormGroupDirective.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
  type: _FormGroupDirective,
  selectors: [["", "formGroup", ""]],
  hostBindings: function FormGroupDirective_HostBindings(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275listener("submit", function FormGroupDirective_submit_HostBindingHandler($event) {
        return ctx.onSubmit($event);
      })("reset", function FormGroupDirective_reset_HostBindingHandler() {
        return ctx.onReset();
      });
    }
  },
  inputs: {
    form: [0, "formGroup", "form"]
  },
  outputs: {
    ngSubmit: "ngSubmit"
  },
  exportAs: ["ngForm"],
  features: [\u0275\u0275ProvidersFeature([formDirectiveProvider]), \u0275\u0275InheritDefinitionFeature, \u0275\u0275NgOnChangesFeature]
});
var FormGroupDirective = _FormGroupDirective;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FormGroupDirective, [{
    type: Directive,
    args: [{
      selector: "[formGroup]",
      providers: [formDirectiveProvider],
      host: {
        "(submit)": "onSubmit($event)",
        "(reset)": "onReset()"
      },
      exportAs: "ngForm"
    }]
  }], () => [{
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Self
    }, {
      type: Inject,
      args: [NG_VALIDATORS]
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Self
    }, {
      type: Inject,
      args: [NG_ASYNC_VALIDATORS]
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [CALL_SET_DISABLED_STATE]
    }]
  }], {
    form: [{
      type: Input,
      args: ["formGroup"]
    }],
    ngSubmit: [{
      type: Output
    }]
  });
})();
var formGroupNameProvider = {
  provide: ControlContainer,
  useExisting: forwardRef(() => FormGroupName)
};
var _FormGroupName = class _FormGroupName extends AbstractFormGroupDirective {
  constructor(parent, validators, asyncValidators) {
    super();
    this.name = null;
    this._parent = parent;
    this._setValidators(validators);
    this._setAsyncValidators(asyncValidators);
  }
  /** @internal */
  _checkParentType() {
    if (_hasInvalidParent(this._parent) && (typeof ngDevMode === "undefined" || ngDevMode)) {
      throw groupParentException();
    }
  }
};
_FormGroupName.\u0275fac = function FormGroupName_Factory(t) {
  return new (t || _FormGroupName)(\u0275\u0275directiveInject(ControlContainer, 13), \u0275\u0275directiveInject(NG_VALIDATORS, 10), \u0275\u0275directiveInject(NG_ASYNC_VALIDATORS, 10));
};
_FormGroupName.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
  type: _FormGroupName,
  selectors: [["", "formGroupName", ""]],
  inputs: {
    name: [0, "formGroupName", "name"]
  },
  features: [\u0275\u0275ProvidersFeature([formGroupNameProvider]), \u0275\u0275InheritDefinitionFeature]
});
var FormGroupName = _FormGroupName;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FormGroupName, [{
    type: Directive,
    args: [{
      selector: "[formGroupName]",
      providers: [formGroupNameProvider]
    }]
  }], () => [{
    type: ControlContainer,
    decorators: [{
      type: Optional
    }, {
      type: Host
    }, {
      type: SkipSelf
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Self
    }, {
      type: Inject,
      args: [NG_VALIDATORS]
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Self
    }, {
      type: Inject,
      args: [NG_ASYNC_VALIDATORS]
    }]
  }], {
    name: [{
      type: Input,
      args: ["formGroupName"]
    }]
  });
})();
var formArrayNameProvider = {
  provide: ControlContainer,
  useExisting: forwardRef(() => FormArrayName)
};
var _FormArrayName = class _FormArrayName extends ControlContainer {
  constructor(parent, validators, asyncValidators) {
    super();
    this.name = null;
    this._parent = parent;
    this._setValidators(validators);
    this._setAsyncValidators(asyncValidators);
  }
  /**
   * A lifecycle method called when the directive's inputs are initialized. For internal use only.
   * @throws If the directive does not have a valid parent.
   * @nodoc
   */
  ngOnInit() {
    this._checkParentType();
    this.formDirective.addFormArray(this);
  }
  /**
   * A lifecycle method called before the directive's instance is destroyed. For internal use only.
   * @nodoc
   */
  ngOnDestroy() {
    if (this.formDirective) {
      this.formDirective.removeFormArray(this);
    }
  }
  /**
   * @description
   * The `FormArray` bound to this directive.
   */
  get control() {
    return this.formDirective.getFormArray(this);
  }
  /**
   * @description
   * The top-level directive for this group if present, otherwise null.
   */
  get formDirective() {
    return this._parent ? this._parent.formDirective : null;
  }
  /**
   * @description
   * Returns an array that represents the path from the top-level form to this control.
   * Each index is the string name of the control on that level.
   */
  get path() {
    return controlPath(this.name == null ? this.name : this.name.toString(), this._parent);
  }
  _checkParentType() {
    if (_hasInvalidParent(this._parent) && (typeof ngDevMode === "undefined" || ngDevMode)) {
      throw arrayParentException();
    }
  }
};
_FormArrayName.\u0275fac = function FormArrayName_Factory(t) {
  return new (t || _FormArrayName)(\u0275\u0275directiveInject(ControlContainer, 13), \u0275\u0275directiveInject(NG_VALIDATORS, 10), \u0275\u0275directiveInject(NG_ASYNC_VALIDATORS, 10));
};
_FormArrayName.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
  type: _FormArrayName,
  selectors: [["", "formArrayName", ""]],
  inputs: {
    name: [0, "formArrayName", "name"]
  },
  features: [\u0275\u0275ProvidersFeature([formArrayNameProvider]), \u0275\u0275InheritDefinitionFeature]
});
var FormArrayName = _FormArrayName;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FormArrayName, [{
    type: Directive,
    args: [{
      selector: "[formArrayName]",
      providers: [formArrayNameProvider]
    }]
  }], () => [{
    type: ControlContainer,
    decorators: [{
      type: Optional
    }, {
      type: Host
    }, {
      type: SkipSelf
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Self
    }, {
      type: Inject,
      args: [NG_VALIDATORS]
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Self
    }, {
      type: Inject,
      args: [NG_ASYNC_VALIDATORS]
    }]
  }], {
    name: [{
      type: Input,
      args: ["formArrayName"]
    }]
  });
})();
function _hasInvalidParent(parent) {
  return !(parent instanceof FormGroupName) && !(parent instanceof FormGroupDirective) && !(parent instanceof FormArrayName);
}
var controlNameBinding = {
  provide: NgControl,
  useExisting: forwardRef(() => FormControlName)
};
var _FormControlName = class _FormControlName extends NgControl {
  /**
   * @description
   * Triggers a warning in dev mode that this input should not be used with reactive forms.
   */
  set isDisabled(isDisabled) {
    if (typeof ngDevMode === "undefined" || ngDevMode) {
      console.warn(disabledAttrWarning);
    }
  }
  constructor(parent, validators, asyncValidators, valueAccessors, _ngModelWarningConfig) {
    super();
    this._ngModelWarningConfig = _ngModelWarningConfig;
    this._added = false;
    this.name = null;
    this.update = new EventEmitter();
    this._ngModelWarningSent = false;
    this._parent = parent;
    this._setValidators(validators);
    this._setAsyncValidators(asyncValidators);
    this.valueAccessor = selectValueAccessor(this, valueAccessors);
  }
  /** @nodoc */
  ngOnChanges(changes) {
    if (!this._added) this._setUpControl();
    if (isPropertyUpdated(changes, this.viewModel)) {
      if (typeof ngDevMode === "undefined" || ngDevMode) {
        _ngModelWarning("formControlName", _FormControlName, this, this._ngModelWarningConfig);
      }
      this.viewModel = this.model;
      this.formDirective.updateModel(this, this.model);
    }
  }
  /** @nodoc */
  ngOnDestroy() {
    if (this.formDirective) {
      this.formDirective.removeControl(this);
    }
  }
  /**
   * @description
   * Sets the new value for the view model and emits an `ngModelChange` event.
   *
   * @param newValue The new value for the view model.
   */
  viewToModelUpdate(newValue) {
    this.viewModel = newValue;
    this.update.emit(newValue);
  }
  /**
   * @description
   * Returns an array that represents the path from the top-level form to this control.
   * Each index is the string name of the control on that level.
   */
  get path() {
    return controlPath(this.name == null ? this.name : this.name.toString(), this._parent);
  }
  /**
   * @description
   * The top-level directive for this group if present, otherwise null.
   */
  get formDirective() {
    return this._parent ? this._parent.formDirective : null;
  }
  _checkParentType() {
    if (typeof ngDevMode === "undefined" || ngDevMode) {
      if (!(this._parent instanceof FormGroupName) && this._parent instanceof AbstractFormGroupDirective) {
        throw ngModelGroupException();
      } else if (!(this._parent instanceof FormGroupName) && !(this._parent instanceof FormGroupDirective) && !(this._parent instanceof FormArrayName)) {
        throw controlParentException(this.name);
      }
    }
  }
  _setUpControl() {
    this._checkParentType();
    this.control = this.formDirective.addControl(this);
    this._added = true;
  }
};
_FormControlName._ngModelWarningSentOnce = false;
_FormControlName.\u0275fac = function FormControlName_Factory(t) {
  return new (t || _FormControlName)(\u0275\u0275directiveInject(ControlContainer, 13), \u0275\u0275directiveInject(NG_VALIDATORS, 10), \u0275\u0275directiveInject(NG_ASYNC_VALIDATORS, 10), \u0275\u0275directiveInject(NG_VALUE_ACCESSOR, 10), \u0275\u0275directiveInject(NG_MODEL_WITH_FORM_CONTROL_WARNING, 8));
};
_FormControlName.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
  type: _FormControlName,
  selectors: [["", "formControlName", ""]],
  inputs: {
    name: [0, "formControlName", "name"],
    isDisabled: [0, "disabled", "isDisabled"],
    model: [0, "ngModel", "model"]
  },
  outputs: {
    update: "ngModelChange"
  },
  features: [\u0275\u0275ProvidersFeature([controlNameBinding]), \u0275\u0275InheritDefinitionFeature, \u0275\u0275NgOnChangesFeature]
});
var FormControlName = _FormControlName;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FormControlName, [{
    type: Directive,
    args: [{
      selector: "[formControlName]",
      providers: [controlNameBinding]
    }]
  }], () => [{
    type: ControlContainer,
    decorators: [{
      type: Optional
    }, {
      type: Host
    }, {
      type: SkipSelf
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Self
    }, {
      type: Inject,
      args: [NG_VALIDATORS]
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Self
    }, {
      type: Inject,
      args: [NG_ASYNC_VALIDATORS]
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Self
    }, {
      type: Inject,
      args: [NG_VALUE_ACCESSOR]
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [NG_MODEL_WITH_FORM_CONTROL_WARNING]
    }]
  }], {
    name: [{
      type: Input,
      args: ["formControlName"]
    }],
    isDisabled: [{
      type: Input,
      args: ["disabled"]
    }],
    model: [{
      type: Input,
      args: ["ngModel"]
    }],
    update: [{
      type: Output,
      args: ["ngModelChange"]
    }]
  });
})();
var SELECT_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SelectControlValueAccessor),
  multi: true
};
function _buildValueString$1(id, value) {
  if (id == null) return `${value}`;
  if (value && typeof value === "object") value = "Object";
  return `${id}: ${value}`.slice(0, 50);
}
function _extractId$1(valueString) {
  return valueString.split(":")[0];
}
var _SelectControlValueAccessor = class _SelectControlValueAccessor extends BuiltInControlValueAccessor {
  constructor() {
    super(...arguments);
    this._optionMap = /* @__PURE__ */ new Map();
    this._idCounter = 0;
    this._compareWith = Object.is;
  }
  /**
   * @description
   * Tracks the option comparison algorithm for tracking identities when
   * checking for changes.
   */
  set compareWith(fn) {
    if (typeof fn !== "function" && (typeof ngDevMode === "undefined" || ngDevMode)) {
      throw new RuntimeError(1201, `compareWith must be a function, but received ${JSON.stringify(fn)}`);
    }
    this._compareWith = fn;
  }
  /**
   * Sets the "value" property on the select element.
   * @nodoc
   */
  writeValue(value) {
    this.value = value;
    const id = this._getOptionId(value);
    const valueString = _buildValueString$1(id, value);
    this.setProperty("value", valueString);
  }
  /**
   * Registers a function called when the control value changes.
   * @nodoc
   */
  registerOnChange(fn) {
    this.onChange = (valueString) => {
      this.value = this._getOptionValue(valueString);
      fn(this.value);
    };
  }
  /** @internal */
  _registerOption() {
    return (this._idCounter++).toString();
  }
  /** @internal */
  _getOptionId(value) {
    for (const id of this._optionMap.keys()) {
      if (this._compareWith(this._optionMap.get(id), value)) return id;
    }
    return null;
  }
  /** @internal */
  _getOptionValue(valueString) {
    const id = _extractId$1(valueString);
    return this._optionMap.has(id) ? this._optionMap.get(id) : valueString;
  }
};
_SelectControlValueAccessor.\u0275fac = /* @__PURE__ */ (() => {
  let \u0275SelectControlValueAccessor_BaseFactory;
  return function SelectControlValueAccessor_Factory(t) {
    return (\u0275SelectControlValueAccessor_BaseFactory || (\u0275SelectControlValueAccessor_BaseFactory = \u0275\u0275getInheritedFactory(_SelectControlValueAccessor)))(t || _SelectControlValueAccessor);
  };
})();
_SelectControlValueAccessor.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
  type: _SelectControlValueAccessor,
  selectors: [["select", "formControlName", "", 3, "multiple", ""], ["select", "formControl", "", 3, "multiple", ""], ["select", "ngModel", "", 3, "multiple", ""]],
  hostBindings: function SelectControlValueAccessor_HostBindings(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275listener("change", function SelectControlValueAccessor_change_HostBindingHandler($event) {
        return ctx.onChange($event.target.value);
      })("blur", function SelectControlValueAccessor_blur_HostBindingHandler() {
        return ctx.onTouched();
      });
    }
  },
  inputs: {
    compareWith: "compareWith"
  },
  features: [\u0275\u0275ProvidersFeature([SELECT_VALUE_ACCESSOR]), \u0275\u0275InheritDefinitionFeature]
});
var SelectControlValueAccessor = _SelectControlValueAccessor;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SelectControlValueAccessor, [{
    type: Directive,
    args: [{
      selector: "select:not([multiple])[formControlName],select:not([multiple])[formControl],select:not([multiple])[ngModel]",
      host: {
        "(change)": "onChange($event.target.value)",
        "(blur)": "onTouched()"
      },
      providers: [SELECT_VALUE_ACCESSOR]
    }]
  }], null, {
    compareWith: [{
      type: Input
    }]
  });
})();
var _NgSelectOption = class _NgSelectOption {
  constructor(_element, _renderer, _select) {
    this._element = _element;
    this._renderer = _renderer;
    this._select = _select;
    if (this._select) this.id = this._select._registerOption();
  }
  /**
   * @description
   * Tracks the value bound to the option element. Unlike the value binding,
   * ngValue supports binding to objects.
   */
  set ngValue(value) {
    if (this._select == null) return;
    this._select._optionMap.set(this.id, value);
    this._setElementValue(_buildValueString$1(this.id, value));
    this._select.writeValue(this._select.value);
  }
  /**
   * @description
   * Tracks simple string values bound to the option element.
   * For objects, use the `ngValue` input binding.
   */
  set value(value) {
    this._setElementValue(value);
    if (this._select) this._select.writeValue(this._select.value);
  }
  /** @internal */
  _setElementValue(value) {
    this._renderer.setProperty(this._element.nativeElement, "value", value);
  }
  /** @nodoc */
  ngOnDestroy() {
    if (this._select) {
      this._select._optionMap.delete(this.id);
      this._select.writeValue(this._select.value);
    }
  }
};
_NgSelectOption.\u0275fac = function NgSelectOption_Factory(t) {
  return new (t || _NgSelectOption)(\u0275\u0275directiveInject(ElementRef), \u0275\u0275directiveInject(Renderer2), \u0275\u0275directiveInject(SelectControlValueAccessor, 9));
};
_NgSelectOption.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
  type: _NgSelectOption,
  selectors: [["option"]],
  inputs: {
    ngValue: "ngValue",
    value: "value"
  }
});
var NgSelectOption = _NgSelectOption;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NgSelectOption, [{
    type: Directive,
    args: [{
      selector: "option"
    }]
  }], () => [{
    type: ElementRef
  }, {
    type: Renderer2
  }, {
    type: SelectControlValueAccessor,
    decorators: [{
      type: Optional
    }, {
      type: Host
    }]
  }], {
    ngValue: [{
      type: Input,
      args: ["ngValue"]
    }],
    value: [{
      type: Input,
      args: ["value"]
    }]
  });
})();
var SELECT_MULTIPLE_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SelectMultipleControlValueAccessor),
  multi: true
};
function _buildValueString(id, value) {
  if (id == null) return `${value}`;
  if (typeof value === "string") value = `'${value}'`;
  if (value && typeof value === "object") value = "Object";
  return `${id}: ${value}`.slice(0, 50);
}
function _extractId(valueString) {
  return valueString.split(":")[0];
}
var _SelectMultipleControlValueAccessor = class _SelectMultipleControlValueAccessor extends BuiltInControlValueAccessor {
  constructor() {
    super(...arguments);
    this._optionMap = /* @__PURE__ */ new Map();
    this._idCounter = 0;
    this._compareWith = Object.is;
  }
  /**
   * @description
   * Tracks the option comparison algorithm for tracking identities when
   * checking for changes.
   */
  set compareWith(fn) {
    if (typeof fn !== "function" && (typeof ngDevMode === "undefined" || ngDevMode)) {
      throw new RuntimeError(1201, `compareWith must be a function, but received ${JSON.stringify(fn)}`);
    }
    this._compareWith = fn;
  }
  /**
   * Sets the "value" property on one or of more of the select's options.
   * @nodoc
   */
  writeValue(value) {
    this.value = value;
    let optionSelectedStateSetter;
    if (Array.isArray(value)) {
      const ids = value.map((v) => this._getOptionId(v));
      optionSelectedStateSetter = (opt, o) => {
        opt._setSelected(ids.indexOf(o.toString()) > -1);
      };
    } else {
      optionSelectedStateSetter = (opt, o) => {
        opt._setSelected(false);
      };
    }
    this._optionMap.forEach(optionSelectedStateSetter);
  }
  /**
   * Registers a function called when the control value changes
   * and writes an array of the selected options.
   * @nodoc
   */
  registerOnChange(fn) {
    this.onChange = (element) => {
      const selected = [];
      const selectedOptions = element.selectedOptions;
      if (selectedOptions !== void 0) {
        const options = selectedOptions;
        for (let i = 0; i < options.length; i++) {
          const opt = options[i];
          const val = this._getOptionValue(opt.value);
          selected.push(val);
        }
      } else {
        const options = element.options;
        for (let i = 0; i < options.length; i++) {
          const opt = options[i];
          if (opt.selected) {
            const val = this._getOptionValue(opt.value);
            selected.push(val);
          }
        }
      }
      this.value = selected;
      fn(selected);
    };
  }
  /** @internal */
  _registerOption(value) {
    const id = (this._idCounter++).toString();
    this._optionMap.set(id, value);
    return id;
  }
  /** @internal */
  _getOptionId(value) {
    for (const id of this._optionMap.keys()) {
      if (this._compareWith(this._optionMap.get(id)._value, value)) return id;
    }
    return null;
  }
  /** @internal */
  _getOptionValue(valueString) {
    const id = _extractId(valueString);
    return this._optionMap.has(id) ? this._optionMap.get(id)._value : valueString;
  }
};
_SelectMultipleControlValueAccessor.\u0275fac = /* @__PURE__ */ (() => {
  let \u0275SelectMultipleControlValueAccessor_BaseFactory;
  return function SelectMultipleControlValueAccessor_Factory(t) {
    return (\u0275SelectMultipleControlValueAccessor_BaseFactory || (\u0275SelectMultipleControlValueAccessor_BaseFactory = \u0275\u0275getInheritedFactory(_SelectMultipleControlValueAccessor)))(t || _SelectMultipleControlValueAccessor);
  };
})();
_SelectMultipleControlValueAccessor.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
  type: _SelectMultipleControlValueAccessor,
  selectors: [["select", "multiple", "", "formControlName", ""], ["select", "multiple", "", "formControl", ""], ["select", "multiple", "", "ngModel", ""]],
  hostBindings: function SelectMultipleControlValueAccessor_HostBindings(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275listener("change", function SelectMultipleControlValueAccessor_change_HostBindingHandler($event) {
        return ctx.onChange($event.target);
      })("blur", function SelectMultipleControlValueAccessor_blur_HostBindingHandler() {
        return ctx.onTouched();
      });
    }
  },
  inputs: {
    compareWith: "compareWith"
  },
  features: [\u0275\u0275ProvidersFeature([SELECT_MULTIPLE_VALUE_ACCESSOR]), \u0275\u0275InheritDefinitionFeature]
});
var SelectMultipleControlValueAccessor = _SelectMultipleControlValueAccessor;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SelectMultipleControlValueAccessor, [{
    type: Directive,
    args: [{
      selector: "select[multiple][formControlName],select[multiple][formControl],select[multiple][ngModel]",
      host: {
        "(change)": "onChange($event.target)",
        "(blur)": "onTouched()"
      },
      providers: [SELECT_MULTIPLE_VALUE_ACCESSOR]
    }]
  }], null, {
    compareWith: [{
      type: Input
    }]
  });
})();
var _\u0275NgSelectMultipleOption = class _\u0275NgSelectMultipleOption {
  constructor(_element, _renderer, _select) {
    this._element = _element;
    this._renderer = _renderer;
    this._select = _select;
    if (this._select) {
      this.id = this._select._registerOption(this);
    }
  }
  /**
   * @description
   * Tracks the value bound to the option element. Unlike the value binding,
   * ngValue supports binding to objects.
   */
  set ngValue(value) {
    if (this._select == null) return;
    this._value = value;
    this._setElementValue(_buildValueString(this.id, value));
    this._select.writeValue(this._select.value);
  }
  /**
   * @description
   * Tracks simple string values bound to the option element.
   * For objects, use the `ngValue` input binding.
   */
  set value(value) {
    if (this._select) {
      this._value = value;
      this._setElementValue(_buildValueString(this.id, value));
      this._select.writeValue(this._select.value);
    } else {
      this._setElementValue(value);
    }
  }
  /** @internal */
  _setElementValue(value) {
    this._renderer.setProperty(this._element.nativeElement, "value", value);
  }
  /** @internal */
  _setSelected(selected) {
    this._renderer.setProperty(this._element.nativeElement, "selected", selected);
  }
  /** @nodoc */
  ngOnDestroy() {
    if (this._select) {
      this._select._optionMap.delete(this.id);
      this._select.writeValue(this._select.value);
    }
  }
};
_\u0275NgSelectMultipleOption.\u0275fac = function \u0275NgSelectMultipleOption_Factory(t) {
  return new (t || _\u0275NgSelectMultipleOption)(\u0275\u0275directiveInject(ElementRef), \u0275\u0275directiveInject(Renderer2), \u0275\u0275directiveInject(SelectMultipleControlValueAccessor, 9));
};
_\u0275NgSelectMultipleOption.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
  type: _\u0275NgSelectMultipleOption,
  selectors: [["option"]],
  inputs: {
    ngValue: "ngValue",
    value: "value"
  }
});
var \u0275NgSelectMultipleOption = _\u0275NgSelectMultipleOption;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(\u0275NgSelectMultipleOption, [{
    type: Directive,
    args: [{
      selector: "option"
    }]
  }], () => [{
    type: ElementRef
  }, {
    type: Renderer2
  }, {
    type: SelectMultipleControlValueAccessor,
    decorators: [{
      type: Optional
    }, {
      type: Host
    }]
  }], {
    ngValue: [{
      type: Input,
      args: ["ngValue"]
    }],
    value: [{
      type: Input,
      args: ["value"]
    }]
  });
})();
function toInteger(value) {
  return typeof value === "number" ? value : parseInt(value, 10);
}
function toFloat(value) {
  return typeof value === "number" ? value : parseFloat(value);
}
var _AbstractValidatorDirective = class _AbstractValidatorDirective {
  constructor() {
    this._validator = nullValidator;
  }
  /** @nodoc */
  ngOnChanges(changes) {
    if (this.inputName in changes) {
      const input = this.normalizeInput(changes[this.inputName].currentValue);
      this._enabled = this.enabled(input);
      this._validator = this._enabled ? this.createValidator(input) : nullValidator;
      if (this._onChange) {
        this._onChange();
      }
    }
  }
  /** @nodoc */
  validate(control) {
    return this._validator(control);
  }
  /** @nodoc */
  registerOnValidatorChange(fn) {
    this._onChange = fn;
  }
  /**
   * @description
   * Determines whether this validator should be active or not based on an input.
   * Base class implementation checks whether an input is defined (if the value is different from
   * `null` and `undefined`). Validator classes that extend this base class can override this
   * function with the logic specific to a particular validator directive.
   */
  enabled(input) {
    return input != null;
  }
};
_AbstractValidatorDirective.\u0275fac = function AbstractValidatorDirective_Factory(t) {
  return new (t || _AbstractValidatorDirective)();
};
_AbstractValidatorDirective.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
  type: _AbstractValidatorDirective,
  features: [\u0275\u0275NgOnChangesFeature]
});
var AbstractValidatorDirective = _AbstractValidatorDirective;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AbstractValidatorDirective, [{
    type: Directive
  }], null, null);
})();
var MAX_VALIDATOR = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => MaxValidator),
  multi: true
};
var _MaxValidator = class _MaxValidator extends AbstractValidatorDirective {
  constructor() {
    super(...arguments);
    this.inputName = "max";
    this.normalizeInput = (input) => toFloat(input);
    this.createValidator = (max) => maxValidator(max);
  }
};
_MaxValidator.\u0275fac = /* @__PURE__ */ (() => {
  let \u0275MaxValidator_BaseFactory;
  return function MaxValidator_Factory(t) {
    return (\u0275MaxValidator_BaseFactory || (\u0275MaxValidator_BaseFactory = \u0275\u0275getInheritedFactory(_MaxValidator)))(t || _MaxValidator);
  };
})();
_MaxValidator.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
  type: _MaxValidator,
  selectors: [["input", "type", "number", "max", "", "formControlName", ""], ["input", "type", "number", "max", "", "formControl", ""], ["input", "type", "number", "max", "", "ngModel", ""]],
  hostVars: 1,
  hostBindings: function MaxValidator_HostBindings(rf, ctx) {
    if (rf & 2) {
      \u0275\u0275attribute("max", ctx._enabled ? ctx.max : null);
    }
  },
  inputs: {
    max: "max"
  },
  features: [\u0275\u0275ProvidersFeature([MAX_VALIDATOR]), \u0275\u0275InheritDefinitionFeature]
});
var MaxValidator = _MaxValidator;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MaxValidator, [{
    type: Directive,
    args: [{
      selector: "input[type=number][max][formControlName],input[type=number][max][formControl],input[type=number][max][ngModel]",
      providers: [MAX_VALIDATOR],
      host: {
        "[attr.max]": "_enabled ? max : null"
      }
    }]
  }], null, {
    max: [{
      type: Input
    }]
  });
})();
var MIN_VALIDATOR = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => MinValidator),
  multi: true
};
var _MinValidator = class _MinValidator extends AbstractValidatorDirective {
  constructor() {
    super(...arguments);
    this.inputName = "min";
    this.normalizeInput = (input) => toFloat(input);
    this.createValidator = (min) => minValidator(min);
  }
};
_MinValidator.\u0275fac = /* @__PURE__ */ (() => {
  let \u0275MinValidator_BaseFactory;
  return function MinValidator_Factory(t) {
    return (\u0275MinValidator_BaseFactory || (\u0275MinValidator_BaseFactory = \u0275\u0275getInheritedFactory(_MinValidator)))(t || _MinValidator);
  };
})();
_MinValidator.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
  type: _MinValidator,
  selectors: [["input", "type", "number", "min", "", "formControlName", ""], ["input", "type", "number", "min", "", "formControl", ""], ["input", "type", "number", "min", "", "ngModel", ""]],
  hostVars: 1,
  hostBindings: function MinValidator_HostBindings(rf, ctx) {
    if (rf & 2) {
      \u0275\u0275attribute("min", ctx._enabled ? ctx.min : null);
    }
  },
  inputs: {
    min: "min"
  },
  features: [\u0275\u0275ProvidersFeature([MIN_VALIDATOR]), \u0275\u0275InheritDefinitionFeature]
});
var MinValidator = _MinValidator;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MinValidator, [{
    type: Directive,
    args: [{
      selector: "input[type=number][min][formControlName],input[type=number][min][formControl],input[type=number][min][ngModel]",
      providers: [MIN_VALIDATOR],
      host: {
        "[attr.min]": "_enabled ? min : null"
      }
    }]
  }], null, {
    min: [{
      type: Input
    }]
  });
})();
var REQUIRED_VALIDATOR = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => RequiredValidator),
  multi: true
};
var CHECKBOX_REQUIRED_VALIDATOR = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => CheckboxRequiredValidator),
  multi: true
};
var _RequiredValidator = class _RequiredValidator extends AbstractValidatorDirective {
  constructor() {
    super(...arguments);
    this.inputName = "required";
    this.normalizeInput = booleanAttribute;
    this.createValidator = (input) => requiredValidator;
  }
  /** @nodoc */
  enabled(input) {
    return input;
  }
};
_RequiredValidator.\u0275fac = /* @__PURE__ */ (() => {
  let \u0275RequiredValidator_BaseFactory;
  return function RequiredValidator_Factory(t) {
    return (\u0275RequiredValidator_BaseFactory || (\u0275RequiredValidator_BaseFactory = \u0275\u0275getInheritedFactory(_RequiredValidator)))(t || _RequiredValidator);
  };
})();
_RequiredValidator.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
  type: _RequiredValidator,
  selectors: [["", "required", "", "formControlName", "", 3, "type", "checkbox"], ["", "required", "", "formControl", "", 3, "type", "checkbox"], ["", "required", "", "ngModel", "", 3, "type", "checkbox"]],
  hostVars: 1,
  hostBindings: function RequiredValidator_HostBindings(rf, ctx) {
    if (rf & 2) {
      \u0275\u0275attribute("required", ctx._enabled ? "" : null);
    }
  },
  inputs: {
    required: "required"
  },
  features: [\u0275\u0275ProvidersFeature([REQUIRED_VALIDATOR]), \u0275\u0275InheritDefinitionFeature]
});
var RequiredValidator = _RequiredValidator;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RequiredValidator, [{
    type: Directive,
    args: [{
      selector: ":not([type=checkbox])[required][formControlName],:not([type=checkbox])[required][formControl],:not([type=checkbox])[required][ngModel]",
      providers: [REQUIRED_VALIDATOR],
      host: {
        "[attr.required]": '_enabled ? "" : null'
      }
    }]
  }], null, {
    required: [{
      type: Input
    }]
  });
})();
var _CheckboxRequiredValidator = class _CheckboxRequiredValidator extends RequiredValidator {
  constructor() {
    super(...arguments);
    this.createValidator = (input) => requiredTrueValidator;
  }
};
_CheckboxRequiredValidator.\u0275fac = /* @__PURE__ */ (() => {
  let \u0275CheckboxRequiredValidator_BaseFactory;
  return function CheckboxRequiredValidator_Factory(t) {
    return (\u0275CheckboxRequiredValidator_BaseFactory || (\u0275CheckboxRequiredValidator_BaseFactory = \u0275\u0275getInheritedFactory(_CheckboxRequiredValidator)))(t || _CheckboxRequiredValidator);
  };
})();
_CheckboxRequiredValidator.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
  type: _CheckboxRequiredValidator,
  selectors: [["input", "type", "checkbox", "required", "", "formControlName", ""], ["input", "type", "checkbox", "required", "", "formControl", ""], ["input", "type", "checkbox", "required", "", "ngModel", ""]],
  hostVars: 1,
  hostBindings: function CheckboxRequiredValidator_HostBindings(rf, ctx) {
    if (rf & 2) {
      \u0275\u0275attribute("required", ctx._enabled ? "" : null);
    }
  },
  features: [\u0275\u0275ProvidersFeature([CHECKBOX_REQUIRED_VALIDATOR]), \u0275\u0275InheritDefinitionFeature]
});
var CheckboxRequiredValidator = _CheckboxRequiredValidator;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CheckboxRequiredValidator, [{
    type: Directive,
    args: [{
      selector: "input[type=checkbox][required][formControlName],input[type=checkbox][required][formControl],input[type=checkbox][required][ngModel]",
      providers: [CHECKBOX_REQUIRED_VALIDATOR],
      host: {
        "[attr.required]": '_enabled ? "" : null'
      }
    }]
  }], null, null);
})();
var EMAIL_VALIDATOR = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => EmailValidator),
  multi: true
};
var _EmailValidator = class _EmailValidator extends AbstractValidatorDirective {
  constructor() {
    super(...arguments);
    this.inputName = "email";
    this.normalizeInput = booleanAttribute;
    this.createValidator = (input) => emailValidator;
  }
  /** @nodoc */
  enabled(input) {
    return input;
  }
};
_EmailValidator.\u0275fac = /* @__PURE__ */ (() => {
  let \u0275EmailValidator_BaseFactory;
  return function EmailValidator_Factory(t) {
    return (\u0275EmailValidator_BaseFactory || (\u0275EmailValidator_BaseFactory = \u0275\u0275getInheritedFactory(_EmailValidator)))(t || _EmailValidator);
  };
})();
_EmailValidator.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
  type: _EmailValidator,
  selectors: [["", "email", "", "formControlName", ""], ["", "email", "", "formControl", ""], ["", "email", "", "ngModel", ""]],
  inputs: {
    email: "email"
  },
  features: [\u0275\u0275ProvidersFeature([EMAIL_VALIDATOR]), \u0275\u0275InheritDefinitionFeature]
});
var EmailValidator = _EmailValidator;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(EmailValidator, [{
    type: Directive,
    args: [{
      selector: "[email][formControlName],[email][formControl],[email][ngModel]",
      providers: [EMAIL_VALIDATOR]
    }]
  }], null, {
    email: [{
      type: Input
    }]
  });
})();
var MIN_LENGTH_VALIDATOR = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => MinLengthValidator),
  multi: true
};
var _MinLengthValidator = class _MinLengthValidator extends AbstractValidatorDirective {
  constructor() {
    super(...arguments);
    this.inputName = "minlength";
    this.normalizeInput = (input) => toInteger(input);
    this.createValidator = (minlength) => minLengthValidator(minlength);
  }
};
_MinLengthValidator.\u0275fac = /* @__PURE__ */ (() => {
  let \u0275MinLengthValidator_BaseFactory;
  return function MinLengthValidator_Factory(t) {
    return (\u0275MinLengthValidator_BaseFactory || (\u0275MinLengthValidator_BaseFactory = \u0275\u0275getInheritedFactory(_MinLengthValidator)))(t || _MinLengthValidator);
  };
})();
_MinLengthValidator.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
  type: _MinLengthValidator,
  selectors: [["", "minlength", "", "formControlName", ""], ["", "minlength", "", "formControl", ""], ["", "minlength", "", "ngModel", ""]],
  hostVars: 1,
  hostBindings: function MinLengthValidator_HostBindings(rf, ctx) {
    if (rf & 2) {
      \u0275\u0275attribute("minlength", ctx._enabled ? ctx.minlength : null);
    }
  },
  inputs: {
    minlength: "minlength"
  },
  features: [\u0275\u0275ProvidersFeature([MIN_LENGTH_VALIDATOR]), \u0275\u0275InheritDefinitionFeature]
});
var MinLengthValidator = _MinLengthValidator;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MinLengthValidator, [{
    type: Directive,
    args: [{
      selector: "[minlength][formControlName],[minlength][formControl],[minlength][ngModel]",
      providers: [MIN_LENGTH_VALIDATOR],
      host: {
        "[attr.minlength]": "_enabled ? minlength : null"
      }
    }]
  }], null, {
    minlength: [{
      type: Input
    }]
  });
})();
var MAX_LENGTH_VALIDATOR = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => MaxLengthValidator),
  multi: true
};
var _MaxLengthValidator = class _MaxLengthValidator extends AbstractValidatorDirective {
  constructor() {
    super(...arguments);
    this.inputName = "maxlength";
    this.normalizeInput = (input) => toInteger(input);
    this.createValidator = (maxlength) => maxLengthValidator(maxlength);
  }
};
_MaxLengthValidator.\u0275fac = /* @__PURE__ */ (() => {
  let \u0275MaxLengthValidator_BaseFactory;
  return function MaxLengthValidator_Factory(t) {
    return (\u0275MaxLengthValidator_BaseFactory || (\u0275MaxLengthValidator_BaseFactory = \u0275\u0275getInheritedFactory(_MaxLengthValidator)))(t || _MaxLengthValidator);
  };
})();
_MaxLengthValidator.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
  type: _MaxLengthValidator,
  selectors: [["", "maxlength", "", "formControlName", ""], ["", "maxlength", "", "formControl", ""], ["", "maxlength", "", "ngModel", ""]],
  hostVars: 1,
  hostBindings: function MaxLengthValidator_HostBindings(rf, ctx) {
    if (rf & 2) {
      \u0275\u0275attribute("maxlength", ctx._enabled ? ctx.maxlength : null);
    }
  },
  inputs: {
    maxlength: "maxlength"
  },
  features: [\u0275\u0275ProvidersFeature([MAX_LENGTH_VALIDATOR]), \u0275\u0275InheritDefinitionFeature]
});
var MaxLengthValidator = _MaxLengthValidator;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MaxLengthValidator, [{
    type: Directive,
    args: [{
      selector: "[maxlength][formControlName],[maxlength][formControl],[maxlength][ngModel]",
      providers: [MAX_LENGTH_VALIDATOR],
      host: {
        "[attr.maxlength]": "_enabled ? maxlength : null"
      }
    }]
  }], null, {
    maxlength: [{
      type: Input
    }]
  });
})();
var PATTERN_VALIDATOR = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => PatternValidator),
  multi: true
};
var _PatternValidator = class _PatternValidator extends AbstractValidatorDirective {
  constructor() {
    super(...arguments);
    this.inputName = "pattern";
    this.normalizeInput = (input) => input;
    this.createValidator = (input) => patternValidator(input);
  }
};
_PatternValidator.\u0275fac = /* @__PURE__ */ (() => {
  let \u0275PatternValidator_BaseFactory;
  return function PatternValidator_Factory(t) {
    return (\u0275PatternValidator_BaseFactory || (\u0275PatternValidator_BaseFactory = \u0275\u0275getInheritedFactory(_PatternValidator)))(t || _PatternValidator);
  };
})();
_PatternValidator.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
  type: _PatternValidator,
  selectors: [["", "pattern", "", "formControlName", ""], ["", "pattern", "", "formControl", ""], ["", "pattern", "", "ngModel", ""]],
  hostVars: 1,
  hostBindings: function PatternValidator_HostBindings(rf, ctx) {
    if (rf & 2) {
      \u0275\u0275attribute("pattern", ctx._enabled ? ctx.pattern : null);
    }
  },
  inputs: {
    pattern: "pattern"
  },
  features: [\u0275\u0275ProvidersFeature([PATTERN_VALIDATOR]), \u0275\u0275InheritDefinitionFeature]
});
var PatternValidator = _PatternValidator;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PatternValidator, [{
    type: Directive,
    args: [{
      selector: "[pattern][formControlName],[pattern][formControl],[pattern][ngModel]",
      providers: [PATTERN_VALIDATOR],
      host: {
        "[attr.pattern]": "_enabled ? pattern : null"
      }
    }]
  }], null, {
    pattern: [{
      type: Input
    }]
  });
})();
var SHARED_FORM_DIRECTIVES = [\u0275NgNoValidate, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, NumberValueAccessor, RangeValueAccessor, CheckboxControlValueAccessor, SelectControlValueAccessor, SelectMultipleControlValueAccessor, RadioControlValueAccessor, NgControlStatus, NgControlStatusGroup, RequiredValidator, MinLengthValidator, MaxLengthValidator, PatternValidator, CheckboxRequiredValidator, EmailValidator, MinValidator, MaxValidator];
var TEMPLATE_DRIVEN_DIRECTIVES = [NgModel, NgModelGroup, NgForm];
var REACTIVE_DRIVEN_DIRECTIVES = [FormControlDirective, FormGroupDirective, FormControlName, FormGroupName, FormArrayName];
var _\u0275InternalFormsSharedModule = class _\u0275InternalFormsSharedModule {
};
_\u0275InternalFormsSharedModule.\u0275fac = function \u0275InternalFormsSharedModule_Factory(t) {
  return new (t || _\u0275InternalFormsSharedModule)();
};
_\u0275InternalFormsSharedModule.\u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
  type: _\u0275InternalFormsSharedModule
});
_\u0275InternalFormsSharedModule.\u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({});
var \u0275InternalFormsSharedModule = _\u0275InternalFormsSharedModule;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(\u0275InternalFormsSharedModule, [{
    type: NgModule,
    args: [{
      declarations: SHARED_FORM_DIRECTIVES,
      exports: SHARED_FORM_DIRECTIVES
    }]
  }], null, null);
})();
var FormArray = class extends AbstractControl {
  /**
   * Creates a new `FormArray` instance.
   *
   * @param controls An array of child controls. Each child control is given an index
   * where it is registered.
   *
   * @param validatorOrOpts A synchronous validator function, or an array of
   * such functions, or an `AbstractControlOptions` object that contains validation functions
   * and a validation trigger.
   *
   * @param asyncValidator A single async validator or array of async validator functions
   *
   */
  constructor(controls, validatorOrOpts, asyncValidator) {
    super(pickValidators(validatorOrOpts), pickAsyncValidators(asyncValidator, validatorOrOpts));
    this.controls = controls;
    this._initObservables();
    this._setUpdateStrategy(validatorOrOpts);
    this._setUpControls();
    this.updateValueAndValidity({
      onlySelf: true,
      // If `asyncValidator` is present, it will trigger control status change from `PENDING` to
      // `VALID` or `INVALID`.
      // The status should be broadcasted via the `statusChanges` observable, so we set `emitEvent`
      // to `true` to allow that during the control creation process.
      emitEvent: !!this.asyncValidator
    });
  }
  /**
   * Get the `AbstractControl` at the given `index` in the array.
   *
   * @param index Index in the array to retrieve the control. If `index` is negative, it will wrap
   *     around from the back, and if index is greatly negative (less than `-length`), the result is
   * undefined. This behavior is the same as `Array.at(index)`.
   */
  at(index) {
    return this.controls[this._adjustIndex(index)];
  }
  /**
   * Insert a new `AbstractControl` at the end of the array.
   *
   * @param control Form control to be inserted
   * @param options Specifies whether this FormArray instance should emit events after a new
   *     control is added.
   * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
   * `valueChanges` observables emit events with the latest status and value when the control is
   * inserted. When false, no events are emitted.
   */
  push(control, options = {}) {
    this.controls.push(control);
    this._registerControl(control);
    this.updateValueAndValidity({
      emitEvent: options.emitEvent
    });
    this._onCollectionChange();
  }
  /**
   * Insert a new `AbstractControl` at the given `index` in the array.
   *
   * @param index Index in the array to insert the control. If `index` is negative, wraps around
   *     from the back. If `index` is greatly negative (less than `-length`), prepends to the array.
   * This behavior is the same as `Array.splice(index, 0, control)`.
   * @param control Form control to be inserted
   * @param options Specifies whether this FormArray instance should emit events after a new
   *     control is inserted.
   * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
   * `valueChanges` observables emit events with the latest status and value when the control is
   * inserted. When false, no events are emitted.
   */
  insert(index, control, options = {}) {
    this.controls.splice(index, 0, control);
    this._registerControl(control);
    this.updateValueAndValidity({
      emitEvent: options.emitEvent
    });
  }
  /**
   * Remove the control at the given `index` in the array.
   *
   * @param index Index in the array to remove the control.  If `index` is negative, wraps around
   *     from the back. If `index` is greatly negative (less than `-length`), removes the first
   *     element. This behavior is the same as `Array.splice(index, 1)`.
   * @param options Specifies whether this FormArray instance should emit events after a
   *     control is removed.
   * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
   * `valueChanges` observables emit events with the latest status and value when the control is
   * removed. When false, no events are emitted.
   */
  removeAt(index, options = {}) {
    let adjustedIndex = this._adjustIndex(index);
    if (adjustedIndex < 0) adjustedIndex = 0;
    if (this.controls[adjustedIndex]) this.controls[adjustedIndex]._registerOnCollectionChange(() => {
    });
    this.controls.splice(adjustedIndex, 1);
    this.updateValueAndValidity({
      emitEvent: options.emitEvent
    });
  }
  /**
   * Replace an existing control.
   *
   * @param index Index in the array to replace the control. If `index` is negative, wraps around
   *     from the back. If `index` is greatly negative (less than `-length`), replaces the first
   *     element. This behavior is the same as `Array.splice(index, 1, control)`.
   * @param control The `AbstractControl` control to replace the existing control
   * @param options Specifies whether this FormArray instance should emit events after an
   *     existing control is replaced with a new one.
   * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
   * `valueChanges` observables emit events with the latest status and value when the control is
   * replaced with a new one. When false, no events are emitted.
   */
  setControl(index, control, options = {}) {
    let adjustedIndex = this._adjustIndex(index);
    if (adjustedIndex < 0) adjustedIndex = 0;
    if (this.controls[adjustedIndex]) this.controls[adjustedIndex]._registerOnCollectionChange(() => {
    });
    this.controls.splice(adjustedIndex, 1);
    if (control) {
      this.controls.splice(adjustedIndex, 0, control);
      this._registerControl(control);
    }
    this.updateValueAndValidity({
      emitEvent: options.emitEvent
    });
    this._onCollectionChange();
  }
  /**
   * Length of the control array.
   */
  get length() {
    return this.controls.length;
  }
  /**
   * Sets the value of the `FormArray`. It accepts an array that matches
   * the structure of the control.
   *
   * This method performs strict checks, and throws an error if you try
   * to set the value of a control that doesn't exist or if you exclude the
   * value of a control.
   *
   * @usageNotes
   * ### Set the values for the controls in the form array
   *
   * ```
   * const arr = new FormArray([
   *   new FormControl(),
   *   new FormControl()
   * ]);
   * console.log(arr.value);   // [null, null]
   *
   * arr.setValue(['Nancy', 'Drew']);
   * console.log(arr.value);   // ['Nancy', 'Drew']
   * ```
   *
   * @param value Array of values for the controls
   * @param options Configure options that determine how the control propagates changes and
   * emits events after the value changes
   *
   * * `onlySelf`: When true, each change only affects this control, and not its parent. Default
   * is false.
   * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
   * `valueChanges`
   * observables emit events with the latest status and value when the control value is updated.
   * When false, no events are emitted.
   * The configuration options are passed to the {@link AbstractControl#updateValueAndValidity
   * updateValueAndValidity} method.
   */
  setValue(value, options = {}) {
    assertAllValuesPresent(this, false, value);
    value.forEach((newValue, index) => {
      assertControlPresent(this, false, index);
      this.at(index).setValue(newValue, {
        onlySelf: true,
        emitEvent: options.emitEvent
      });
    });
    this.updateValueAndValidity(options);
  }
  /**
   * Patches the value of the `FormArray`. It accepts an array that matches the
   * structure of the control, and does its best to match the values to the correct
   * controls in the group.
   *
   * It accepts both super-sets and sub-sets of the array without throwing an error.
   *
   * @usageNotes
   * ### Patch the values for controls in a form array
   *
   * ```
   * const arr = new FormArray([
   *    new FormControl(),
   *    new FormControl()
   * ]);
   * console.log(arr.value);   // [null, null]
   *
   * arr.patchValue(['Nancy']);
   * console.log(arr.value);   // ['Nancy', null]
   * ```
   *
   * @param value Array of latest values for the controls
   * @param options Configure options that determine how the control propagates changes and
   * emits events after the value changes
   *
   * * `onlySelf`: When true, each change only affects this control, and not its parent. Default
   * is false.
   * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
   * `valueChanges` observables emit events with the latest status and value when the control
   * value is updated. When false, no events are emitted. The configuration options are passed to
   * the {@link AbstractControl#updateValueAndValidity updateValueAndValidity} method.
   */
  patchValue(value, options = {}) {
    if (value == null) return;
    value.forEach((newValue, index) => {
      if (this.at(index)) {
        this.at(index).patchValue(newValue, {
          onlySelf: true,
          emitEvent: options.emitEvent
        });
      }
    });
    this.updateValueAndValidity(options);
  }
  /**
   * Resets the `FormArray` and all descendants are marked `pristine` and `untouched`, and the
   * value of all descendants to null or null maps.
   *
   * You reset to a specific form state by passing in an array of states
   * that matches the structure of the control. The state is a standalone value
   * or a form state object with both a value and a disabled status.
   *
   * @usageNotes
   * ### Reset the values in a form array
   *
   * ```ts
   * const arr = new FormArray([
   *    new FormControl(),
   *    new FormControl()
   * ]);
   * arr.reset(['name', 'last name']);
   *
   * console.log(arr.value);  // ['name', 'last name']
   * ```
   *
   * ### Reset the values in a form array and the disabled status for the first control
   *
   * ```
   * arr.reset([
   *   {value: 'name', disabled: true},
   *   'last'
   * ]);
   *
   * console.log(arr.value);  // ['last']
   * console.log(arr.at(0).status);  // 'DISABLED'
   * ```
   *
   * @param value Array of values for the controls
   * @param options Configure options that determine how the control propagates changes and
   * emits events after the value changes
   *
   * * `onlySelf`: When true, each change only affects this control, and not its parent. Default
   * is false.
   * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
   * `valueChanges`
   * observables emit events with the latest status and value when the control is reset.
   * When false, no events are emitted.
   * The configuration options are passed to the {@link AbstractControl#updateValueAndValidity
   * updateValueAndValidity} method.
   */
  reset(value = [], options = {}) {
    this._forEachChild((control, index) => {
      control.reset(value[index], {
        onlySelf: true,
        emitEvent: options.emitEvent
      });
    });
    this._updatePristine(options, this);
    this._updateTouched(options, this);
    this.updateValueAndValidity(options);
  }
  /**
   * The aggregate value of the array, including any disabled controls.
   *
   * Reports all values regardless of disabled status.
   */
  getRawValue() {
    return this.controls.map((control) => control.getRawValue());
  }
  /**
   * Remove all controls in the `FormArray`.
   *
   * @param options Specifies whether this FormArray instance should emit events after all
   *     controls are removed.
   * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
   * `valueChanges` observables emit events with the latest status and value when all controls
   * in this FormArray instance are removed. When false, no events are emitted.
   *
   * @usageNotes
   * ### Remove all elements from a FormArray
   *
   * ```ts
   * const arr = new FormArray([
   *    new FormControl(),
   *    new FormControl()
   * ]);
   * console.log(arr.length);  // 2
   *
   * arr.clear();
   * console.log(arr.length);  // 0
   * ```
   *
   * It's a simpler and more efficient alternative to removing all elements one by one:
   *
   * ```ts
   * const arr = new FormArray([
   *    new FormControl(),
   *    new FormControl()
   * ]);
   *
   * while (arr.length) {
   *    arr.removeAt(0);
   * }
   * ```
   */
  clear(options = {}) {
    if (this.controls.length < 1) return;
    this._forEachChild((control) => control._registerOnCollectionChange(() => {
    }));
    this.controls.splice(0);
    this.updateValueAndValidity({
      emitEvent: options.emitEvent
    });
  }
  /**
   * Adjusts a negative index by summing it with the length of the array. For very negative
   * indices, the result may remain negative.
   * @internal
   */
  _adjustIndex(index) {
    return index < 0 ? index + this.length : index;
  }
  /** @internal */
  _syncPendingControls() {
    let subtreeUpdated = this.controls.reduce((updated, child) => {
      return child._syncPendingControls() ? true : updated;
    }, false);
    if (subtreeUpdated) this.updateValueAndValidity({
      onlySelf: true
    });
    return subtreeUpdated;
  }
  /** @internal */
  _forEachChild(cb) {
    this.controls.forEach((control, index) => {
      cb(control, index);
    });
  }
  /** @internal */
  _updateValue() {
    this.value = this.controls.filter((control) => control.enabled || this.disabled).map((control) => control.value);
  }
  /** @internal */
  _anyControls(condition) {
    return this.controls.some((control) => control.enabled && condition(control));
  }
  /** @internal */
  _setUpControls() {
    this._forEachChild((control) => this._registerControl(control));
  }
  /** @internal */
  _allControlsDisabled() {
    for (const control of this.controls) {
      if (control.enabled) return false;
    }
    return this.controls.length > 0 || this.disabled;
  }
  _registerControl(control) {
    control.setParent(this);
    control._registerOnCollectionChange(this._onCollectionChange);
  }
  /** @internal */
  _find(name) {
    return this.at(name) ?? null;
  }
};
function isAbstractControlOptions(options) {
  return !!options && (options.asyncValidators !== void 0 || options.validators !== void 0 || options.updateOn !== void 0);
}
var _FormBuilder = class _FormBuilder {
  constructor() {
    this.useNonNullable = false;
  }
  /**
   * @description
   * Returns a FormBuilder in which automatically constructed `FormControl` elements
   * have `{nonNullable: true}` and are non-nullable.
   *
   * **Constructing non-nullable controls**
   *
   * When constructing a control, it will be non-nullable, and will reset to its initial value.
   *
   * ```ts
   * let nnfb = new FormBuilder().nonNullable;
   * let name = nnfb.control('Alex'); // FormControl<string>
   * name.reset();
   * console.log(name); // 'Alex'
   * ```
   *
   * **Constructing non-nullable groups or arrays**
   *
   * When constructing a group or array, all automatically created inner controls will be
   * non-nullable, and will reset to their initial values.
   *
   * ```ts
   * let nnfb = new FormBuilder().nonNullable;
   * let name = nnfb.group({who: 'Alex'}); // FormGroup<{who: FormControl<string>}>
   * name.reset();
   * console.log(name); // {who: 'Alex'}
   * ```
   * **Constructing *nullable* fields on groups or arrays**
   *
   * It is still possible to have a nullable field. In particular, any `FormControl` which is
   * *already* constructed will not be altered. For example:
   *
   * ```ts
   * let nnfb = new FormBuilder().nonNullable;
   * // FormGroup<{who: FormControl<string|null>}>
   * let name = nnfb.group({who: new FormControl('Alex')});
   * name.reset(); console.log(name); // {who: null}
   * ```
   *
   * Because the inner control is constructed explicitly by the caller, the builder has
   * no control over how it is created, and cannot exclude the `null`.
   */
  get nonNullable() {
    const nnfb = new _FormBuilder();
    nnfb.useNonNullable = true;
    return nnfb;
  }
  group(controls, options = null) {
    const reducedControls = this._reduceControls(controls);
    let newOptions = {};
    if (isAbstractControlOptions(options)) {
      newOptions = options;
    } else if (options !== null) {
      newOptions.validators = options.validator;
      newOptions.asyncValidators = options.asyncValidator;
    }
    return new FormGroup(reducedControls, newOptions);
  }
  /**
   * @description
   * Constructs a new `FormRecord` instance. Accepts a single generic argument, which is an object
   * containing all the keys and corresponding inner control types.
   *
   * @param controls A collection of child controls. The key for each child is the name
   * under which it is registered.
   *
   * @param options Configuration options object for the `FormRecord`. The object should have the
   * `AbstractControlOptions` type and might contain the following fields:
   * * `validators`: A synchronous validator function, or an array of validator functions.
   * * `asyncValidators`: A single async validator or array of async validator functions.
   * * `updateOn`: The event upon which the control should be updated (options: 'change' | 'blur'
   * | submit').
   */
  record(controls, options = null) {
    const reducedControls = this._reduceControls(controls);
    return new FormRecord(reducedControls, options);
  }
  /**
   * @description
   * Constructs a new `FormControl` with the given state, validators and options. Sets
   * `{nonNullable: true}` in the options to get a non-nullable control. Otherwise, the
   * control will be nullable. Accepts a single generic argument, which is the type  of the
   * control's value.
   *
   * @param formState Initializes the control with an initial state value, or
   * with an object that contains both a value and a disabled status.
   *
   * @param validatorOrOpts A synchronous validator function, or an array of
   * such functions, or a `FormControlOptions` object that contains
   * validation functions and a validation trigger.
   *
   * @param asyncValidator A single async validator or array of async validator
   * functions.
   *
   * @usageNotes
   *
   * ### Initialize a control as disabled
   *
   * The following example returns a control with an initial value in a disabled state.
   *
   * <code-example path="forms/ts/formBuilder/form_builder_example.ts" region="disabled-control">
   * </code-example>
   */
  control(formState, validatorOrOpts, asyncValidator) {
    let newOptions = {};
    if (!this.useNonNullable) {
      return new FormControl(formState, validatorOrOpts, asyncValidator);
    }
    if (isAbstractControlOptions(validatorOrOpts)) {
      newOptions = validatorOrOpts;
    } else {
      newOptions.validators = validatorOrOpts;
      newOptions.asyncValidators = asyncValidator;
    }
    return new FormControl(formState, __spreadProps(__spreadValues({}, newOptions), {
      nonNullable: true
    }));
  }
  /**
   * Constructs a new `FormArray` from the given array of configurations,
   * validators and options. Accepts a single generic argument, which is the type of each control
   * inside the array.
   *
   * @param controls An array of child controls or control configs. Each child control is given an
   *     index when it is registered.
   *
   * @param validatorOrOpts A synchronous validator function, or an array of such functions, or an
   *     `AbstractControlOptions` object that contains
   * validation functions and a validation trigger.
   *
   * @param asyncValidator A single async validator or array of async validator functions.
   */
  array(controls, validatorOrOpts, asyncValidator) {
    const createdControls = controls.map((c) => this._createControl(c));
    return new FormArray(createdControls, validatorOrOpts, asyncValidator);
  }
  /** @internal */
  _reduceControls(controls) {
    const createdControls = {};
    Object.keys(controls).forEach((controlName) => {
      createdControls[controlName] = this._createControl(controls[controlName]);
    });
    return createdControls;
  }
  /** @internal */
  _createControl(controls) {
    if (controls instanceof FormControl) {
      return controls;
    } else if (controls instanceof AbstractControl) {
      return controls;
    } else if (Array.isArray(controls)) {
      const value = controls[0];
      const validator = controls.length > 1 ? controls[1] : null;
      const asyncValidator = controls.length > 2 ? controls[2] : null;
      return this.control(value, validator, asyncValidator);
    } else {
      return this.control(controls);
    }
  }
};
_FormBuilder.\u0275fac = function FormBuilder_Factory(t) {
  return new (t || _FormBuilder)();
};
_FormBuilder.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
  token: _FormBuilder,
  factory: _FormBuilder.\u0275fac,
  providedIn: "root"
});
var FormBuilder = _FormBuilder;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FormBuilder, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
var _NonNullableFormBuilder = class _NonNullableFormBuilder {
};
_NonNullableFormBuilder.\u0275fac = function NonNullableFormBuilder_Factory(t) {
  return new (t || _NonNullableFormBuilder)();
};
_NonNullableFormBuilder.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
  token: _NonNullableFormBuilder,
  factory: () => (() => inject(FormBuilder).nonNullable)(),
  providedIn: "root"
});
var NonNullableFormBuilder = _NonNullableFormBuilder;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NonNullableFormBuilder, [{
    type: Injectable,
    args: [{
      providedIn: "root",
      useFactory: () => inject(FormBuilder).nonNullable
    }]
  }], null, null);
})();
var _UntypedFormBuilder = class _UntypedFormBuilder extends FormBuilder {
  group(controlsConfig, options = null) {
    return super.group(controlsConfig, options);
  }
  /**
   * Like `FormBuilder#control`, except the resulting control is untyped.
   */
  control(formState, validatorOrOpts, asyncValidator) {
    return super.control(formState, validatorOrOpts, asyncValidator);
  }
  /**
   * Like `FormBuilder#array`, except the resulting array is untyped.
   */
  array(controlsConfig, validatorOrOpts, asyncValidator) {
    return super.array(controlsConfig, validatorOrOpts, asyncValidator);
  }
};
_UntypedFormBuilder.\u0275fac = /* @__PURE__ */ (() => {
  let \u0275UntypedFormBuilder_BaseFactory;
  return function UntypedFormBuilder_Factory(t) {
    return (\u0275UntypedFormBuilder_BaseFactory || (\u0275UntypedFormBuilder_BaseFactory = \u0275\u0275getInheritedFactory(_UntypedFormBuilder)))(t || _UntypedFormBuilder);
  };
})();
_UntypedFormBuilder.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
  token: _UntypedFormBuilder,
  factory: _UntypedFormBuilder.\u0275fac,
  providedIn: "root"
});
var UntypedFormBuilder = _UntypedFormBuilder;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(UntypedFormBuilder, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
var VERSION = new Version("18.0.6");
var _FormsModule = class _FormsModule {
  /**
   * @description
   * Provides options for configuring the forms module.
   *
   * @param opts An object of configuration options
   * * `callSetDisabledState` Configures whether to `always` call `setDisabledState`, which is more
   * correct, or to only call it `whenDisabled`, which is the legacy behavior.
   */
  static withConfig(opts) {
    return {
      ngModule: _FormsModule,
      providers: [{
        provide: CALL_SET_DISABLED_STATE,
        useValue: opts.callSetDisabledState ?? setDisabledStateDefault
      }]
    };
  }
};
_FormsModule.\u0275fac = function FormsModule_Factory(t) {
  return new (t || _FormsModule)();
};
_FormsModule.\u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
  type: _FormsModule
});
_FormsModule.\u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({
  imports: [\u0275InternalFormsSharedModule]
});
var FormsModule = _FormsModule;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FormsModule, [{
    type: NgModule,
    args: [{
      declarations: TEMPLATE_DRIVEN_DIRECTIVES,
      exports: [\u0275InternalFormsSharedModule, TEMPLATE_DRIVEN_DIRECTIVES]
    }]
  }], null, null);
})();
var _ReactiveFormsModule = class _ReactiveFormsModule {
  /**
   * @description
   * Provides options for configuring the reactive forms module.
   *
   * @param opts An object of configuration options
   * * `warnOnNgModelWithFormControl` Configures when to emit a warning when an `ngModel`
   * binding is used with reactive form directives.
   * * `callSetDisabledState` Configures whether to `always` call `setDisabledState`, which is more
   * correct, or to only call it `whenDisabled`, which is the legacy behavior.
   */
  static withConfig(opts) {
    return {
      ngModule: _ReactiveFormsModule,
      providers: [{
        provide: NG_MODEL_WITH_FORM_CONTROL_WARNING,
        useValue: opts.warnOnNgModelWithFormControl ?? "always"
      }, {
        provide: CALL_SET_DISABLED_STATE,
        useValue: opts.callSetDisabledState ?? setDisabledStateDefault
      }]
    };
  }
};
_ReactiveFormsModule.\u0275fac = function ReactiveFormsModule_Factory(t) {
  return new (t || _ReactiveFormsModule)();
};
_ReactiveFormsModule.\u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
  type: _ReactiveFormsModule
});
_ReactiveFormsModule.\u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({
  imports: [\u0275InternalFormsSharedModule]
});
var ReactiveFormsModule = _ReactiveFormsModule;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ReactiveFormsModule, [{
    type: NgModule,
    args: [{
      declarations: [REACTIVE_DRIVEN_DIRECTIVES],
      exports: [\u0275InternalFormsSharedModule, REACTIVE_DRIVEN_DIRECTIVES]
    }]
  }], null, null);
})();

// src/app/components/footer/footer.component.ts
var _c03 = ["password"];
var _c12 = (a0) => ({ "darkmode": a0 });
var _c22 = (a0) => ({ "anmeldedivOpen": a0 });
function FooterComponent_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 12);
    \u0275\u0275listener("click", function FooterComponent_Conditional_10_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.anmeldeBtnClick());
    });
    \u0275\u0275element(1, "fa-icon", 13);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("icon", ctx_r3.faRightToBracket);
  }
}
function FooterComponent_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 9)(1, "ul")(2, "li")(3, "a", 14);
    \u0275\u0275text(4, "Dashboard");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(5, "div", 15)(6, "ul");
    \u0275\u0275element(7, "li", 16)(8, "li", 17)(9, "li", 18)(10, "li", 19)(11, "li", 20)(12, "li", 21);
    \u0275\u0275elementEnd()()();
  }
}
var _FooterComponent = class _FooterComponent {
  constructor(dl, http, Router2, auth) {
    this.dl = dl;
    this.http = http;
    this.Router = Router2;
    this.auth = auth;
    this.anmeldeInputVisible = false;
    this.faRightToBracket = faRightToBracket;
  }
  anmeldeBtnClick() {
    this.anmeldeInputVisible = !this.anmeldeInputVisible;
    this.passwordInput.nativeElement.focus();
  }
  anmelden(password) {
    return __async(this, null, function* () {
      try {
        yield firstValueFrom(this.http.post("/api/login", { password }, { responseType: "text", observe: "response" }));
        console.log("Login erfolgreich");
        this.Router.navigate(["/dashboard"]);
      } catch (error) {
        switch (error.status) {
          case 401:
            console.log("Login verweigert");
            break;
          case 500:
            const password2 = prompt("Initalisierung erforderlich. Bitte neues Passwort vergeben:");
            yield firstValueFrom(this.http.post("/api/init", { password: password2 }, { responseType: "text", observe: "response" }));
            if (password2)
              this.anmelden(password2);
            break;
          default:
            console.log("Login nicht erfolgreich: ", error);
        }
      }
    });
  }
};
_FooterComponent.\u0275fac = function FooterComponent_Factory(t) {
  return new (t || _FooterComponent)(\u0275\u0275directiveInject(DesignloaderService), \u0275\u0275directiveInject(HttpClient), \u0275\u0275directiveInject(Router), \u0275\u0275directiveInject(AuthGuard));
};
_FooterComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _FooterComponent, selectors: [["app-footer"]], viewQuery: function FooterComponent_Query(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275viewQuery(_c03, 5);
  }
  if (rf & 2) {
    let _t;
    \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.passwordInput = _t.first);
  }
}, decls: 19, vars: 8, consts: [["password", ""], [3, "ngClass"], [1, "anmeldediv", 3, "ngClass"], [1, "inputfeld"], ["for", "username", 2, "display", "none"], ["type", "text", "id", "username", "name", "username", "autocomplete", "username", "aria-hidden", "true", 2, "display", "none"], ["type", "password", "id", "password", "name", "password", "autocomplete", "new-password", "spellcheck", "false", "placeholder", "\xA0", 3, "keyup.enter"], ["for", "password", 1, "placeholder"], [1, "btnicon"], [1, "adminDiv"], ["routerLink", "/datenschutz"], ["routerLink", "/impressum"], [1, "btnicon", 3, "click"], [3, "icon"], ["routerLink", "/dashboard"], [1, "farbpalettenDiv"], ["title", "primary-color"], ["title", "primary-variant-darker"], ["title", "primary-variant-brighter"], ["title", "primary-variant-much-brighter"], ["title", "hintergrund-variant"], ["title", "hintergrund-variant-darker"]], template: function FooterComponent_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "footer", 1)(1, "div", 2)(2, "form", 3)(3, "label", 4);
    \u0275\u0275text(4, "Benutzername:");
    \u0275\u0275elementEnd();
    \u0275\u0275element(5, "input", 5);
    \u0275\u0275elementStart(6, "input", 6, 0);
    \u0275\u0275listener("keyup.enter", function FooterComponent_Template_input_keyup_enter_6_listener() {
      \u0275\u0275restoreView(_r1);
      const password_r2 = \u0275\u0275reference(7);
      return \u0275\u0275resetView(ctx.anmelden(password_r2.value));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "label", 7);
    \u0275\u0275text(9, "Passwort");
    \u0275\u0275elementEnd()();
    \u0275\u0275template(10, FooterComponent_Conditional_10_Template, 2, 1, "button", 8)(11, FooterComponent_Conditional_11_Template, 13, 0, "div", 9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "ul")(13, "li")(14, "a", 10);
    \u0275\u0275text(15, "Datenschutz");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "li")(17, "a", 11);
    \u0275\u0275text(18, "Impressum");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(4, _c12, ctx.dl.darkmode.value));
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(6, _c22, ctx.anmeldeInputVisible));
    \u0275\u0275advance(9);
    \u0275\u0275conditional(!ctx.auth.checkToken() ? 10 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx.auth.checkToken() ? 11 : -1);
  }
}, dependencies: [NgClass, RouterLink, FaIconComponent, \u0275NgNoValidate, NgControlStatusGroup, NgForm], styles: ["\n\n[_nghost-%COMP%] {\n  margin-top: auto;\n}\nfooter[_ngcontent-%COMP%] {\n  display: flex;\n  position: sticky;\n  z-index: 1;\n  background-color: var(--body);\n  margin-top: 10em;\n}\nfooter[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%] {\n  display: inline-flex;\n  margin: 0;\n  padding: 0;\n}\nfooter[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  margin: 0.4rem;\n  display: flex;\n  align-items: center;\n}\n.anmeldediv[_ngcontent-%COMP%] {\n  margin: auto auto auto 0;\n  position: relative;\n  display: flex;\n  align-items: center;\n}\n.anmeldediv[_ngcontent-%COMP%]   .inputfeld[_ngcontent-%COMP%] {\n  height: 35px;\n  width: 0;\n  margin-left: 5px;\n}\n.anmeldedivOpen[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_fromLeft 1s forwards;\n}\n.anmeldedivOpen[_ngcontent-%COMP%]   .inputfeld[_ngcontent-%COMP%] {\n  width: 100px;\n}\n@keyframes _ngcontent-%COMP%_fromLeft {\n  0% {\n    left: -100px;\n  }\n  100% {\n    left: 0;\n  }\n}\n.adminDiv[_ngcontent-%COMP%] {\n  display: flex;\n  height: 100%;\n}\n.farbpalettenDiv[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  height: 30px;\n  width: 30px;\n  border-radius: 8px;\n}\n.farbpalettenDiv[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:nth-child(1) {\n  background-color: var(--primary-color);\n}\n.farbpalettenDiv[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:nth-child(2) {\n  background-color: var(--primary-variant-darker);\n}\n.farbpalettenDiv[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:nth-child(3) {\n  background-color: var(--primary-variant-brighter);\n}\n.farbpalettenDiv[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:nth-child(4) {\n  background-color: var(--primary-variant-much-brighter);\n}\n.farbpalettenDiv[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:nth-child(5) {\n  background-color: var(--hintergrund-variant);\n}\n.farbpalettenDiv[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:nth-child(6) {\n  background-color: var(--hintergrund-variant-darker);\n}\n@media only screen and (max-width: 700px) {\n  .farbpalettenDiv[_ngcontent-%COMP%] {\n    display: none;\n  }\n}\n/*# sourceMappingURL=footer.component.css.map */"] });
var FooterComponent = _FooterComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(FooterComponent, { className: "FooterComponent", filePath: "src/app/components/footer/footer.component.ts", lineNumber: 17 });
})();

// src/app/routes/datenschutz/datenschutz.component.ts
var _DatenschutzComponent = class _DatenschutzComponent {
  constructor(titleService, cs) {
    this.titleService = titleService;
    this.cs = cs;
    this.titleService.setTitle("Datenschutzerkl\xE4rung");
  }
  deleteCookies() {
    this.cs.deleteAllCookies();
    alert("Allle Cookies gel\xF6scht.");
  }
};
_DatenschutzComponent.\u0275fac = function DatenschutzComponent_Factory(t) {
  return new (t || _DatenschutzComponent)(\u0275\u0275directiveInject(Title), \u0275\u0275directiveInject(CookiesService));
};
_DatenschutzComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _DatenschutzComponent, selectors: [["app-datenschutz"]], decls: 107, vars: 0, consts: [[1, "sectiondiv"], ["target", "_blank", "href", "mailto:MailvonRico@gmail.com"], ["target", "_blank", "href", "https://dsgvo-gesetz.de/art-6-dsgvo/", 1, "dsgvo"], [1, "einger\xFCckt"], ["target", "_blank", "href", "https://www.e-recht24.de/artikel/datenschutz/12962-was-sind-essenzielle-cookies.html", 1, "dsgvo"], [1, "btntext", 3, "click"], ["href", "https://api.zippopotam.us"], ["href", "https://www.justizadressen.nrw.de/de/justiz/suche"], ["target", "_blank", "href", "https://dsgvo-gesetz.de/art-13-dsgvo/", 1, "dsgvo"]], template: function DatenschutzComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-header");
    \u0275\u0275elementStart(1, "section")(2, "div", 0)(3, "h1");
    \u0275\u0275text(4, "Datenschutzerkl\xE4rung");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "h2");
    \u0275\u0275text(6, "Verantwortlicher");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "span");
    \u0275\u0275text(8, "Rico Angenvoort");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "span");
    \u0275\u0275text(10, "Pommernstra\xDFe 48");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "span");
    \u0275\u0275text(12, "34497 Korbach");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "a", 1);
    \u0275\u0275text(14, "MailvonRico@gmail.com");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "h2");
    \u0275\u0275text(16, "Antragsformular");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "p");
    \u0275\u0275text(18, "Nach dem Abschlie\xDFen des Antragsformulars werden die eingegeben Daten an den Webserver gesendet. Dies ist technisch notwendig, damit der Antrag als PDF generiert werden kann. Die Daten werden nur f\xFCr die Generierung des Antrages genutzt. ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "p");
    \u0275\u0275text(20, "Im Antragsformular werden die Pflichtangaben klar von den optionalen Angaben unterschieden. Die Pflichtangaben sind die Minimalangaben, die f\xFCr den Antrag ben\xF6tigt werden.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "p");
    \u0275\u0275text(22, "Die IP-Adresse wird zwangsl\xE4ufig \xFCbertragen.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "p");
    \u0275\u0275text(24, "Die Rechtsgrundlage f\xFCr die Pflichtangaben und \xDCbertagung der IP-Adresse ist das berechtigte Interesse gem\xE4\xDF ");
    \u0275\u0275elementStart(25, "a", 2);
    \u0275\u0275text(26, "Art. 6 (1) f)DSGVO");
    \u0275\u0275elementEnd();
    \u0275\u0275text(27, ". Dies begr\xFCndet sich damit, dass ohne diese Daten kein Antragsgenerierung m\xF6glich ist. Die Antragsgenerierung liegt auch im Interesse des Nutzers.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "p");
    \u0275\u0275text(29, "F\xFCr die optionalen Angaben gilt mit der freiwilligen Angabe eine stillschweigende Einwilligung gem\xE4\xDF ");
    \u0275\u0275elementStart(30, "a", 2);
    \u0275\u0275text(31, "Art. 6 (1) a) DSGVO");
    \u0275\u0275elementEnd();
    \u0275\u0275text(32, ". ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "h2");
    \u0275\u0275text(34, "Cookies");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(35, "p");
    \u0275\u0275text(36, "Cookies werden lediglich f\xFCr die Speicherung der vom Nutzer vorgenommenen Designeinstellungen verwendet. ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(37, "h3");
    \u0275\u0275text(38, 'Cookie "Darkmode"');
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(39, "p", 3);
    \u0275\u0275text(40, "Speichert die Auswahl des Designschemas (hell oder dunkel). Ohne Cookie wird die Systemeinstellung verwendet. ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(41, "h3");
    \u0275\u0275text(42, 'Cookie "Farbe"');
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(43, "p", 3);
    \u0275\u0275text(44, "Speichert die Auswahl der Farbe der Webseite. Ohne Cookie wird die Farbe blau verwendet.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(45, "p");
    \u0275\u0275text(46, "Es ist ");
    \u0275\u0275elementStart(47, "a", 4);
    \u0275\u0275text(48, " rechtlich umstritten");
    \u0275\u0275elementEnd();
    \u0275\u0275text(49, ", ob Desigen-Cookies als essentiellle Cookies gem\xE4\xDF ");
    \u0275\u0275elementStart(50, "a", 2);
    \u0275\u0275text(51, "Art. 6 (1) f) DSGVO");
    \u0275\u0275elementEnd();
    \u0275\u0275text(52, " gelten. Deshalb wird die Einwilligung eingeholt gem\xE4\xDF ");
    \u0275\u0275elementStart(53, "a", 2);
    \u0275\u0275text(54, "Art. 6 (1) a) DSGVO");
    \u0275\u0275elementEnd();
    \u0275\u0275text(55, ". Die Dauer der Speicherung betr\xE4gt f\xFCr beide Cookies 90 Tage.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(56, "button", 5);
    \u0275\u0275listener("click", function DatenschutzComponent_Template_button_click_56_listener() {
      return ctx.deleteCookies();
    });
    \u0275\u0275text(57, "Cookies l\xF6schen");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(58, "h2");
    \u0275\u0275text(59, "Drittanbieterdienste");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(60, "p");
    \u0275\u0275text(61, "Bei dem Aufruf von Drittanbieterdiensten wird zwangsl\xE4ufig die IP-Adresse \xFCbertragen. ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(62, "h3");
    \u0275\u0275text(63, "PLZ-API");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(64, "p", 3);
    \u0275\u0275text(65, "Um den Ort anhand der von Ihnen eingegeben Postleitzahl zu ermitteln, wird die API ");
    \u0275\u0275elementStart(66, "a", 6);
    \u0275\u0275text(67, "api.zippopotam.us");
    \u0275\u0275elementEnd();
    \u0275\u0275text(68, " verwendet. Die von Ihnen eingegebe Postleitzahl wird \xFCbertragen.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(69, "h3");
    \u0275\u0275text(70, "Justizportal");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(71, "p", 3);
    \u0275\u0275text(72, "Um das zust\xE4ndige Gericht zu ermitteln, wird das ");
    \u0275\u0275elementStart(73, "a", 7);
    \u0275\u0275text(74, "Justizportal");
    \u0275\u0275elementEnd();
    \u0275\u0275text(75, " verwendt. Dazu wird ebenfalls die von Ihnen eigegebene Postleitzahl \xFCbertragen. Wenn bei den Grundst\xFCcksdaten keine Postleitzahl angegeben wird, erfolgt auch keine Abfrage.");
    \u0275\u0275elementEnd();
    \u0275\u0275element(76, "br");
    \u0275\u0275elementStart(77, "p");
    \u0275\u0275text(78, "Die Rechtsgrundlage ist das berechtigte Interesse gem\xE4\xDF ");
    \u0275\u0275elementStart(79, "a", 2);
    \u0275\u0275text(80, "Art. 6 (1) f) DSGVO");
    \u0275\u0275elementEnd();
    \u0275\u0275text(81, ". Diese Dienste werden verwendet damit das Ausf\xFCllen des Antragsformulars erleichtert wird. Dies liegt auch im Interesse des Nutzers. ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(82, "h2");
    \u0275\u0275text(83, "Gesetzliche Belehrungen");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(84, "p");
    \u0275\u0275text(85, " Sie werden belehrt \xFCber das Bestehen eines Rechts");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(86, "ul")(87, "li");
    \u0275\u0275text(88, "gem\xE4\xDF ");
    \u0275\u0275elementStart(89, "a", 8);
    \u0275\u0275text(90, "Art. 13 (2) b) DSGVO");
    \u0275\u0275elementEnd();
    \u0275\u0275text(91, " auf Auskunft seitens des Verantwortlichen \xFCber die betreffenden personenbezogenen Daten sowie auf Berichtigung oder L\xF6schung oder auf Einschr\xE4nkung der Verarbeitung oder eines Widerspruchsrechts gegen die Verarbeitung sowie das Recht auf Daten\xFCbertragbarkeit.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(92, "li");
    \u0275\u0275text(93, "gem\xE4\xDF ");
    \u0275\u0275elementStart(94, "a", 8);
    \u0275\u0275text(95, "Art. 13 (2) c) DSGVO");
    \u0275\u0275elementEnd();
    \u0275\u0275text(96, " auf Widerruf einer abgegebenen Einwilligung zur Verarbeitung personenbezogener Daten. ");
    \u0275\u0275elementStart(97, "button", 5);
    \u0275\u0275listener("click", function DatenschutzComponent_Template_button_click_97_listener() {
      return ctx.deleteCookies();
    });
    \u0275\u0275text(98, "Cookies l\xF6schen");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(99, "li");
    \u0275\u0275text(100, "gem\xE4\xDF ");
    \u0275\u0275elementStart(101, "a", 8);
    \u0275\u0275text(102, "Art. 13 (2) d) DSGVO");
    \u0275\u0275elementEnd();
    \u0275\u0275text(103, " auf Beschwerde bei einer Aufsichtsbeh\xF6rde.");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(104, "p");
    \u0275\u0275text(105, "Ihre Bereitstellung der personenbezogenen Daten ist nicht gesetzlich oder vertraglich vorgeschrieben, jedoch f\xFCr die Generierung des Antrags erforderlich. Sie sind nicht verpflichtet Daten bereitzustellen. Die Nichtbreitstellung hat zur Folge, dass Sie keinen Antrag generieren lassen k\xF6nnen.");
    \u0275\u0275elementEnd()()();
    \u0275\u0275element(106, "app-footer");
  }
}, dependencies: [HeaderComponent, FooterComponent], styles: ['@charset "UTF-8";\n\n\n\np[_ngcontent-%COMP%] {\n  margin: 0.5rem 0;\n}\nh2[_ngcontent-%COMP%], \n.darkmode[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  width: 100%;\n  text-align: center;\n  margin: 1em 0 0.5em 0;\n}\nh3[_ngcontent-%COMP%] {\n  font-weight: bold;\n  margin: 0.5em 0 0 1em;\n}\n.sectiondiv[_ngcontent-%COMP%] {\n  align-items: flex-start;\n  margin-bottom: 1em;\n}\n.sectiondiv[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  list-style: circle;\n}\n.einger\\fc ckt[_ngcontent-%COMP%] {\n  margin-left: 1em;\n}\n/*# sourceMappingURL=datenschutz.component.css.map */'] });
var DatenschutzComponent = _DatenschutzComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(DatenschutzComponent, { className: "DatenschutzComponent", filePath: "src/app/routes/datenschutz/datenschutz.component.ts", lineNumber: 10 });
})();

// node_modules/@fortawesome/free-regular-svg-icons/index.mjs
var faUser = {
  prefix: "far",
  iconName: "user",
  icon: [448, 512, [128100, 62144], "f007", "M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464H398.7c-8.9-63.3-63.3-112-129-112H178.3c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3z"]
};
var faFileWord = {
  prefix: "far",
  iconName: "file-word",
  icon: [384, 512, [], "f1c2", "M48 448V64c0-8.8 7.2-16 16-16H224v80c0 17.7 14.3 32 32 32h80V448c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16zM64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V154.5c0-17-6.7-33.3-18.7-45.3L274.7 18.7C262.7 6.7 246.5 0 229.5 0H64zm55 241.1c-3.8-12.7-17.2-19.9-29.9-16.1s-19.9 17.2-16.1 29.9l48 160c3 10.2 12.4 17.1 23 17.1s19.9-7 23-17.1l25-83.4 25 83.4c3 10.2 12.4 17.1 23 17.1s19.9-7 23-17.1l48-160c3.8-12.7-3.4-26.1-16.1-29.9s-26.1 3.4-29.9 16.1l-25 83.4-25-83.4c-3-10.2-12.4-17.1-23-17.1s-19.9 7-23 17.1l-25 83.4-25-83.4z"]
};
var faFilePdf = {
  prefix: "far",
  iconName: "file-pdf",
  icon: [512, 512, [], "f1c1", "M64 464l48 0 0 48-48 0c-35.3 0-64-28.7-64-64L0 64C0 28.7 28.7 0 64 0L229.5 0c17 0 33.3 6.7 45.3 18.7l90.5 90.5c12 12 18.7 28.3 18.7 45.3L384 304l-48 0 0-144-80 0c-17.7 0-32-14.3-32-32l0-80L64 48c-8.8 0-16 7.2-16 16l0 384c0 8.8 7.2 16 16 16zM176 352l32 0c30.9 0 56 25.1 56 56s-25.1 56-56 56l-16 0 0 32c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-48 0-80c0-8.8 7.2-16 16-16zm32 80c13.3 0 24-10.7 24-24s-10.7-24-24-24l-16 0 0 48 16 0zm96-80l32 0c26.5 0 48 21.5 48 48l0 64c0 26.5-21.5 48-48 48l-32 0c-8.8 0-16-7.2-16-16l0-128c0-8.8 7.2-16 16-16zm32 128c8.8 0 16-7.2 16-16l0-64c0-8.8-7.2-16-16-16l-16 0 0 96 16 0zm80-112c0-8.8 7.2-16 16-16l48 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-32 0 0 32 32 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-32 0 0 48c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-64 0-64z"]
};
var faEnvelope = {
  prefix: "far",
  iconName: "envelope",
  icon: [512, 512, [128386, 9993, 61443], "f0e0", "M64 112c-8.8 0-16 7.2-16 16v22.1L220.5 291.7c20.7 17 50.4 17 71.1 0L464 150.1V128c0-8.8-7.2-16-16-16H64zM48 212.2V384c0 8.8 7.2 16 16 16H448c8.8 0 16-7.2 16-16V212.2L322 328.8c-38.4 31.5-93.7 31.5-132 0L48 212.2zM0 128C0 92.7 28.7 64 64 64H448c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128z"]
};
var faCircleUser = {
  prefix: "far",
  iconName: "circle-user",
  icon: [512, 512, [62142, "user-circle"], "f2bd", "M406.5 399.6C387.4 352.9 341.5 320 288 320H224c-53.5 0-99.4 32.9-118.5 79.6C69.9 362.2 48 311.7 48 256C48 141.1 141.1 48 256 48s208 93.1 208 208c0 55.7-21.9 106.2-57.5 143.6zm-40.1 32.7C334.4 452.4 296.6 464 256 464s-78.4-11.6-110.5-31.7c7.3-36.7 39.7-64.3 78.5-64.3h64c38.8 0 71.2 27.6 78.5 64.3zM256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-272a40 40 0 1 1 0-80 40 40 0 1 1 0 80zm-88-40a88 88 0 1 0 176 0 88 88 0 1 0 -176 0z"]
};

// src/app/services/form.service.ts
var _FormService = class _FormService {
  constructor(http, scroll) {
    this.http = http;
    this.scroll = scroll;
    this.Step = new BehaviorSubject(1);
  }
  init(form) {
    this.form = form;
    this.form.get("grundst\xFCck").get("plz")?.valueChanges.subscribe((plz) => this.sucheGrundbuchamt(plz));
  }
  nextStep(step = this.Step.value + 1) {
    this.Step.next(step);
    this.scroll.scrollToPosition([0, 0]);
  }
  getCurrentStepBehaviorSubject() {
    return this.Step.asObservable();
  }
  getCurrentStep() {
    return this.Step.value;
  }
  back() {
    this.Step.next(this.Step.value - 1);
  }
  restart() {
    this.Step.next(1);
  }
  ortAusPLZ(plz) {
    return __async(this, null, function* () {
      let url = "https://api.zippopotam.us/de/" + plz;
      try {
        const json = yield lastValueFrom(this.http.get(url));
        if (json.places && json.places.length > 0) {
          return json.places[0]["place name"];
        } else {
          return null;
        }
      } catch (error) {
        console.error(error);
        return null;
      }
    });
  }
  sucheGrundbuchamt(plz) {
    return __async(this, null, function* () {
      if (plz.length === 5) {
        try {
          let jsonAmtsgerichtDaten = yield this.AmtsgerichtAusPLZ(plz);
          const grundbuchamtForm = this.form.get("grundbuchamt");
          grundbuchamtForm.setValue({
            name: jsonAmtsgerichtDaten["amtsgericht"],
            stra\u00DFe: jsonAmtsgerichtDaten["stra\xDFe"],
            plz: jsonAmtsgerichtDaten["plz"],
            ort: jsonAmtsgerichtDaten["ort"]
          });
          console.log(grundbuchamtForm.get("name")?.value + " wurde ermittelt.");
        } catch (err) {
          console.error("Das Amtsgericht konnte nicht ermittelt werden.");
          console.error(err);
        }
      }
    });
  }
  AmtsgerichtAusPLZ(plz) {
    return new Promise((resolve, reject) => __async(this, null, function* () {
      try {
        const url = "/api/amtsgerichtausplz";
        const res = yield lastValueFrom(this.http.get(url, { params: new HttpParams().set("plz", plz) }));
        resolve(res);
      } catch (err) {
        reject(err);
      }
    }));
  }
};
_FormService.\u0275fac = function FormService_Factory(t) {
  return new (t || _FormService)(\u0275\u0275inject(HttpClient), \u0275\u0275inject(ViewportScroller));
};
_FormService.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _FormService, factory: _FormService.\u0275fac, providedIn: "root" });
var FormService = _FormService;

// src/app/components/forms/antragsteller/antragsteller.component.ts
function AntragstellerComponent_Conditional_50_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 38);
    \u0275\u0275listener("click", function AntragstellerComponent_Conditional_50_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.fs.back());
    });
    \u0275\u0275text(1, "zur\xFCck");
    \u0275\u0275elementEnd();
  }
}
var _AntragstellerComponent = class _AntragstellerComponent {
  constructor(fs) {
    this.fs = fs;
    this.faCircleUser = faCircleUser;
    this.form = fs.form.get("antragsteller");
    this.form.get("plz")?.valueChanges.subscribe((plz) => __async(this, null, function* () {
      if (plz.length === 5) {
        let ort = yield this.fs.ortAusPLZ(plz);
        this.form.controls["ort"].setValue(ort);
      }
    }));
  }
  next() {
    if (this.form.valid)
      this.fs.nextStep();
  }
};
_AntragstellerComponent.\u0275fac = function AntragstellerComponent_Factory(t) {
  return new (t || _AntragstellerComponent)(\u0275\u0275directiveInject(FormService));
};
_AntragstellerComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AntragstellerComponent, selectors: [["app-antragsteller"]], decls: 53, vars: 3, consts: [["id", "antragsteller", 1, "seite", 2, "display", "block", 3, "formGroup"], [1, "formularcontent"], [1, "inputfelder"], [1, "zeileAnrede"], [1, "anredediv", "radiobuttontogglediv"], [1, "radiobuttonchip"], ["type", "radio", "id", "herr", "name", "anrede", "value", "Herr", "formControlName", "anrede"], ["for", "herr"], ["type", "radio", "id", "frau", "name", "anrede", "value", "Frau", "formControlName", "anrede"], ["for", "frau"], ["id", "vorname", 1, "inputfeld"], ["formControlName", "vorname", "type", "text", "id", "vornameinput", "name", "vorname", "required", "", "spellcheck", "false", "placeholder", "\xA0"], ["for", "vornameinput", 1, "placeholder"], ["id", "nachname", 1, "inputfeld"], ["formControlName", "nachname", "type", "text", "id", "nachnameinput", "name", "nachname", "required", "", "spellcheck", "false", "placeholder", "\xA0"], ["for", "nachnameinput", 1, "placeholder"], ["id", "stra\xDFe", 1, "inputfeld"], ["formControlName", "stra\xDFe", "type", "text", "id", "stra\xDFeinput", "name", "stra\xDFe", "required", "", "spellcheck", "false", "placeholder", "\xA0"], ["for", "stra\xDFeinput", 1, "placeholder"], ["id", "postleitzahl", 1, "inputfeld"], ["formControlName", "plz", "type", "text", "inputmode", "numeric", "id", "postleitzahlinput", "name", "postleitzahl", "required", "", "spellcheck", "false", "placeholder", "\xA0"], ["for", "postleitzahlinput", 1, "placeholder"], ["id", "ort", 1, "inputfeld"], ["formControlName", "ort", "type", "text", "id", "ortinput", "name", "ort", "required", "", "spellcheck", "false", "placeholder", "\xA0"], ["for", "ortinput", 1, "placeholder"], [1, "hrdiv"], [1, "formularerkl\xE4rung"], ["id", "telefonnummer", 1, "inputfeld"], ["formControlName", "telefonnummer", "type", "tel", "id", "telefonnummerinput", "name", "telefonnummer", "spellcheck", "false", "placeholder", "\xA0"], ["for", "telefonnummerinput", 1, "placeholder"], ["id", "email", 1, "inputfeld"], ["formControlName", "email", "type", "email", "id", "emailinput", "name", "email", "spellcheck", "false", "placeholder", "\xA0"], ["for", "emailinput", 1, "placeholder"], [1, "profilicon"], [3, "icon"], [1, "formNavBtn"], ["type", "button", 1, "btntext"], ["id", "weiterbtn", "type", "submit", 1, "btnoutlined", 3, "click"], ["type", "button", 1, "btntext", 3, "click"]], template: function AntragstellerComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "form", 0)(1, "h2");
    \u0275\u0275text(2, "Antragsteller");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 1)(4, "div", 2)(5, "div", 3)(6, "div", 4)(7, "div", 5);
    \u0275\u0275element(8, "input", 6);
    \u0275\u0275elementStart(9, "label", 7);
    \u0275\u0275text(10, "Herr");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "div", 5);
    \u0275\u0275element(12, "input", 8);
    \u0275\u0275elementStart(13, "label", 9);
    \u0275\u0275text(14, "Frau");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(15, "div", 10);
    \u0275\u0275element(16, "input", 11);
    \u0275\u0275elementStart(17, "label", 12);
    \u0275\u0275text(18, "Vorname");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(19, "div", 13);
    \u0275\u0275element(20, "input", 14);
    \u0275\u0275elementStart(21, "label", 15);
    \u0275\u0275text(22, "Nachname");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(23, "div", 16);
    \u0275\u0275element(24, "input", 17);
    \u0275\u0275elementStart(25, "label", 18);
    \u0275\u0275text(26, "Stra\xDFe + Hausnummer");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(27, "div", 19);
    \u0275\u0275element(28, "input", 20);
    \u0275\u0275elementStart(29, "label", 21);
    \u0275\u0275text(30, "PLZ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(31, "div", 22);
    \u0275\u0275element(32, "input", 23);
    \u0275\u0275elementStart(33, "label", 24);
    \u0275\u0275text(34, "Ort");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(35, "div", 25);
    \u0275\u0275element(36, "hr");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(37, "div", 26);
    \u0275\u0275text(38, "Otionale Angaben f\xFCr m\xF6gliche R\xFCckfragen des Grundbuchamts:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(39, "div", 27);
    \u0275\u0275element(40, "input", 28);
    \u0275\u0275elementStart(41, "label", 29);
    \u0275\u0275text(42, "Telefonnummer");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(43, "div", 30);
    \u0275\u0275element(44, "input", 31);
    \u0275\u0275elementStart(45, "label", 32);
    \u0275\u0275text(46, "E-Mail");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(47, "div", 33);
    \u0275\u0275element(48, "fa-icon", 34);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(49, "div", 35);
    \u0275\u0275template(50, AntragstellerComponent_Conditional_50_Template, 2, 0, "button", 36);
    \u0275\u0275elementStart(51, "button", 37);
    \u0275\u0275listener("click", function AntragstellerComponent_Template_button_click_51_listener() {
      return ctx.next();
    });
    \u0275\u0275text(52, "Weiter");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    \u0275\u0275property("formGroup", ctx.form);
    \u0275\u0275advance(48);
    \u0275\u0275property("icon", ctx.faCircleUser);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx.fs.getCurrentStep() > 1 ? 50 : -1);
  }
}, dependencies: [FaIconComponent, \u0275NgNoValidate, DefaultValueAccessor, RadioControlValueAccessor, NgControlStatus, NgControlStatusGroup, RequiredValidator, FormGroupDirective, FormControlName], styles: ['@charset "UTF-8";\n\n\n\n[_nghost-%COMP%] {\n  background-color: inherit;\n}\n#antragsteller[_ngcontent-%COMP%]   .formularcontent[_ngcontent-%COMP%] {\n  flex-wrap: nowrap;\n  background-color: inherit;\n  display: flex;\n}\n.inputfelder[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: space-between;\n  background-color: inherit;\n}\n.inputfelder[_ngcontent-%COMP%]   .inputfeld[_ngcontent-%COMP%] {\n  width: 48%;\n}\n#telefonnummer[_ngcontent-%COMP%] {\n  width: 40%;\n}\n#email[_ngcontent-%COMP%] {\n  width: 58%;\n}\n#stra\\df e[_ngcontent-%COMP%] {\n  width: 100%;\n}\nfa-icon[_ngcontent-%COMP%] {\n  font-size: 10rem;\n  color: rgb(204, 204, 204);\n  margin: 0.2em 0.4em;\n}\n.material-icons-outlined[_ngcontent-%COMP%] {\n  font-size: 10rem;\n  color: rgb(204, 204, 204);\n  margin: 0.2em 0.4em;\n}\nhr[_ngcontent-%COMP%] {\n  margin: 0.5em 0;\n  width: 80%;\n  display: block;\n}\n.formNavBtn[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: flex-end;\n}\n.hrdiv[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: center;\n  width: 100%;\n}\nlabel[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n}\n@media only screen and (max-width: 580px) {\n  .inputfelder[_ngcontent-%COMP%]   .inputfeld[_ngcontent-%COMP%] {\n    width: 100%;\n  }\n  #telefonnummer[_ngcontent-%COMP%] {\n    width: 100%;\n  }\n  #email[_ngcontent-%COMP%] {\n    width: 100%;\n  }\n}\n@media only screen and (max-width: 950px) {\n  .profilicon[_ngcontent-%COMP%] {\n    display: none;\n  }\n}\n.anredediv[_ngcontent-%COMP%] {\n  display: inline-flex;\n  margin-bottom: 0.5em;\n}\n.zeileAnrede[_ngcontent-%COMP%] {\n  width: 100%;\n}\n/*# sourceMappingURL=antragsteller.component.css.map */'] });
var AntragstellerComponent = _AntragstellerComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AntragstellerComponent, { className: "AntragstellerComponent", filePath: "src/app/components/forms/antragsteller/antragsteller.component.ts", lineNumber: 13 });
})();

// src/app/components/forms/grundstueck/grundstueck.component.ts
function GrundstueckComponent_Conditional_39_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 29);
    \u0275\u0275listener("click", function GrundstueckComponent_Conditional_39_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.fs.back());
    });
    \u0275\u0275text(1, "zur\xFCck");
    \u0275\u0275elementEnd();
  }
}
var _GrundstueckComponent = class _GrundstueckComponent {
  constructor(fs) {
    this.fs = fs;
    this.form = fs.form.get("grundst\xFCck");
    this.form.get("plz")?.valueChanges.subscribe((plz) => __async(this, null, function* () {
      if (plz.length === 5) {
        let ort = yield this.fs.ortAusPLZ(plz);
        this.form.controls["ort"].setValue(ort);
      }
    }));
  }
  anschriftuebernehmen() {
    let antragstellerForm = this.fs.form.get("antragsteller");
    this.form.controls["plz"].setValue(antragstellerForm?.get("plz")?.value);
    this.form.controls["stra\xDFe"].setValue(antragstellerForm?.get("stra\xDFe")?.value);
    this.form.controls["ort"].setValue(antragstellerForm?.get("ort")?.value);
  }
  next() {
    if (this.form.valid)
      this.fs.nextStep();
  }
};
_GrundstueckComponent.\u0275fac = function GrundstueckComponent_Factory(t) {
  return new (t || _GrundstueckComponent)(\u0275\u0275directiveInject(FormService));
};
_GrundstueckComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _GrundstueckComponent, selectors: [["app-grundstueck"]], decls: 42, vars: 2, consts: [["id", "#Grundst\xFCcksdaten", 1, "seite", 3, "formGroup"], [1, "inputfelder"], [1, "formularerkl\xE4rung"], ["id", "gemarkung", 1, "inputfeld"], ["formControlName", "gemarkung", "type", "text", "id", "gemarkunginput", "name", "gemarkung", "spellcheck", "false", "placeholder", "\xA0"], ["for", "gemarkunginput", 1, "placeholder"], ["id", "blattnummer", 1, "inputfeld"], ["formControlName", "blattnummer", "type", "number", "id", "blattnummerinput", "name", "blattnummer", "spellcheck", "false", "placeholder", "\xA0"], ["for", "blattnummerinput", 1, "placeholder"], [1, "hrdiv"], ["id", "anschrift\xFCbernehmen", "type", "button", 1, "btntext", 3, "click"], ["id", "stra\xDFegrundst\xFCck", 1, "inputfeld"], ["formControlName", "stra\xDFe", "type", "text", "id", "stra\xDFegrundst\xFCckinput", "name", "stra\xDFegrundst\xFCck", "spellcheck", "false", "placeholder", "\xA0"], ["for", "stra\xDFegrundst\xFCckinput", 1, "placeholder"], ["id", "postleitzahlgrundst\xFCck", 1, "inputfeld"], ["formControlName", "plz", "name", "postleitzahlgrundst\xFCck", "spellcheck", "false", "placeholder", "\xA0"], ["for", "postleitzahlgrundst\xFCckinput", 1, "placeholder"], ["id", "ortgrundst\xFCck", 1, "inputfeld"], ["formControlName", "ort", "type", "text", "id", "ortgrundst\xFCckinput", "name", "ortgrundst\xFCck", "spellcheck", "false", "placeholder", "\xA0"], ["for", "ortgrundst\xFCckinput", 1, "placeholder"], ["id", "flur", 1, "inputfeld"], ["formControlName", "flur", "type", "number", "id", "flurinput", "name", "flur", "spellcheck", "false", "placeholder", "\xA0"], ["for", "flurinput", 1, "placeholder"], ["id", "flurst\xFCck", 1, "inputfeld"], ["formControlName", "flurst\xFCck", "type", "text", "id", "flurst\xFCckinput", "name", "flurst\xFCck", "spellcheck", "false", "placeholder", "\xA0"], ["for", "flurst\xFCckinput", 1, "placeholder"], [1, "formNavBtn"], ["type", "button", 1, "btntext"], ["id", "weiterbtn", "type", "submit", 1, "btnoutlined", 3, "click"], ["type", "button", 1, "btntext", 3, "click"]], template: function GrundstueckComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "form", 0)(1, "h2");
    \u0275\u0275text(2, "Grundst\xFCcksangaben");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 1)(4, "div", 2);
    \u0275\u0275text(5, "Welche Angaben zum Grundst\xFCck k\xF6nnen Sie machen? Geben Sie an, was Sie wissen. Es muss nicht alles ausgef\xFCllt werden. (Nur die Anschrift ist z.B. auch ausreichend) ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 3);
    \u0275\u0275element(7, "input", 4);
    \u0275\u0275elementStart(8, "label", 5);
    \u0275\u0275text(9, "Gemarkung (Ortsteil)");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "div", 6);
    \u0275\u0275element(11, "input", 7);
    \u0275\u0275elementStart(12, "label", 8);
    \u0275\u0275text(13, "Grundbuchblattnummer");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "div", 9);
    \u0275\u0275element(15, "hr");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "button", 10);
    \u0275\u0275listener("click", function GrundstueckComponent_Template_button_click_16_listener() {
      return ctx.anschriftuebernehmen();
    });
    \u0275\u0275text(17, " Anschrift vom Antragsteller \xFCbernehmen ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "div", 11);
    \u0275\u0275element(19, "input", 12);
    \u0275\u0275elementStart(20, "label", 13);
    \u0275\u0275text(21, "Stra\xDFe + Hausnummer");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(22, "div", 14);
    \u0275\u0275element(23, "input", 15);
    \u0275\u0275elementStart(24, "label", 16);
    \u0275\u0275text(25, "PLZ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(26, "div", 17);
    \u0275\u0275element(27, "input", 18);
    \u0275\u0275elementStart(28, "label", 19);
    \u0275\u0275text(29, "Ort");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(30, "div", 20);
    \u0275\u0275element(31, "input", 21);
    \u0275\u0275elementStart(32, "label", 22);
    \u0275\u0275text(33, "Flur");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(34, "div", 23);
    \u0275\u0275element(35, "input", 24);
    \u0275\u0275elementStart(36, "label", 25);
    \u0275\u0275text(37, "Flurst\xFCck");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(38, "div", 26);
    \u0275\u0275template(39, GrundstueckComponent_Conditional_39_Template, 2, 0, "button", 27);
    \u0275\u0275elementStart(40, "button", 28);
    \u0275\u0275listener("click", function GrundstueckComponent_Template_button_click_40_listener() {
      return ctx.next();
    });
    \u0275\u0275text(41, "Weiter");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    \u0275\u0275property("formGroup", ctx.form);
    \u0275\u0275advance(39);
    \u0275\u0275conditional(ctx.fs.getCurrentStep() > 1 ? 39 : -1);
  }
}, dependencies: [\u0275NgNoValidate, DefaultValueAccessor, NumberValueAccessor, NgControlStatus, NgControlStatusGroup, FormGroupDirective, FormControlName], styles: ["\n\n.formularcontent[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  background-color: inherit;\n}\n[_nghost-%COMP%] {\n  background-color: inherit;\n}\n.inputfelder[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: space-between;\n  background-color: inherit;\n}\n.inputfelder[_ngcontent-%COMP%]   .inputfeld[_ngcontent-%COMP%] {\n  width: 48%;\n}\nhr[_ngcontent-%COMP%] {\n  margin: 0.5em 0;\n  width: 80%;\n  display: block;\n}\n.hrdiv[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: center;\n  width: 100%;\n}\n@media only screen and (max-width: 580px) {\n  .inputfelder[_ngcontent-%COMP%]   .inputfeld[_ngcontent-%COMP%] {\n    width: 100%;\n  }\n}\n.formNavBtn[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: flex-end;\n}\n/*# sourceMappingURL=grundstueck.component.css.map */"] });
var GrundstueckComponent = _GrundstueckComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(GrundstueckComponent, { className: "GrundstueckComponent", filePath: "src/app/components/forms/grundstueck/grundstueck.component.ts", lineNumber: 10 });
})();

// src/app/components/forms/berechtigtes-interesse/berechtigtes-interesse.component.ts
function BerechtigtesInteresseComponent_Conditional_51_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 24);
    \u0275\u0275listener("click", function BerechtigtesInteresseComponent_Conditional_51_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.fs.back());
    });
    \u0275\u0275text(1, "zur\xFCck");
    \u0275\u0275elementEnd();
  }
}
var _BerechtigtesInteresseComponent = class _BerechtigtesInteresseComponent {
  constructor(fs) {
    this.fs = fs;
    this.form = fs.form.get("berechtigtesInteresse");
  }
  next() {
    if (this.form.valid)
      this.fs.nextStep();
  }
};
_BerechtigtesInteresseComponent.\u0275fac = function BerechtigtesInteresseComponent_Factory(t) {
  return new (t || _BerechtigtesInteresseComponent)(\u0275\u0275directiveInject(FormService));
};
_BerechtigtesInteresseComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _BerechtigtesInteresseComponent, selectors: [["app-berechtigtes-interesse"]], decls: 54, vars: 2, consts: [["id", "berechtigtesinteresse", 1, "seite", 3, "formGroup"], [1, "formularcontent"], [1, "inputfelder"], [1, "formularerkl\xE4rung"], [1, "radiochip"], ["formControlName", "berechtigtesInteresse", "id", "b1", "type", "radio", "value", "Ich bin Eigent\xFCmer"], ["for", "b1"], ["formControlName", "berechtigtesInteresse", "id", "b2", "type", "radio", "value", "Ich habe eine schriftliche Vollmacht"], ["for", "b2"], [1, "rot"], ["formControlName", "berechtigtesInteresse", "id", "b3", "type", "radio", "value", "Ich bin Erbe"], ["for", "b3"], ["formControlName", "berechtigtesInteresse", "id", "b4", "type", "radio", "value", "Ich habe ein eingetragenes Recht im Grundbuch"], ["for", "b4"], ["formControlName", "berechtigtesInteresse", "id", "b5", "type", "radio", "value", "Ich bin Gl\xE4ubiger mit einem eingetragenen Grundpfandrecht"], ["for", "b5"], ["formControlName", "berechtigtesInteresse", "id", "b6", "type", "radio", "value", "Ich habe einen Vollstreckungstitel"], ["for", "b6"], ["formControlName", "berechtigtesInteresse", "id", "b7", "type", "radio", "value", "siehe Bemerkungen"], ["for", "b7"], ["formControlName", "bemerkung", "id", "bemerkung", "name", "bemerkung", "maxlength", "300"], [1, "formNavBtn"], ["type", "button", 1, "btntext"], ["id", "weiterbtn", "type", "submit", 1, "btnoutlined", 3, "click"], ["type", "button", 1, "btntext", 3, "click"]], template: function BerechtigtesInteresseComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "form", 0)(1, "h2");
    \u0275\u0275text(2, "Berechtigtes Interesse");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 1)(4, "div", 2)(5, "div", 3);
    \u0275\u0275text(6, " Nicht jeder ist berechtigt Einsicht in das Grundbuch zu nehmen. Bitte legen Sie Ihr berechtigtes Interesse dar.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "ul")(8, "li", 4);
    \u0275\u0275element(9, "input", 5);
    \u0275\u0275elementStart(10, "label", 6);
    \u0275\u0275text(11, "Ich bin Eigent\xFCmer");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "li", 4);
    \u0275\u0275element(13, "input", 7);
    \u0275\u0275elementStart(14, "label", 8)(15, "span");
    \u0275\u0275text(16, " Ich habe eine schriftliche Vollmacht ");
    \u0275\u0275elementStart(17, "span", 9);
    \u0275\u0275text(18, "\xA0(Vollmacht beif\xFCgen!)");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(19, "li", 4);
    \u0275\u0275element(20, "input", 10);
    \u0275\u0275elementStart(21, "label", 11)(22, "span");
    \u0275\u0275text(23, " Ich bin Erbe und habe einen Erbnachweis");
    \u0275\u0275elementStart(24, "span", 9);
    \u0275\u0275text(25, "\xA0(Kopie beif\xFCgen!)");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(26, "li", 4);
    \u0275\u0275element(27, "input", 12);
    \u0275\u0275elementStart(28, "label", 13);
    \u0275\u0275text(29, "Ich habe ein eingetragenes Recht im Grundbuch");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(30, "li", 4);
    \u0275\u0275element(31, "input", 14);
    \u0275\u0275elementStart(32, "label", 15);
    \u0275\u0275text(33, "Ich bin Gl\xE4ubiger mit einem eingetragenen Grundpfandrecht");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(34, "li", 4);
    \u0275\u0275element(35, "input", 16);
    \u0275\u0275elementStart(36, "label", 17)(37, "span");
    \u0275\u0275text(38, " Ich habe einen Vollstreckungstitel ");
    \u0275\u0275elementStart(39, "span", 9);
    \u0275\u0275text(40, "\xA0(Kopie beif\xFCgen!)");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(41, "li", 4);
    \u0275\u0275element(42, "input", 18);
    \u0275\u0275elementStart(43, "label", 19);
    \u0275\u0275text(44, "Sonstiger Grund ");
    \u0275\u0275elementStart(45, "span", 9);
    \u0275\u0275text(46, "\xA0(begr\xFCnden!)");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(47, "div");
    \u0275\u0275text(48, "Bemerkungen f\xFCr das Grundbuchamt:");
    \u0275\u0275elementEnd();
    \u0275\u0275element(49, "textarea", 20);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(50, "div", 21);
    \u0275\u0275template(51, BerechtigtesInteresseComponent_Conditional_51_Template, 2, 0, "button", 22);
    \u0275\u0275elementStart(52, "button", 23);
    \u0275\u0275listener("click", function BerechtigtesInteresseComponent_Template_button_click_52_listener() {
      return ctx.next();
    });
    \u0275\u0275text(53, "Weiter");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    \u0275\u0275property("formGroup", ctx.form);
    \u0275\u0275advance(51);
    \u0275\u0275conditional(ctx.fs.getCurrentStep() > 1 ? 51 : -1);
  }
}, dependencies: [\u0275NgNoValidate, DefaultValueAccessor, RadioControlValueAccessor, NgControlStatus, NgControlStatusGroup, MaxLengthValidator, FormGroupDirective, FormControlName], styles: ["\n\n#berechtigtesinteresse[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  display: flex;\n  margin: 0.5rem 0;\n}\nul[_ngcontent-%COMP%] {\n  padding-left: 1rem;\n}\n#berechtigtesinteresse[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 5em;\n  resize: vertical;\n  background-color: var(--hintergrund-inputfeld);\n  color: var(--schrift);\n}\n@media only screen and (max-width: 580px) {\n  #berechtigtesinteresse[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%] {\n    padding-left: 0em;\n  }\n}\n.formNavBtn[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: flex-end;\n}\n/*# sourceMappingURL=berechtigtes-interesse.component.css.map */"] });
var BerechtigtesInteresseComponent = _BerechtigtesInteresseComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(BerechtigtesInteresseComponent, { className: "BerechtigtesInteresseComponent", filePath: "src/app/components/forms/berechtigtes-interesse/berechtigtes-interesse.component.ts", lineNumber: 10 });
})();

// src/app/components/forms/grundbuchamt/grundbuchamt.component.ts
function GrundbuchamtComponent_Conditional_29_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 3);
    \u0275\u0275listener("click", function GrundbuchamtComponent_Conditional_29_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.fs.back());
    });
    \u0275\u0275text(1, "zur\xFCck");
    \u0275\u0275elementEnd();
  }
}
var _GrundbuchamtComponent = class _GrundbuchamtComponent {
  constructor(fs, http) {
    this.fs = fs;
    this.http = http;
    this.form = fs.form.get("grundbuchamt");
    this.form.get("plz")?.valueChanges.subscribe((plz) => __async(this, null, function* () {
      if (plz.length === 5) {
        let ort = yield this.fs.ortAusPLZ(plz);
        this.form.controls["ort"].setValue(ort);
      }
    }));
  }
  next() {
    if (this.form.valid)
      this.fs.nextStep();
  }
  onlineSuchen() {
    window.open("https://www.justizadressen.nrw.de/de/justiz/gericht?ang=grundbuch&plz=" + this.fs.form.get("grundst\xFCck").get("plz")?.value + "&ort=");
  }
};
_GrundbuchamtComponent.\u0275fac = function GrundbuchamtComponent_Factory(t) {
  return new (t || _GrundbuchamtComponent)(\u0275\u0275directiveInject(FormService), \u0275\u0275directiveInject(HttpClient));
};
_GrundbuchamtComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _GrundbuchamtComponent, selectors: [["app-grundbuchamt"]], decls: 32, vars: 2, consts: [["id", "#Gundbuchamt", 1, "seite", 3, "formGroup"], [1, "inputfelder"], [1, "formularerkl\xE4rung"], ["type", "button", 1, "btntext", 3, "click"], ["id", "#labelagermittelt", 2, "color", "green", "display", "none"], [1, "hrdiv"], ["id", "nameamtsgericht", 1, "inputfeld"], ["formControlName", "name", "id", "nameamtsgerichtinput", "type", "text", "name", "nameag", "required", "", "spellcheck", "false", "placeholder", "\xA0"], ["for", "nameamtsgerichtinput", 1, "placeholder"], ["id", "stra\xDFeamtsgericht", 1, "inputfeld"], ["formControlName", "stra\xDFe", "id", "stra\xDFeamtsgerichtinput", "type", "text", "name", "stra\xDFeag", "required", "", "spellcheck", "false", "placeholder", "\xA0"], ["for", "stra\xDFeamtsgerichtinput", 1, "placeholder"], ["id", "postleitzahlamtsgericht", 1, "inputfeld"], ["formControlName", "plz", "spellcheck", "false", "placeholder", "\xA0"], ["for", "postleitzahlamtsgerichtinput", 1, "placeholder"], ["id", "ortamtsgericht", 1, "inputfeld"], ["formControlName", "ort", "type", "text", "required", "", "name", "ortag", "id", "ortamtsgerichtinput", "spellcheck", "false", "placeholder", "\xA0"], ["for", "ortamtsgerichtinput", 1, "placeholder"], [1, "formNavBtn"], ["type", "button", 1, "btntext"], ["id", "weiterbtn", "type", "submit", 1, "btnoutlined", 3, "click"]], template: function GrundbuchamtComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "form", 0)(1, "h2");
    \u0275\u0275text(2, "Zust\xE4ndiges Grundbuchamt");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 1)(4, "div", 2);
    \u0275\u0275text(5, "Zuletzt werden die Daten des zust\xE4ndigen Grundbuchamtes (Amtsgericht) ben\xF6tigt");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "button", 3);
    \u0275\u0275listener("click", function GrundbuchamtComponent_Template_button_click_6_listener() {
      return ctx.onlineSuchen();
    });
    \u0275\u0275text(7, " Zust\xE4ndiges Grundbuchamt im Justizportal suchen ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "span", 4);
    \u0275\u0275text(9, "Folgende Daten konnten automatisch ermittelt werden:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "div", 5);
    \u0275\u0275element(11, "hr");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "div", 6);
    \u0275\u0275element(13, "input", 7);
    \u0275\u0275elementStart(14, "label", 8);
    \u0275\u0275text(15, "Name des Amtsgerichts");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "div", 9);
    \u0275\u0275element(17, "input", 10);
    \u0275\u0275elementStart(18, "label", 11);
    \u0275\u0275text(19, "Stra\xDFe + Hausnummer");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(20, "div", 12);
    \u0275\u0275element(21, "input", 13);
    \u0275\u0275elementStart(22, "label", 14);
    \u0275\u0275text(23, "PLZ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(24, "div", 15);
    \u0275\u0275element(25, "input", 16);
    \u0275\u0275elementStart(26, "label", 17);
    \u0275\u0275text(27, "Ort");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(28, "div", 18);
    \u0275\u0275template(29, GrundbuchamtComponent_Conditional_29_Template, 2, 0, "button", 19);
    \u0275\u0275elementStart(30, "button", 20);
    \u0275\u0275listener("click", function GrundbuchamtComponent_Template_button_click_30_listener() {
      return ctx.next();
    });
    \u0275\u0275text(31, "Weiter");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    \u0275\u0275property("formGroup", ctx.form);
    \u0275\u0275advance(29);
    \u0275\u0275conditional(ctx.fs.getCurrentStep() > 1 ? 29 : -1);
  }
}, dependencies: [\u0275NgNoValidate, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, RequiredValidator, FormGroupDirective, FormControlName], styles: ["\n\n.formularcontent[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  background-color: inherit;\n}\n.seite[_ngcontent-%COMP%] {\n  background-color: inherit;\n}\n[_nghost-%COMP%] {\n  background-color: inherit;\n}\n.inputfelder[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: space-between;\n  background-color: inherit;\n}\n.formNavBtn[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: flex-end;\n}\n.inputfelder[_ngcontent-%COMP%]   .inputfeld[_ngcontent-%COMP%] {\n  width: 48%;\n}\nhr[_ngcontent-%COMP%] {\n  margin: 0.5em 0;\n  width: 80%;\n  display: block;\n}\n.hrdiv[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: center;\n  width: 100%;\n}\n@media only screen and (max-width: 580px) {\n  .inputfelder[_ngcontent-%COMP%]   .inputfeld[_ngcontent-%COMP%] {\n    width: 100%;\n  }\n}\n/*# sourceMappingURL=grundbuchamt.component.css.map */"] });
var GrundbuchamtComponent = _GrundbuchamtComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(GrundbuchamtComponent, { className: "GrundbuchamtComponent", filePath: "src/app/components/forms/grundbuchamt/grundbuchamt.component.ts", lineNumber: 12 });
})();

// src/app/components/progress-spinner/progress-spinner.component.ts
var _c04 = ["circle"];
var _c13 = (a0) => ({ "endless": a0 });
var _ProgressSpinnerComponent = class _ProgressSpinnerComponent {
  constructor() {
    this.prozent = 100;
    this.endless = false;
  }
  ngAfterViewInit() {
    this.radius = this.circle.nativeElement.getAttribute("r");
    this.circumference = this.radius * 2 * Math.PI;
    this.circle.nativeElement.style.strokeDasharray = `${this.circumference} ${this.circumference}`;
    this.circle.nativeElement.style.strokeDashoffset = `${this.circumference}`;
    this.setProgress(this.prozent);
  }
  ngOnChanges(changes) {
    if (changes["prozent"] && this.circle) {
      const percent = parseInt(changes["prozent"].currentValue);
      this.setProgress(percent);
    }
    if (changes["endless"] && this.circle) {
      this.setProgress(40);
    }
  }
  setProgress(percent) {
    const offset = this.circumference - percent / 100 * this.circumference;
    this.circle.nativeElement.style.strokeDashoffset = offset;
  }
};
_ProgressSpinnerComponent.\u0275fac = function ProgressSpinnerComponent_Factory(t) {
  return new (t || _ProgressSpinnerComponent)();
};
_ProgressSpinnerComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ProgressSpinnerComponent, selectors: [["app-progress-spinner"]], viewQuery: function ProgressSpinnerComponent_Query(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275viewQuery(_c04, 5);
  }
  if (rf & 2) {
    let _t;
    \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.circle = _t.first);
  }
}, inputs: { prozent: "prozent", endless: "endless" }, features: [\u0275\u0275NgOnChangesFeature], decls: 3, vars: 3, consts: [["circle", ""], ["width", "40", "height", "40", "viewBox", "0 0 40 40", 3, "ngClass"], ["cx", "-20", "cy", "20", "r", "17", "fill", "tranparent"]], template: function ProgressSpinnerComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(0, "svg", 1);
    \u0275\u0275element(1, "circle", 2, 0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(1, _c13, ctx.endless));
  }
}, dependencies: [NgClass], styles: ["\n\n[_nghost-%COMP%] {\n  height: 40px;\n  width: 40px;\n}\ncircle[_ngcontent-%COMP%] {\n  transition: 0.3s stroke-dashoffset;\n  transform: rotate(-90deg);\n  stroke: var(--primary-color);\n  stroke-width: 4;\n  fill: transparent;\n  background-color: red;\n  z-index: 2;\n  stroke-dashoffset: 277.717;\n  stroke-dasharray: 326.726, 326.726;\n}\n.endless[_ngcontent-%COMP%] {\n  animation-name: _ngcontent-%COMP%_loading;\n  animation-duration: 700ms;\n  animation-iteration-count: infinite;\n  animation-timing-function: linear;\n}\n@keyframes _ngcontent-%COMP%_loading {\n  from {\n    transform: rotate(0deg);\n  }\n  to {\n    transform: rotate(360deg);\n  }\n}\n/*# sourceMappingURL=progress-spinner.component.css.map */"] });
var ProgressSpinnerComponent = _ProgressSpinnerComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ProgressSpinnerComponent, { className: "ProgressSpinnerComponent", filePath: "src/app/components/progress-spinner/progress-spinner.component.ts", lineNumber: 8 });
})();

// src/app/routes/formulare/grundbuchausdruck-beantragen/grundbuchausdruck-beantragen.component.ts
var _c05 = (a0) => ({ "darkmode": a0 });
function GrundbuchausdruckBeantragenComponent_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-antragsteller");
  }
}
function GrundbuchausdruckBeantragenComponent_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-grundstueck");
  }
}
function GrundbuchausdruckBeantragenComponent_Conditional_5_Conditional_34_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 16);
    \u0275\u0275listener("click", function GrundbuchausdruckBeantragenComponent_Conditional_5_Conditional_34_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.fs.back());
    });
    \u0275\u0275text(1, "zur\xFCck");
    \u0275\u0275elementEnd();
  }
}
function GrundbuchausdruckBeantragenComponent_Conditional_5_Conditional_35_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 17);
    \u0275\u0275listener("click", function GrundbuchausdruckBeantragenComponent_Conditional_5_Conditional_35_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.next());
    });
    \u0275\u0275text(1, "Weiter");
    \u0275\u0275elementEnd();
  }
}
function GrundbuchausdruckBeantragenComponent_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "form", 2)(1, "div", 3)(2, "h2");
    \u0275\u0275text(3, "Form des Ausdrucks");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 4)(5, "div", 5);
    \u0275\u0275element(6, "input", 6);
    \u0275\u0275elementStart(7, "label", 7)(8, "strong");
    \u0275\u0275text(9, "Einfacher Ausdruck");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "span", 8);
    \u0275\u0275text(11, "Gerichtsgeb\xFChr ");
    \u0275\u0275elementStart(12, "b");
    \u0275\u0275text(13, "10 \u20AC");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "span", 9);
    \u0275\u0275text(15, "Ein Ausdruck auf normalem Papier.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "span");
    \u0275\u0275element(17, "i", 10);
    \u0275\u0275text(18, " In den meisten F\xE4llen ist dieser ausreichend.");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(19, "div", 5);
    \u0275\u0275element(20, "input", 11);
    \u0275\u0275elementStart(21, "label", 12)(22, "strong");
    \u0275\u0275text(23, "Beglaubigter/Amtlicher Ausdruck");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "span", 8);
    \u0275\u0275text(25, "Gerichtsgeb\xFChr ");
    \u0275\u0275elementStart(26, "b");
    \u0275\u0275text(27, "20 \u20AC");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(28, "span", 9);
    \u0275\u0275text(29, "Ein Ausdruck auf farbigen dicken Wappenpapier. Dem Ausdruck wird ein Siegel beigedr\xFCckt.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(30, "span");
    \u0275\u0275element(31, "i", 10);
    \u0275\u0275text(32, " Sparen Sie sich das Geld, wenn ein beglaubigter Ausdruck nicht explizit verlangt wird.");
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275elementStart(33, "div", 13);
    \u0275\u0275template(34, GrundbuchausdruckBeantragenComponent_Conditional_5_Conditional_34_Template, 2, 0, "button", 14)(35, GrundbuchausdruckBeantragenComponent_Conditional_5_Conditional_35_Template, 2, 0, "button", 15);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("formGroup", ctx_r1.form);
    \u0275\u0275advance(34);
    \u0275\u0275conditional(ctx_r1.step > 1 ? 34 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.step < 6 ? 35 : -1);
  }
}
function GrundbuchausdruckBeantragenComponent_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-berechtigtes-interesse");
  }
}
function GrundbuchausdruckBeantragenComponent_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-grundbuchamt");
  }
}
function GrundbuchausdruckBeantragenComponent_Conditional_8_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 26);
    \u0275\u0275listener("click", function GrundbuchausdruckBeantragenComponent_Conditional_8_Conditional_11_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.submitForm());
    });
    \u0275\u0275text(1, "erneut versuchen");
    \u0275\u0275elementEnd();
  }
}
function GrundbuchausdruckBeantragenComponent_Conditional_8_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-progress-spinner", 24);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("prozent", ctx_r1.prozentProgressSpinnerWord);
  }
}
function GrundbuchausdruckBeantragenComponent_Conditional_8_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-progress-spinner", 25);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("prozent", ctx_r1.prozentPdfUpload != 100 ? ctx_r1.prozentPdfUpload : ctx_r1.prozentPdfDownload)("endless", ctx_r1.prozentProgressSpinnerWord == 100 && ctx_r1.prozentPdfUpload == 100 && ctx_r1.prozentPdfDownload == 0);
  }
}
function GrundbuchausdruckBeantragenComponent_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div")(1, "div", 18)(2, "h2");
    \u0275\u0275text(3, "Geschafft!");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span");
    \u0275\u0275text(5, "Sie sind fast fertig.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span");
    \u0275\u0275text(7, "Vergessen Sie nicht den Antrag zu unterschreiben");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "div", 19)(9, "div");
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275template(11, GrundbuchausdruckBeantragenComponent_Conditional_8_Conditional_11_Template, 2, 0, "button", 20);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "div", 21)(13, "button", 22);
    \u0275\u0275listener("click", function GrundbuchausdruckBeantragenComponent_Conditional_8_Template_button_click_13_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.downloadDocx());
    });
    \u0275\u0275element(14, "fa-icon", 23);
    \u0275\u0275elementStart(15, "span");
    \u0275\u0275text(16, ".docx (Word)");
    \u0275\u0275elementEnd();
    \u0275\u0275template(17, GrundbuchausdruckBeantragenComponent_Conditional_8_Conditional_17_Template, 1, 1, "app-progress-spinner", 24);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "button", 22);
    \u0275\u0275listener("click", function GrundbuchausdruckBeantragenComponent_Conditional_8_Template_button_click_18_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.openPdf());
    });
    \u0275\u0275element(19, "fa-icon", 23);
    \u0275\u0275elementStart(20, "span");
    \u0275\u0275text(21, ".pdf");
    \u0275\u0275elementEnd();
    \u0275\u0275template(22, GrundbuchausdruckBeantragenComponent_Conditional_8_Conditional_22_Template, 1, 2, "app-progress-spinner", 25);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(8);
    \u0275\u0275classProp("fehlerstatus", ctx_r1.fehler === true);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.statusmeldung);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.fehler ? 11 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r1.docx == null);
    \u0275\u0275advance();
    \u0275\u0275property("icon", ctx_r1.faFileWord);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r1.prozentProgressSpinnerWord != 100 ? 17 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r1.pdf == null);
    \u0275\u0275advance();
    \u0275\u0275property("icon", ctx_r1.faFilePdf);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(!ctx_r1.pdf ? 22 : -1);
  }
}
var _GrundbuchausdruckBeantragenComponent = class _GrundbuchausdruckBeantragenComponent {
  constructor(titleService, formBuilder, fs, dl, http, rd, platformId) {
    this.titleService = titleService;
    this.formBuilder = formBuilder;
    this.fs = fs;
    this.dl = dl;
    this.http = http;
    this.rd = rd;
    this.platformId = platformId;
    this.faFileWord = faFileWord;
    this.faFilePdf = faFilePdf;
    this.prozentProgressSpinnerWord = 0;
    this.prozentPdfUpload = 0;
    this.prozentPdfDownload = 0;
    this.fehler = false;
    this.statusmeldung = "Die Antragsgenerierung wird gestartet.";
    this.step = 1;
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.titleService.setTitle("Musterantrag Grundbuchausdruck");
    this.form = this.formBuilder.group({
      antragsteller: this.formBuilder.group({
        anrede: ["Herr", Validators.required],
        vorname: ["", Validators.required],
        nachname: ["", Validators.required],
        stra\u00DFe: ["", Validators.required],
        plz: ["", Validators.required],
        ort: ["", Validators.required],
        telefonnummer: [""],
        email: [""]
      }),
      grundst\u00FCck: this.formBuilder.group({
        gemarkung: [""],
        blattnummer: [""],
        stra\u00DFe: [""],
        plz: [""],
        ort: [""],
        flur: [""],
        flurst\u00FCck: [""]
      }),
      form: ["einfach"],
      berechtigtesInteresse: this.formBuilder.group({
        berechtigtesInteresse: ["Ich bin Eigent\xFCmer", Validators.required],
        bemerkung: [""]
      }),
      grundbuchamt: this.formBuilder.group({
        name: ["", Validators.required],
        stra\u00DFe: ["", Validators.required],
        plz: ["", Validators.required],
        ort: ["", Validators.required]
      })
    });
    fs.init(this.form);
    this.fs.restart();
    this.currentStepSubscription = this.fs.getCurrentStepBehaviorSubject().subscribe((step) => {
      this.step = step;
      if (step === 5 && this.form.get("grundbuchamt").valid) {
        this.fs.nextStep(6);
      }
      if (step === 6)
        this.submitForm();
    });
  }
  ngOnDestroy() {
    this.currentStepSubscription.unsubscribe();
  }
  next() {
    this.fs.nextStep();
  }
  submitForm() {
    return __async(this, null, function* () {
      if (!this.isBrowser)
        return;
      this.fehler = false;
      this.prozentProgressSpinnerWord = 0;
      this.prozentPdfUpload = 0;
      this.prozentPdfDownload = 0;
      this.docx = null;
      try {
        this.docx = yield this.generate();
      } catch (error) {
        this.statusmeldung = error.message;
        this.fehler = true;
        console.error(error);
        return;
      }
      this.statusmeldung = "Die .docx Datei wird zur Konvertierung an den Server gesendet.";
      const form = new FormData();
      form.append("docx", this.docx);
      const url = "/api/antraggrundbuchausdruck";
      this.http.post(url, form, { responseType: "blob", reportProgress: true, observe: "events" }).subscribe({
        next: (res) => {
          if (res.type === HttpEventType.UploadProgress) {
            const uploadProzent = Math.round(100 * res.loaded / res.total);
            this.prozentPdfUpload = uploadProzent;
            if (uploadProzent === 100) {
              this.statusmeldung = "Die .docx Datei wurde zur Konvertierung an den Server gesendet. Der Server muss die Datei noch in eine pdf Datei konvertieren.";
            }
          }
          if (res.type === HttpEventType.DownloadProgress) {
            const downloadProzent = Math.round(100 * res.loaded / res.total);
            this.prozentPdfDownload = downloadProzent;
            this.statusmeldung = "Die .docx Datei wurde vom Server in eine pdf Datei konvertiert und muss nun heruntergeladen werden.";
          }
          if (res.type === HttpEventType.Response) {
            this.pdf = res.body;
            this.statusmeldung = "Es wurden alle Dateien erfolgreich erstellt.";
          }
        },
        error: (err) => {
          this.fehler = true;
          if (err.status >= 500 && err.status < 600) {
            this.statusmeldung = "Es gab einen Serverfehler. Die .pdf Datei konnte nicht generiert werden. Sie k\xF6nnen die docx Datei herunterladen.";
          } else {
            this.statusmeldung = "Es gab einen Netzwerkfehler. Die .pdf Datei konnte nicht generiert werden. Sie k\xF6nnen die docx Datei herunterladen.";
          }
          throw err;
        }
      });
    });
  }
  downloadDocx() {
    return __async(this, null, function* () {
      if (this.isBrowser && this.docx) {
        const { default: saveAs } = yield import("./FileSaver.min-UAQBLZYV.mjs");
        saveAs(this.docx, "AntragGrundbuchausdruck.docx");
      }
    });
  }
  openPdf() {
    return __async(this, null, function* () {
      if (this.isBrowser && this.pdf) {
        const { default: saveAs } = yield import("./FileSaver.min-UAQBLZYV.mjs");
        saveAs(this.pdf, "AntragGrundbuchausdruck.pdf");
        window.open(URL.createObjectURL(this.pdf));
      }
    });
  }
  generate() {
    return __async(this, null, function* () {
      if (!this.isBrowser)
        return;
      const { default: Docxtemplater } = yield import("./docxtemplater-C73P6WNM.mjs");
      const { default: PizZip } = yield import("./js-GKQYTPII.mjs");
      const { default: PizZipUtils } = yield import("./utils-XCYGL6F4.mjs");
      return new Promise((resolve, reject) => {
        this.statusmeldung = "Die Formulare werden geladen.";
        const ast = this.fs.form.get("antragsteller");
        const gst = this.fs.form.get("grundst\xFCck");
        const ber = this.fs.form.get("berechtigtesInteresse");
        const gba = this.fs.form.get("grundbuchamt");
        const formDesAusdrucks = this.fs.form.get("form")?.value;
        const kosten = formDesAusdrucks === "beglaubigt" ? "20,00 \u20AC" : "10,00 \u20AC";
        const formType = formDesAusdrucks === "beglaubigt" ? " beglaubigten" : "";
        const anrede = ast.get("anrede")?.value === "Herr" ? "Herrn" : "Frau";
        const anredeformel = ast.get("anrede")?.value === "Herr" ? "geehrter Herr" : "geehrte Frau";
        const betreff = `${gst.get("gemarkung")?.value} ${gst.get("blattnummer")?.value}`;
        const stra\u00DFegrundst\u00FCck = gst.get("stra\xDFe")?.value ? gst.get("stra\xDFe")?.value + "," : "";
        const jetzt = /* @__PURE__ */ new Date();
        const tag = String(jetzt.getDate()).padStart(2, "0");
        const monat = String(jetzt.getMonth() + 1).padStart(2, "0");
        const jahr = jetzt.getFullYear();
        const formatiertesDatum = `${tag}.${monat}.${jahr}`;
        this.prozentProgressSpinnerWord = 10;
        this.statusmeldung = "Die Templatedatei wird heruntergeladen.";
        PizZipUtils.getBinaryContent("assets/antragtemplate.docx", (error, content) => {
          if (error) {
            reject(new Error("Fehler beim Laden der Templatedatei."));
            throw error;
          }
          this.prozentProgressSpinnerWord = 30;
          this.statusmeldung = "Die Templatedatei wird verarbeitet.";
          let doc;
          try {
            const zip = new PizZip(content);
            doc = new Docxtemplater(zip, {
              paragraphLoop: true,
              linebreaks: true
            });
            doc.setData({
              datum: formatiertesDatum,
              vorname: ast.get("vorname")?.value,
              nachname: ast.get("nachname")?.value,
              stra\u00DFe: ast.get("stra\xDFe")?.value,
              plz: ast.get("plz")?.value,
              ort: ast.get("ort")?.value,
              telefonnummer: ast.get("telefonnummer")?.value,
              email: ast.get("email")?.value,
              gemarkung: gst.get("gemarkung")?.value,
              blattnummer: gst.get("blattnummer")?.value,
              stra\u00DFegrundst\u00FCck,
              plzgrundst\u00FCck: gst.get("plz")?.value,
              ortgrundst\u00FCck: gst.get("ort")?.value,
              flur: gst.get("flur")?.value,
              flurst\u00FCck: gst.get("flurst\xFCck")?.value,
              berechtigtesinteresse: ber.get("berechtigtesInteresse")?.value,
              bemerkung: ber.get("bemerkung")?.value,
              form: formType,
              kosten,
              anredeformel,
              anrede,
              betreff,
              nameag: gba.get("name")?.value,
              stra\u00DFeag: gba.get("stra\xDFe")?.value,
              plzag: gba.get("plz")?.value,
              ortag: gba.get("ort")?.value
            });
          } catch (error2) {
            reject(new Error("Fehler beim Setzen der Variablen in die Templatedatei."));
            throw error2;
          }
          this.prozentProgressSpinnerWord = 40;
          this.statusmeldung = "Das Template wird mit den eingesetzten Variablen gerendert.";
          try {
            doc.render();
          } catch (error2) {
            reject(new Error("Fehler beim Rendern der Templatedatei."));
            throw error2;
          }
          this.prozentProgressSpinnerWord = 60;
          this.statusmeldung = "Die Datei wird zu einer .docx gezippt.";
          try {
            const blobDocx = doc.getZip().generate({
              type: "blob",
              mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            });
            this.prozentProgressSpinnerWord = 100;
            resolve(blobDocx);
          } catch (error2) {
            reject(new Error("Fehler beim Zippen der docx Datei."));
            throw error2;
          }
        });
      });
    });
  }
};
_GrundbuchausdruckBeantragenComponent.\u0275fac = function GrundbuchausdruckBeantragenComponent_Factory(t) {
  return new (t || _GrundbuchausdruckBeantragenComponent)(\u0275\u0275directiveInject(Title), \u0275\u0275directiveInject(FormBuilder), \u0275\u0275directiveInject(FormService), \u0275\u0275directiveInject(DesignloaderService), \u0275\u0275directiveInject(HttpClient), \u0275\u0275directiveInject(Renderer2), \u0275\u0275directiveInject(PLATFORM_ID));
};
_GrundbuchausdruckBeantragenComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _GrundbuchausdruckBeantragenComponent, selectors: [["app-grundbuchausdruck-beantragen"]], decls: 10, vars: 9, consts: [[3, "ngClass"], [1, "formulardiv", "sectiondiv", "borderdiv"], [3, "formGroup"], ["id", "formdesausdrucks"], [1, "formularcontent"], [1, "auswahlcard"], ["formControlName", "form", "id", "einfach", "type", "radio", "name", "form", "value", "einfach"], ["for", "einfach"], [1, "geb\xFChr"], [1, "beschreibung"], [1, "fa-solid", "fa-circle-info"], ["formControlName", "form", "id", "beglaubigt", "type", "radio", "name", "form", "value", "beglaubigt"], ["for", "beglaubigt"], [1, "formNavBtn"], ["type", "button", 1, "btntext"], ["id", "weiterbtn", "type", "submit", 1, "btnoutlined"], ["type", "button", 1, "btntext", 3, "click"], ["id", "weiterbtn", "type", "submit", 1, "btnoutlined", 3, "click"], ["id", "ende"], [1, "status"], [1, "btntext"], [1, "kachelcontainer"], [1, "btnoutlined", "kachel", 3, "click", "disabled"], [3, "icon"], [3, "prozent"], [3, "prozent", "endless"], [1, "btntext", 3, "click"]], template: function GrundbuchausdruckBeantragenComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-header");
    \u0275\u0275elementStart(1, "section", 0)(2, "div", 1);
    \u0275\u0275template(3, GrundbuchausdruckBeantragenComponent_Conditional_3_Template, 1, 0, "app-antragsteller")(4, GrundbuchausdruckBeantragenComponent_Conditional_4_Template, 1, 0, "app-grundstueck")(5, GrundbuchausdruckBeantragenComponent_Conditional_5_Template, 36, 3, "form", 2)(6, GrundbuchausdruckBeantragenComponent_Conditional_6_Template, 1, 0, "app-berechtigtes-interesse")(7, GrundbuchausdruckBeantragenComponent_Conditional_7_Template, 1, 0, "app-grundbuchamt")(8, GrundbuchausdruckBeantragenComponent_Conditional_8_Template, 23, 10, "div");
    \u0275\u0275elementEnd()();
    \u0275\u0275element(9, "app-footer");
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(7, _c05, ctx.dl.darkmode.value));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx.step === 1 ? 3 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx.step === 2 ? 4 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx.step === 3 ? 5 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx.step === 4 ? 6 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx.step === 5 ? 7 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx.step === 6 ? 8 : -1);
  }
}, dependencies: [NgClass, FaIconComponent, \u0275NgNoValidate, DefaultValueAccessor, RadioControlValueAccessor, NgControlStatus, NgControlStatusGroup, FormGroupDirective, FormControlName, HeaderComponent, FooterComponent, AntragstellerComponent, GrundstueckComponent, BerechtigtesInteresseComponent, GrundbuchamtComponent, ProgressSpinnerComponent], styles: ["\n\n[_nghost-%COMP%] {\n  min-height: 100vh;\n  display: flex;\n  flex-direction: column;\n}\nsection[_ngcontent-%COMP%] {\n  margin-top: 4vh;\n  top: -40em;\n  position: relative;\n  animation: _ngcontent-%COMP%_slideInFromTop 700ms forwards;\n}\n@keyframes _ngcontent-%COMP%_slideInFromTop {\n  100% {\n    top: 0em;\n  }\n}\n.sectiondiv[_ngcontent-%COMP%] {\n  align-items: unset;\n  max-width: 50em;\n  margin-top: 10vh;\n  margin-bottom: 5vh;\n}\nh2[_ngcontent-%COMP%] {\n  margin: 0.3em 0;\n}\n.formNavBtn[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: flex-end;\n}\n#formdesausdrucks[_ngcontent-%COMP%]   .formularcontent[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-evenly;\n  margin: 1em 0;\n  flex-wrap: wrap;\n}\n.auswahlcard[_ngcontent-%COMP%] {\n  margin: 0.2em 0;\n  width: 20em;\n  -webkit-user-select: none;\n  user-select: none;\n}\n.auswahlcard[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  border: 5px solid #dadce0;\n  border-radius: 8px;\n  min-height: 17em;\n  padding: 1em;\n  display: flex;\n  flex-direction: column;\n}\n.auswahlcard[_ngcontent-%COMP%]   input[type=radio][_ngcontent-%COMP%]:checked    + label[_ngcontent-%COMP%] {\n  border: 5px solid var(--primary-variant-much-brighter);\n  background-color: var(--hintergrund-inputfeld);\n}\n.auswahlcard[_ngcontent-%COMP%]   input[type=radio][_ngcontent-%COMP%]:checked    + label[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: var(--primary-color);\n}\n.auswahlcard[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  display: none;\n}\n.auswahlcard[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:not(:disabled)    ~ label[_ngcontent-%COMP%] {\n  cursor: pointer;\n}\n.auswahlcard[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  text-align: center;\n  margin: 1em 0;\n}\n.auswahlcard[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  margin: 1em 0 0 0;\n}\n#ende[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n}\n#ende[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  margin-top: 0.5em;\n}\n#ende[_ngcontent-%COMP%]   .kachelcontainer[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  margin-top: 1em;\n  gap: 1em;\n}\n#ende[_ngcontent-%COMP%]   .kachel[_ngcontent-%COMP%] {\n  width: 15em;\n  display: flex;\n  align-items: center;\n  height: unset;\n}\n#ende[_ngcontent-%COMP%]   .kachel[_ngcontent-%COMP%]   fa-icon[_ngcontent-%COMP%] {\n  font-size: 64px;\n  margin: 1rem;\n}\n#ende[_ngcontent-%COMP%]   .status[_ngcontent-%COMP%] {\n  margin-top: 1rem;\n  border-left: 2px solid var(--primary-color);\n  border-radius: 4px;\n  padding: 0.5rem;\n  background-color: var(--hintergrund-inputfeld);\n}\n#ende[_ngcontent-%COMP%]   .fehlerstatus[_ngcontent-%COMP%]   div[_ngcontent-%COMP%] {\n  color: red;\n}\n/*# sourceMappingURL=grundbuchausdruck-beantragen.component.css.map */"] });
var GrundbuchausdruckBeantragenComponent = _GrundbuchausdruckBeantragenComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(GrundbuchausdruckBeantragenComponent, { className: "GrundbuchausdruckBeantragenComponent", filePath: "src/app/routes/formulare/grundbuchausdruck-beantragen/grundbuchausdruck-beantragen.component.ts", lineNumber: 16 });
})();

// src/app/components/artikelsidebar/artikelsidebar.component.ts
var _c06 = ["sidebar"];
var _c14 = ["sidebarbutton"];
var _c23 = ["closingdiv"];
var _c32 = (a0) => ({ "themaangeklickt": a0 });
function ArtikelsidebarComponent_For_9_For_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li", 11)(1, "a", 12);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const unterthema_r4 = ctx.$implicit;
    const thema_r5 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("routerLink", thema_r5.routerLink)("fragment", unterthema_r4.fragment);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(unterthema_r4.name);
  }
}
function ArtikelsidebarComponent_For_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "li", 8)(1, "div")(2, "fa-icon", 9);
    \u0275\u0275listener("click", function ArtikelsidebarComponent_For_9_Template_fa_icon_click_2_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.dropdown($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "a", 10);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "ul");
    \u0275\u0275repeaterCreate(6, ArtikelsidebarComponent_For_9_For_7_Template, 3, 3, "li", 11, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const thema_r5 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(4, _c32, ctx_r2.router.url.includes(thema_r5.routerLink)));
    \u0275\u0275advance(2);
    \u0275\u0275property("icon", ctx_r2.faSortDown);
    \u0275\u0275advance();
    \u0275\u0275property("routerLink", thema_r5.routerLink);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(thema_r5.name);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(thema_r5.unterthemen);
  }
}
var _ArtikelsidebarComponent = class _ArtikelsidebarComponent {
  constructor(router) {
    this.router = router;
    this.faSortDown = faSortDown;
    this.faBars = faBars;
    this.themen = [
      {
        name: "Einleitung Grundbuchrecht",
        routerLink: "/grundbuchrecht/einleitung",
        unterthemen: [{ name: "Definition Grundbuch", fragment: "definitiongrundbuch" }, { name: "Aufbau des Grundbuchs", fragment: "aufbau" }, { name: "Zust\xE4ndigkeiten", fragment: "zust\xE4ndigkeiten" }, { name: "\xD6ffentlicher Glaube", fragment: "\xF6ffentlicherglaube" }]
      },
      {
        name: "Das Bestandsverzeichnis",
        routerLink: "/grundbuchrecht/bestandsverzeichnis",
        unterthemen: [
          { name: "Defintion Grundst\xFCck", fragment: "definitiongrundst\xFCck" },
          { name: "Definition Flurst\xFCck", fragment: "definitionflurst\xFCck" },
          { name: "Definition Flur", fragment: "definitionflur" },
          { name: "Definition Gemarkung", fragment: "definitiongemarkung" },
          { name: "Liegenschaftskarte", fragment: "liegenschaftskarte" },
          { name: "Zerlegung", fragment: "zerlegung" },
          { name: "Verschmelzung", fragment: "verschmelzung" },
          { name: "Teilung", fragment: "teilung" },
          { name: "Vereinigung", fragment: "vereinigung" }
        ]
      },
      {
        name: "Abteilung I",
        routerLink: "/grundbuchrecht/abteilung1",
        unterthemen: [
          { name: "Eigentumsarten", fragment: "eigentumsarten" },
          { name: "Grundst\xFCckserwerb", fragment: "grundst\xFCckserwerb" }
        ]
      },
      {
        name: "Abteilung II",
        routerLink: "/grundbuchrecht/abteilung2",
        unterthemen: [
          { name: "Dauerwohnrecht", fragment: "dauerwohnrecht" },
          { name: "Dauernutzungsrecht", fragment: "dauernutzungsrecht" },
          { name: "Grunddienstbarkeiten", fragment: "grunddienstbarkeit" },
          { name: "beschr\xE4nkte pers\xF6nliche Dienstbarkeit", fragment: "beschr\xE4nktepers\xF6nlichedienstbarkeit" },
          { name: "Nie\xDFbrauchrecht", fragment: "nie\xDFbrauchrecht" },
          { name: "Vorkaufsrecht", fragment: "vorkaufsrecht" },
          { name: "Reallasten", fragment: "reallast" },
          { name: "Altenteil", fragment: "altenteil" },
          { name: "Vormerkungen", fragment: "vormerkung" },
          { name: "Erbbaurecht", fragment: "erbbaurecht" },
          { name: "Nacherbenvermerk", fragment: "nacherbenvermerk" },
          { name: "Testamentsvollstreckervermerk", fragment: "testamentsvollstreckervermerk" },
          { name: "Zwangsversteigerungsvermerk", fragment: "zwangsversteigerungsvermerk" },
          { name: "Zwangsverwaltungsvermerk", fragment: "zwangsverwaltungsvermerk" },
          { name: "Insolvenzvermerk", fragment: "insolvenzvermerk" },
          { name: "Verf\xFCgungsbeschr\xE4nkung nach der InSO", fragment: "verf\xFCgungsbeschr\xE4nkung" }
        ]
      },
      {
        name: "Abteilung III",
        routerLink: "/grundbuchrecht/abteilung3",
        unterthemen: [
          { name: "Grundschuld", fragment: "grundschuld" },
          { name: "Eigent\xFCmergrundschuld", fragment: "eigent\xFCmergrundschuld" },
          { name: "Rentenschuld", fragment: "rentenschuld" },
          { name: "Hypothek", fragment: "hypothek" }
        ]
      }
    ];
  }
  dropdown(event) {
    var element = event.target;
    element.closest(".thema").classList.toggle("themaangeklickt");
  }
  open() {
    this.sidebar.nativeElement.classList.add("sidebaroffen");
    this.sidebarbutton.nativeElement.style.display = "none";
    this.closingdiv.nativeElement.style.display = "block";
  }
  close() {
    this.sidebar.nativeElement.classList.remove("sidebaroffen");
    this.sidebarbutton.nativeElement.style.display = "flex";
    this.closingdiv.nativeElement.style.display = "none";
  }
};
_ArtikelsidebarComponent.\u0275fac = function ArtikelsidebarComponent_Factory(t) {
  return new (t || _ArtikelsidebarComponent)(\u0275\u0275directiveInject(Router));
};
_ArtikelsidebarComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ArtikelsidebarComponent, selectors: [["app-artikelsidebar"]], viewQuery: function ArtikelsidebarComponent_Query(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275viewQuery(_c06, 5);
    \u0275\u0275viewQuery(_c14, 5);
    \u0275\u0275viewQuery(_c23, 5);
  }
  if (rf & 2) {
    let _t;
    \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.sidebar = _t.first);
    \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.sidebarbutton = _t.first);
    \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.closingdiv = _t.first);
  }
}, decls: 10, vars: 1, consts: [["sidebar", ""], ["closingdiv", ""], ["sidebarbutton", ""], [1, "navigationlinks"], [1, "closingDiv", 3, "click"], [1, "sidebarbutton", 3, "click"], [1, "icon", 3, "icon"], [1, "themenliste"], [1, "thema", 3, "ngClass"], [1, "icon", 3, "click", "icon"], [3, "routerLink"], [1, "unterthema"], [3, "routerLink", "fragment"]], template: function ArtikelsidebarComponent_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "aside", 3, 0)(2, "div", 4, 1);
    \u0275\u0275listener("click", function ArtikelsidebarComponent_Template_div_click_2_listener() {
      \u0275\u0275restoreView(_r1);
      return \u0275\u0275resetView(ctx.close());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 5, 2);
    \u0275\u0275listener("click", function ArtikelsidebarComponent_Template_div_click_4_listener() {
      \u0275\u0275restoreView(_r1);
      return \u0275\u0275resetView(ctx.open());
    });
    \u0275\u0275element(6, "fa-icon", 6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "ul", 7);
    \u0275\u0275repeaterCreate(8, ArtikelsidebarComponent_For_9_Template, 8, 6, "li", 8, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance(6);
    \u0275\u0275property("icon", ctx.faBars);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx.themen);
  }
}, dependencies: [NgClass, RouterLink, FaIconComponent], styles: ["\n\n.navigationlinks[_ngcontent-%COMP%] {\n  width: 19em;\n  overflow: hidden;\n  position: fixed;\n  padding: 0;\n  transition: left 0.3s;\n  z-index: 1;\n}\n.themenliste[_ngcontent-%COMP%]::-webkit-scrollbar {\n  width: 5px;\n}\n.themenliste[_ngcontent-%COMP%]::-webkit-scrollbar-thumb {\n  background: #888;\n}\n.themenliste[_ngcontent-%COMP%]::-webkit-scrollbar-thumb:hover {\n  background: #555;\n}\n.themenliste[_ngcontent-%COMP%]::-webkit-scrollbar-corner {\n  background-color: transparent;\n}\n.darkmode[_ngcontent-%COMP%]   .themenliste[_ngcontent-%COMP%], \n.themenliste[_ngcontent-%COMP%] {\n  height: 100vh;\n  padding: 4em 1em 0 1em;\n  box-sizing: border-box;\n  overflow: scroll;\n}\n.darkmode[_ngcontent-%COMP%]   .themenliste[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%], \n.themenliste[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%] {\n  padding: 0;\n  margin: 0 0 0 1em;\n}\n.darkmode[_ngcontent-%COMP%]   .themenliste[_ngcontent-%COMP%]   li[_ngcontent-%COMP%], \n.themenliste[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  margin-bottom: 1em;\n  list-style: none;\n}\n.darkmode[_ngcontent-%COMP%]   .themenliste[_ngcontent-%COMP%]   a[_ngcontent-%COMP%], \n.themenliste[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  display: block;\n  flex-grow: 1;\n  padding: 1em 1em 1em 0.5em;\n  text-decoration: none;\n  font-weight: bold;\n  color: var(--schrift);\n  border-radius: 0 15px 15px 0;\n  background-color: var(--hintergrund);\n}\n.darkmode[_ngcontent-%COMP%]   .themenliste[_ngcontent-%COMP%]   .icon[_ngcontent-%COMP%], \n.themenliste[_ngcontent-%COMP%]   .icon[_ngcontent-%COMP%] {\n  padding: 1em;\n  border: 1px solid;\n  cursor: pointer;\n  border-radius: 8px 0 0 8px;\n}\n.darkmode[_ngcontent-%COMP%]   .themenliste[_ngcontent-%COMP%]   .thema[_ngcontent-%COMP%], \n.themenliste[_ngcontent-%COMP%]   .thema[_ngcontent-%COMP%] {\n  -webkit-user-select: none;\n  user-select: none;\n}\n.darkmode[_ngcontent-%COMP%]   .themenliste[_ngcontent-%COMP%]   .thema[_ngcontent-%COMP%]   div[_ngcontent-%COMP%], \n.themenliste[_ngcontent-%COMP%]   .thema[_ngcontent-%COMP%]   div[_ngcontent-%COMP%] {\n  list-style: none;\n  display: flex;\n}\n.darkmode[_ngcontent-%COMP%]   .themenliste[_ngcontent-%COMP%]   .thema[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%], \n.themenliste[_ngcontent-%COMP%]   .thema[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%] {\n  max-height: 0;\n  overflow: hidden;\n  margin: 0;\n  transition: 0.2s;\n}\n.darkmode[_ngcontent-%COMP%]   .themenliste[_ngcontent-%COMP%]   .themaangeklickt[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%], \n.themenliste[_ngcontent-%COMP%]   .themaangeklickt[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%] {\n  max-height: 1000px;\n  transition: 0.5s;\n}\n.darkmode[_ngcontent-%COMP%]   .themenliste[_ngcontent-%COMP%]   .themaangeklickt[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]   a[_ngcontent-%COMP%], \n.themenliste[_ngcontent-%COMP%]   .themaangeklickt[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  background-color: var(--primary-variant-much-brighter);\n}\n.darkmode[_ngcontent-%COMP%]   .themenliste[_ngcontent-%COMP%]   .unterthema[_ngcontent-%COMP%], \n.themenliste[_ngcontent-%COMP%]   .unterthema[_ngcontent-%COMP%] {\n  margin: 0.5rem;\n}\n.darkmode[_ngcontent-%COMP%]   .themenliste[_ngcontent-%COMP%]   .unterthema[_ngcontent-%COMP%]   a[_ngcontent-%COMP%], \n.themenliste[_ngcontent-%COMP%]   .unterthema[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  margin: 0;\n  padding: 0.5em 0 0.5em 1em;\n  font-size: 14px;\n  box-sizing: border-box;\n  font-weight: normal;\n  border: 1px solid transparent;\n  border-radius: 10px;\n}\n.darkmode[_ngcontent-%COMP%]   .themenliste[_ngcontent-%COMP%]   .icon[_ngcontent-%COMP%]:hover, \n.darkmode[_ngcontent-%COMP%]   .themenliste[_ngcontent-%COMP%]   .unterthema[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover, \n.themenliste[_ngcontent-%COMP%]   .icon[_ngcontent-%COMP%]:hover, \n.themenliste[_ngcontent-%COMP%]   .unterthema[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover {\n  border: 1px solid var(--primary-variant-darker);\n}\n.sidebarbutton[_ngcontent-%COMP%] {\n  display: none;\n  position: absolute;\n}\n@media only screen and (max-width: 700px) {\n  .navigationlinks[_ngcontent-%COMP%] {\n    left: -19em;\n    overflow-x: hidden;\n    background-color: var(--hintergrund);\n  }\n  .sidebarbutton[_ngcontent-%COMP%] {\n    display: block;\n    top: 2.5em;\n    left: 1em;\n    border: 1px solid var(--primary-variant-darker);\n    background-color: var(--hintergrund);\n    padding: 0.5em;\n    width: 30px;\n    height: 30px;\n    font-size: 24px;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    position: fixed;\n    cursor: pointer;\n    z-index: 1;\n  }\n  .sidebarbutton[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n    height: 24px;\n    width: 24px;\n    vertical-align: middle;\n  }\n  .themenliste[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n    background-color: var(--body);\n  }\n}\n.sidebarbutton[_ngcontent-%COMP%]:hover {\n  background-color: var(--primary-variant-much-brighter);\n}\n.sidebaroffen[_ngcontent-%COMP%] {\n  left: 0em;\n}\n.closingDiv[_ngcontent-%COMP%] {\n  position: fixed;\n  display: none;\n  width: 100vw;\n  height: 100vh;\n  z-index: -1;\n}\n/*# sourceMappingURL=artikelsidebar.component.css.map */"] });
var ArtikelsidebarComponent = _ArtikelsidebarComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ArtikelsidebarComponent, { className: "ArtikelsidebarComponent", filePath: "src/app/components/artikelsidebar/artikelsidebar.component.ts", lineNumber: 13 });
})();

// src/app/components/artikel/artikel.component.ts
var _c07 = ["*"];
var _ArtikelComponent = class _ArtikelComponent {
  constructor() {
    this.nextSite = "";
    this.faPrint = faPrint;
  }
  print() {
    window.print();
  }
};
_ArtikelComponent.\u0275fac = function ArtikelComponent_Factory(t) {
  return new (t || _ArtikelComponent)();
};
_ArtikelComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ArtikelComponent, selectors: [["app-artikel"]], inputs: { nextSite: "nextSite" }, ngContentSelectors: _c07, decls: 11, vars: 2, consts: [[1, "artikelcontent"], [1, "sectiondiv", "artikelButtonDiv"], ["onclick", "print()"], [3, "icon"], [3, "routerLink"]], template: function ArtikelComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275projectionDef();
    \u0275\u0275element(0, "app-header")(1, "app-artikelsidebar");
    \u0275\u0275elementStart(2, "div", 0);
    \u0275\u0275projection(3);
    \u0275\u0275elementStart(4, "section")(5, "div", 1)(6, "button", 2);
    \u0275\u0275element(7, "fa-icon", 3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "button", 4);
    \u0275\u0275text(9, "N\xE4chste Seite");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275element(10, "app-footer");
  }
  if (rf & 2) {
    \u0275\u0275advance(7);
    \u0275\u0275property("icon", ctx.faPrint);
    \u0275\u0275advance();
    \u0275\u0275propertyInterpolate("routerLink", ctx.nextSite);
  }
}, dependencies: [RouterLink, FaIconComponent, HeaderComponent, FooterComponent, ArtikelsidebarComponent], styles: ["/* src/app/components/artikel/artikel.component.scss */\n@media only screen and (min-width: 700px) {\n  .artikelcontent {\n    flex-grow: 1;\n    margin-left: 19em;\n  }\n}\n.artikelcontent hr {\n  width: clamp(1em, 65%, 60em);\n  margin: 1em 0;\n}\n.artikelcontent ul {\n  margin-top: 0;\n  margin-bottom: 0;\n}\n.artikelcontent ul li {\n  list-style: circle;\n}\n.artikelcontent .infokasten {\n  padding: 1em;\n  background-color: var(--primary-variant-much-brighter);\n  border-left: 6px solid var(--primary-variant-darker);\n  border-radius: 3px;\n  max-width: 80%;\n  margin: 1em 0 0 1em;\n}\n.artikelcontent .sectiondiv {\n  align-items: flex-start;\n}\n.artikelcontent h2,\n.artikelcontent .darkmode h2 {\n  margin-top: 0;\n  font-size: 1.9rem;\n  margin-bottom: 0.5em;\n}\n.artikelcontent h3,\n.artikelcontent .darkmode h3 {\n  margin: 1em 0 0 0;\n  font-size: 1.5rem;\n}\n.artikelcontent h4,\n.artikelcontent .darkmode h4 {\n  margin: 1em 0 0 1em;\n  text-decoration: underline;\n}\n.artikelcontent p {\n  margin: 0.5em 0;\n}\n.artikelcontent .artikelButtonDiv {\n  display: flex;\n  justify-content: space-between;\n  flex-direction: row;\n}\n.artikelcontent .imageZoomBox {\n  border-radius: 8px;\n}\n/*# sourceMappingURL=artikel.component.css.map */\n"], encapsulation: 2 });
var ArtikelComponent = _ArtikelComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ArtikelComponent, { className: "ArtikelComponent", filePath: "src/app/components/artikel/artikel.component.ts", lineNumber: 10 });
})();

// src/app/routes/grundbuchrecht/abteilung1/abteilung1.component.ts
var _Abteilung1Component = class _Abteilung1Component {
  constructor(meta, titleService) {
    this.meta = meta;
    this.titleService = titleService;
    this.meta.addTag({
      name: "description",
      content: "Eine kompakte Einleitung ins Grundbuchrecht. Kurze Erkl\xE4rung der Eintragungen der Abteilung I des Grundbuchs."
    });
    this.titleService.setTitle("Einleitung Grundbuchrecht: Abteilung I");
  }
};
_Abteilung1Component.\u0275fac = function Abteilung1Component_Factory(t) {
  return new (t || _Abteilung1Component)(\u0275\u0275directiveInject(Meta), \u0275\u0275directiveInject(Title));
};
_Abteilung1Component.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _Abteilung1Component, selectors: [["app-abteilung1"]], decls: 254, vars: 0, consts: [["nextSite", "/grundbuchrecht/abteilung2"], [1, "sectiondiv"], ["id", "eigentumsarten"], [1, "infokasten"], ["id", "grundst\xFCckserwerb"]], template: function Abteilung1Component_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "app-artikel", 0)(1, "section")(2, "div", 1)(3, "h1");
    \u0275\u0275text(4, "Abteilung I (Eigent\xFCmer)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p");
    \u0275\u0275text(6, "Die Abteilung I enth\xE4lt alle Angaben zum Eigentum an einem Grundst\xFCck. ");
    \u0275\u0275element(7, "br");
    \u0275\u0275text(8, " Folgende Daten des Eigent\xFCmers werden eingetragen:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "p");
    \u0275\u0275text(10, "Bei nat\xFCrlichen Personen:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "ul")(12, "li");
    \u0275\u0275text(13, "Vorname");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "li");
    \u0275\u0275text(15, "Familenname");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "li");
    \u0275\u0275text(17, "Geburtsdatum");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "li");
    \u0275\u0275text(19, "Geburtsname");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(20, "p");
    \u0275\u0275text(21, " Bei juristischen Personen:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "ul")(23, "li");
    \u0275\u0275text(24, "Name/Firma");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "li");
    \u0275\u0275text(26, "Sitz");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "li");
    \u0275\u0275text(28, "Registergericht");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "li");
    \u0275\u0275text(30, "Registerblatt");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(31, "section", 2);
    \u0275\u0275element(32, "hr");
    \u0275\u0275elementStart(33, "div", 1)(34, "h2");
    \u0275\u0275text(35, "Eigentumsarten");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(36, "h3");
    \u0275\u0275text(37, "Alleineigentum");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(38, "p");
    \u0275\u0275text(39, "Das Eigentum steht ");
    \u0275\u0275elementStart(40, "b");
    \u0275\u0275text(41, "einer");
    \u0275\u0275elementEnd();
    \u0275\u0275text(42, " Person zu (nat\xFCrlich oder juristisch). Diese ist der ");
    \u0275\u0275elementStart(43, "b");
    \u0275\u0275text(44, "Alleineigent\xFCmer.");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(45, "blockquote", 3)(46, "b");
    \u0275\u0275text(47, "Merke:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(48, " Der Alleineigent\xFCmer kann \xFCber die Grundst\xFCcke frei verf\xFCgen. ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(49, "h3");
    \u0275\u0275text(50, "Miteigentum");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(51, "p");
    \u0275\u0275text(52, "Das Eigentum steht ");
    \u0275\u0275elementStart(53, "b");
    \u0275\u0275text(54, "mehreren");
    \u0275\u0275elementEnd();
    \u0275\u0275text(55, " Personen gleichzeitig zu. Diese sind ");
    \u0275\u0275elementStart(56, "b");
    \u0275\u0275text(57, "Miteigent\xFCmer");
    \u0275\u0275elementEnd();
    \u0275\u0275element(58, "br")(59, "br");
    \u0275\u0275text(60, " Es gibt zwei Formen des Miteigentums: ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(61, "ul")(62, "li");
    \u0275\u0275text(63, "Bruchteilseigentum");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(64, "li");
    \u0275\u0275text(65, "Gesamthandseigentum");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(66, "h4");
    \u0275\u0275text(67, "Bruchteilseigentum");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(68, "p");
    \u0275\u0275text(69, "Jedem Miteigent\xFCmer geh\xF6rt ein ideeller Bruchteil.");
    \u0275\u0275element(70, "br")(71, "br");
    \u0275\u0275text(72, "Die h\xE4ufigste Form des Bruchteilseigentums sind Eheleute, die je zu einem halben Bruchteil im Grundbuch eingetragen sind.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(73, "blockquote", 3)(74, "b");
    \u0275\u0275text(75, "Merke:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(76, " Bei Bruchteilseigentum kann jeder Miteigent\xFCmer \xFCber seinen Bruchteil frei verf\xFCgen. \xA7 747 S. 1 BGB");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(77, "p");
    \u0275\u0275text(78, "Jeder Bruchteil kann frei ver\xE4u\xDFert oder belastet werden.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(79, "p");
    \u0275\u0275text(80, " Ein Ehepartner kann seinen ideellen Bruchteil theoretisch verkaufen. In der Praxis m\xF6chte jedoch selten jemand einen ideellen Bruchteil kaufen, da der andere Bruchteil den anderen Ehepartner weiterhin geh\xF6rt. ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(81, "p");
    \u0275\u0275text(82, " Die Eigent\xFCmer k\xF6nnen ihren Grundbesitz auch zusammen ver\xE4u\xDFern.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(83, "p");
    \u0275\u0275text(84, " \xDCber den gemeinschaftlichen Gegenstand im Ganzen k\xF6nnen die Teilhaber nur gemeinschaftlich verf\xFCgen. \xA7 747 S. 2 BGB");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(85, "p");
    \u0275\u0275text(86, " Gibt es im Streitfall keine Einigung, kann ein Miteigent\xFCmer eine Zwangsversteigerung zur Aufhebung der Gemeinschaft beantragen.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(87, "h4");
    \u0275\u0275text(88, "Gesamthandseigentum");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(89, "p");
    \u0275\u0275text(90, "Das Eigentum ist an die Gemeinschaft gebunden.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(91, "p");
    \u0275\u0275text(92, "Die h\xE4ufigste Form des Gesamthandseigentum ist die Erbengemeinschaft.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(93, "blockquote", 3)(94, "b");
    \u0275\u0275text(95, "Merke:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(96, " Bei Gesamthandseigentum k\xF6nnen die Eigent\xFCmer nur zusammen \xFCber das Eigentum verf\xFCgen.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(97, "p");
    \u0275\u0275text(98, "Beispiele f\xFCr Gesamthandseigentum:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(99, "ul")(100, "li");
    \u0275\u0275text(101, "Erbengemeinschaft");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(102, "li");
    \u0275\u0275text(103, "Personengeselleschaften (GbR, oHG, KG)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(104, "li");
    \u0275\u0275text(105, "nicht rechtsf\xE4higer Verein");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(106, "li");
    \u0275\u0275text(107, "eheliche G\xFCtergemeinschaft");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(108, "p");
    \u0275\u0275text(109, "Die Eigent\xFCmer k\xF6nnen den Grundbesitz nur zusammen belasten oder ver\xE4u\xDFern.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(110, "p");
    \u0275\u0275text(111, "Gibt es im Streitfall keine Einigung kann ein Eigent\xFCmer eine Teilungsversteigerung beantragen. (Zwangsversteigerung zur Aufhebung der Gemeinschaft)");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(112, "section", 4);
    \u0275\u0275element(113, "hr");
    \u0275\u0275elementStart(114, "div", 1)(115, "h2");
    \u0275\u0275text(116, "Grundst\xFCckserwerb");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(117, "p");
    \u0275\u0275text(118, "Es gibt drei Arten Grundbesitz zu erwerben:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(119, "ul")(120, "li");
    \u0275\u0275text(121, "Erwerb aufgrund ");
    \u0275\u0275elementStart(122, "b");
    \u0275\u0275text(123, "Rechtsgesch\xE4ft");
    \u0275\u0275elementEnd();
    \u0275\u0275text(124, " (konstitutiv) \u2794 z.B. Kauf, Tausch oder Schenkung");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(125, "li");
    \u0275\u0275text(126, "Erwerb aufgrund ");
    \u0275\u0275elementStart(127, "b");
    \u0275\u0275text(128, "Gesamtnachfolge");
    \u0275\u0275elementEnd();
    \u0275\u0275text(129, " (deklaratorisch) \u2794 z.B. Erbfolge, G\xFCtergemeinschaft");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(130, "li");
    \u0275\u0275text(131, "Erwerb aufgrund ");
    \u0275\u0275elementStart(132, "b");
    \u0275\u0275text(133, "Staatsaktes");
    \u0275\u0275elementEnd();
    \u0275\u0275text(134, " (deklaratorisch)\u2794 z.B. Zwangsversteigerung, Enteignung ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(135, "h3");
    \u0275\u0275text(136, "Rechtsgesch\xE4ft");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(137, "p");
    \u0275\u0275text(138, "Die Eigentums\xFCbertragung erfolgt durch ");
    \u0275\u0275elementStart(139, "b");
    \u0275\u0275text(140, "Einigung (Auflassung) und Eintragung");
    \u0275\u0275elementEnd();
    \u0275\u0275text(141, " ins Grundbuch.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(142, "p");
    \u0275\u0275text(143, "Vertr\xE4ge m\xFCssen notariel beurkundet werden. \xA7 311 b BGB");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(144, "p");
    \u0275\u0275text(145, "Beispiele:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(146, "ul")(147, "li");
    \u0275\u0275text(148, "Kauf");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(149, "li");
    \u0275\u0275text(150, "Tausch");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(151, "li");
    \u0275\u0275text(152, "Schenkung");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(153, "p");
    \u0275\u0275text(154, "Eintragungsgrundlage ist die Auflassungsurkunde.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(155, "p");
    \u0275\u0275text(156, "Die Auflassung kann auch in einem gerichtlichem Vergleich oder einem Insolvenzplan erkl\xE4rt werden.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(157, "p");
    \u0275\u0275text(158, "Die Eintragung ins Grundbuch erlogt, wenn");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(159, "ul")(160, "li");
    \u0275\u0275text(161, "die Auflassung nachgewiesen ist \xA7 20 GBO");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(162, "li");
    \u0275\u0275text(163, "eine steuerliche Unbedenklichkeitsbescheinigung vorliegt");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(164, "li");
    \u0275\u0275text(165, "eventuelle beh\xF6rdliche Genehmigungen vorliegen");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(166, "blockquote", 3);
    \u0275\u0275text(167, "Erst die Eintragung im Grundbuch bewirkt den Eigentums\xFCbergang. Die Eintragung ist rechtsbegr\xFCndend (konstitutiv).");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(168, "h3");
    \u0275\u0275text(169, "Gesamtnachfolge");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(170, "p");
    \u0275\u0275text(171, "Der Eigentums\xFCbergang vollzieht sich au\xDFerhalb des Grundbuchs. Das Grundbuch wird unrichtig. Die Eintragung ist deklaratorisch (rechtsbekundend). Zu Gesamtnachfolge z\xE4hlen die folgenden F\xE4lle: ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(172, "h4");
    \u0275\u0275text(173, "Erbfolge");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(174, "p");
    \u0275\u0275text(175, "Mit dem Tod eines Eigent\xFCmers wird das Grundbuch unrichtig. \xA7 1922 BGB");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(176, "p");
    \u0275\u0275text(177, "Die Grundbuchberichtigung kann aufgrund folgender Unterlagen erfolgen:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(178, "ul")(179, "li");
    \u0275\u0275text(180, "Erbschein in Ausfertigung");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(181, "li");
    \u0275\u0275text(182, "Notatrieles Testament/Erbvertrag nebst Er\xF6ffnungsprotokoll in beglaubigter Kopie");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(183, "p");
    \u0275\u0275text(184, "Der Grundbuchberichtigungsantrag muss von einem Erben gestellt werden. Ein Testamentvollstrecker ist ebenfalls antragsberechtigt.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(185, "p");
    \u0275\u0275text(186, "Die Grundbuchberichtigung ist innerhalb von 2 Jahren nach dem Sterbefall geb\xFChrenfrei. Diese Frist ist nicht verl\xE4ngerbar.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(187, "p");
    \u0275\u0275text(188, "Geb\xFChrenfrei ist die Eintragung der Erben oder die Erbauseinandersetzung.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(189, "p");
    \u0275\u0275text(190, "Eine Erbauseinandersetzung k\xF6nnen die Erben bei einem Notar durch einen Erbauseinandersetzungsvertrag erzielen.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(191, "h4");
    \u0275\u0275text(192, "G\xFCtergemeinschaft");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(193, "p");
    \u0275\u0275text(194, "Vereinbaren Ehegatten durch Vertrag G\xFCtergemeinschaft, so wird das Verm\xF6gen gemeinschaftliches Verm\xF6gen beider Ehegatten (Gesamtgut). \xA7 1416 BGB");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(195, "p");
    \u0275\u0275text(196, "Die Grundbuchberichtigung erfolgt aufgrund");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(197, "ul")(198, "li");
    \u0275\u0275text(199, "Ehevertrag oder");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(200, "li");
    \u0275\u0275text(201, "Auszug aus dem G\xFCterrechtsregister");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(202, "h3");
    \u0275\u0275text(203, "Staatsakt");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(204, "p");
    \u0275\u0275text(205, "Eine Eigentumsumschreibung kann auch aufgrund Staatsakt durch Enteignung oder Zwangsversteigerung erfolgen.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(206, "h4");
    \u0275\u0275text(207, "Enteignung");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(208, "p");
    \u0275\u0275text(209, "Dem Eigent\xFCmer wird sein Grundbesitz durch den Staat entwendet.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(210, "p")(211, "b");
    \u0275\u0275text(212, "Beispiel:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(213, " Bau einer Autobahn");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(214, "p");
    \u0275\u0275text(215, "Die Enteignung ist nur zul\xE4ssig, wenn");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(216, "ul")(217, "li");
    \u0275\u0275text(218, "der Wohl der Allgemeinheit es fordert");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(219, "li");
    \u0275\u0275text(220, "der Enteignungszweck auf andere zumutbare Weise nicht erreicht werden kann");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(221, "p");
    \u0275\u0275text(222, "\xA7 87 Abs. 1 BauGB");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(223, "p");
    \u0275\u0275text(224, "In der Praxis selten.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(225, "h4");
    \u0275\u0275text(226, "Zwangsversteigerung");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(227, "p");
    \u0275\u0275text(228, "Mit dem Zuschlag bei einer Zwangsversteigerung wird der Ersteher Eigent\xFCmer und das Grundbuch wird unrichtig. \xA7 90 ZVG");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(229, "p");
    \u0275\u0275text(230, "Die Grundbuchberichtigung folgt nach Beendigung des Verfahrens aufgrund eines Ersuchens des Vollstreckungsgerichts. \xA7 130 ZVG");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(231, "p");
    \u0275\u0275text(232, "Die Eintragung ist deklaratorisch (rechtsbekundend).");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(233, "p");
    \u0275\u0275text(234, "Eintragungsgrundlage im Grundbuch ist der Zuschlagsbeschluss:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(235, "p");
    \u0275\u0275text(236, "Zu unterscheiden sind die:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(237, "ul")(238, "li");
    \u0275\u0275text(239, "Zwangsversteigerung ");
    \u0275\u0275elementStart(240, "ul")(241, "li");
    \u0275\u0275text(242, "wird von einem Gl\xE4ubiger betrieben");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(243, "li");
    \u0275\u0275text(244, "der Gl\xE4ubiger soll befriedigt werden");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(245, "li");
    \u0275\u0275text(246, "Zwangsversteigerung zur Aufhebung der Gemeinschaft ");
    \u0275\u0275elementStart(247, "ul")(248, "li");
    \u0275\u0275text(249, "wird von einem Eigent\xFCmer betrieben");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(250, "li");
    \u0275\u0275text(251, "dient zur Aufhebung von Gesamthandseigentum bei Uneinigkeit");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(252, "li");
    \u0275\u0275text(253, "wird auch Teilungsversteigerung genannt.");
    \u0275\u0275elementEnd()()()()()()();
  }
}, dependencies: [ArtikelComponent] });
var Abteilung1Component = _Abteilung1Component;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(Abteilung1Component, { className: "Abteilung1Component", filePath: "src/app/routes/grundbuchrecht/abteilung1/abteilung1.component.ts", lineNumber: 10 });
})();

// src/app/routes/grundbuchrecht/abteilung2/abteilung2.component.ts
var _Abteilung2Component = class _Abteilung2Component {
  constructor(meta, titleService) {
    this.meta = meta;
    this.titleService = titleService;
    this.meta.addTag({
      name: "description",
      content: "Eine kompakte Einleitung ins Grundbuchrecht. Kurze Erkl\xE4rung der Eintragungen der Abteilung II des Grundbuchs."
    });
    this.titleService.setTitle("Einleitung Grundbuchrecht: Abteilung II");
  }
};
_Abteilung2Component.\u0275fac = function Abteilung2Component_Factory(t) {
  return new (t || _Abteilung2Component)(\u0275\u0275directiveInject(Meta), \u0275\u0275directiveInject(Title));
};
_Abteilung2Component.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _Abteilung2Component, selectors: [["app-abteilung2"]], decls: 505, vars: 0, consts: [["nextSite", "/grundbuchrecht/abteilung3"], [1, "sectiondiv"], ["id", "dauerwohnrecht"], [1, "infokasten"], ["id", "dauernutzungsrecht"], ["id", "grunddienstbarkeit"], ["id", "beschr\xE4nktepers\xF6nlichedienstbarkeit"], ["id", "nie\xDFbrauchrecht"], ["id", "vorkaufsrecht"], ["id", "reallast"], ["id", "altenteil"], ["id", "vormerkung"], ["id", "erbbaurecht"], ["id", "nacherbenvermerk"], ["id", "testamentsvollstreckervermerk"], ["id", "zwangsversteigerungsvermerk"], ["id", "zwangsverwaltungsvermerk"], ["id", "insolvenzvermerk"], ["id", "verf\xFCgungsbeschr\xE4nkung"]], template: function Abteilung2Component_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "app-artikel", 0)(1, "section")(2, "div", 1)(3, "h1");
    \u0275\u0275text(4, "Abteilung II ");
    \u0275\u0275element(5, "br");
    \u0275\u0275text(6, "(Lasten und Beschr\xE4nkungen)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p");
    \u0275\u0275text(8, " In Abteilung II werden die Lasten und Beschr\xE4nkungen an den Grundst\xFCcken eingetragen. ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "p");
    \u0275\u0275text(10, "\xDCbersicht der m\xF6glicher Eintragungen:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "ul")(12, "li");
    \u0275\u0275text(13, " Dienstbarkeiten ");
    \u0275\u0275elementStart(14, "ul")(15, "li");
    \u0275\u0275text(16, "Dauerwohnrecht");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "li");
    \u0275\u0275text(18, "Grunddienstbarkeiten");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "li");
    \u0275\u0275text(20, "beschr\xE4nkte pers\xF6nliche Dienstbarkeiten");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "li");
    \u0275\u0275text(22, "Nie\xDFbrauchrecht");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(23, "li");
    \u0275\u0275text(24, "Vorkaufsrecht");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "li");
    \u0275\u0275text(26, "Reallasten");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "li");
    \u0275\u0275text(28, "Altenteil");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "li");
    \u0275\u0275text(30, "Vormerkungen");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "li");
    \u0275\u0275text(32, "Erbbaurecht");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "li");
    \u0275\u0275text(34, " Verf\xFCgungsbeschr\xE4nkungen ");
    \u0275\u0275elementStart(35, "ul")(36, "li");
    \u0275\u0275text(37, "Nacherbenvermerk");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(38, "li");
    \u0275\u0275text(39, "Testamentsvollstreckervermerk");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(40, "li");
    \u0275\u0275text(41, "Zwangsversteigerungsvermerk");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(42, "li");
    \u0275\u0275text(43, "Zwangsverwaltungsvermerk");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(44, "li");
    \u0275\u0275text(45, "Insolvenzvermerke");
    \u0275\u0275elementEnd()()()()()();
    \u0275\u0275elementStart(46, "section", 2);
    \u0275\u0275element(47, "hr");
    \u0275\u0275elementStart(48, "div", 1)(49, "h2");
    \u0275\u0275text(50, "Dauerwohnrecht");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(51, "blockquote", 3);
    \u0275\u0275text(52, "\u201EDas Recht, eine bestimmte, in sich abgeschlossene Wohnung unter Ausschluss des Eigent\xFCmers zu nutzen\u201C \xA7 31 I WEG");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(53, "p");
    \u0275\u0275text(54, "Das Recht entsteht durch");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(55, "ul")(56, "li");
    \u0275\u0275text(57, "Einigung zwischen dem Eigent\xFCmer und dem Berechtigen und");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(58, "li");
    \u0275\u0275text(59, "Eintragung ins Grundbuch");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(60, "p");
    \u0275\u0275text(61, "Zur L\xF6schung ist die L\xF6schungsbewilligung des Berechtigen n\xF6tig. \xA7 875 BGB");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(62, "p");
    \u0275\u0275text(63, "Die L\xF6schung erfolgt nur auf Antrag.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(64, "p");
    \u0275\u0275text(65, "Das Dauerwohnrecht kann vererbt und ver\xE4u\xDFert werden.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(66, "p");
    \u0275\u0275text(67, "Es kann f\xFCr beschr\xE4nkte oder unbeschr\xE4nkte Zeit vereinbart werden.");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(68, "section", 4);
    \u0275\u0275element(69, "hr");
    \u0275\u0275elementStart(70, "div", 1)(71, "h2");
    \u0275\u0275text(72, "Dauernutzungsrecht");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(73, "blockquote", 3);
    \u0275\u0275text(74, "\u201EDas Recht, nicht zu Wohnzwecken dienende R\xE4ume unter Ausschluss des Eigent\xFCmers zu nutzen\u201C \xA7 31 Abs. 2 WEG");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(75, "p");
    \u0275\u0275text(76, "Das Recht entsteht durch");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(77, "ul")(78, "li");
    \u0275\u0275text(79, "Einigung zwischen dem Eigent\xFCmer und dem Berechtigen und");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(80, "li");
    \u0275\u0275text(81, "Eintragung ins Grundbuch");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(82, "p");
    \u0275\u0275text(83, "Zur L\xF6schung ist die L\xF6schungsbewilligung des Berechtigen n\xF6tig. \xA7 875 BGB");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(84, "p");
    \u0275\u0275text(85, "Die L\xF6schung erfolgt nur auf Antrag.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(86, "p");
    \u0275\u0275text(87, "Das Dauernutzungsrecht kann vererbt und ver\xE4u\xDFert werden.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(88, "p");
    \u0275\u0275text(89, "Es kann f\xFCr beschr\xE4nkte oder unbeschr\xE4nkte Zeit vereinbart werden.");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(90, "section", 5);
    \u0275\u0275element(91, "hr");
    \u0275\u0275elementStart(92, "div", 1)(93, "h2");
    \u0275\u0275text(94, "Grunddienstbarkeit");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(95, "blockquote", 3);
    \u0275\u0275text(96, "\u201ERecht zugunsten des jeweiligen Eigent\xFCmers eines anderen Grundst\xFCcks.\u201C");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(97, "p");
    \u0275\u0275text(98, "Das Recht wird nicht auf den Namen einer Person eingetragen, sondern zugunsten eines Grundst\xFCcks. Daher hei\xDFt es ");
    \u0275\u0275elementStart(99, "u");
    \u0275\u0275text(100, "Grund");
    \u0275\u0275elementEnd();
    \u0275\u0275text(101, "dienstbarkeit. (Subjektiv-dingliche Rechte)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(102, "p");
    \u0275\u0275text(103, "Es sind immer zwei Grundst\xFCcke betroffen:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(104, "ul")(105, "li");
    \u0275\u0275text(106, "das herrschende Grundst\xFCcke (beg\xFCnstigt)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(107, "li");
    \u0275\u0275text(108, "das dienende Grundst\xFCck (belastet)");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(109, "p");
    \u0275\u0275text(110, "Der Berechtigte kann sich mit \xDCbertragung des herrschenden Grundst\xFCcks \xE4ndern.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(111, "p");
    \u0275\u0275text(112, "Die Grunddienstbarkeit ist auf Dauer ausgelegt.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(113, "p");
    \u0275\u0275text(114, "Sie muss f\xFCr das herrschende Grundst\xFCck vorteilhaft sein. \xA7 1019 BGB");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(115, "p");
    \u0275\u0275text(116, "Eine Grunddienstbarkeit kann den Eigent\xFCmer nicht zum positiven Handeln verpflichten.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(117, "p");
    \u0275\u0275text(118, "Grunddienstbarkeiten entstehen durch Einigung + Eintragung.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(119, "p");
    \u0275\u0275text(120, "Zur L\xF6schung ist die L\xF6schungsbewilligung des Berechtigen n\xF6tig.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(121, "p");
    \u0275\u0275text(122, "Es gibt drei Grundtypen von Grundienstbarkeiten:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(123, "ul")(124, "li");
    \u0275\u0275text(125, "Benutzung (z.B. Geh- und Wegerecht)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(126, "li");
    \u0275\u0275text(127, "Unterlassung (z.B. Unterlassung einer Bebauung)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(128, "li");
    \u0275\u0275text(129, "Duldung (z.B. Abgase einer Fabrik)");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(130, "h3");
    \u0275\u0275text(131, "Benutzung");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(132, "p");
    \u0275\u0275text(133, "Das dienende Grundst\xFCck darf in einzelnen Beziehungen benutzt werden.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(134, "p");
    \u0275\u0275text(135, "Beispiele:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(136, "ul")(137, "li");
    \u0275\u0275text(138, "Wegerecht");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(139, "li");
    \u0275\u0275text(140, "Wasserleitungsrecht");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(141, "li");
    \u0275\u0275text(142, "Stromleitung");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(143, "li");
    \u0275\u0275text(144, "Abwasserleitung");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(145, "p");
    \u0275\u0275text(146, "Ein Wegerecht ist f\xFCr Grundst\xFCcke sinnvoll, welche keine direkte Anbindung zur Stra\xDFe haben und nur \xFCber ein fremdes Grundst\xFCck erreicht werden k\xF6nnen.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(147, "h3");
    \u0275\u0275text(148, "Unterlassung");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(149, "p");
    \u0275\u0275text(150, "Auf dem dienenden Grundst\xFCck d\xFCrfen gewisse Handlungen nicht vorgenommen werden.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(151, "p");
    \u0275\u0275text(152, "Beispiele:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(153, "ul")(154, "li");
    \u0275\u0275text(155, "Bebauungsverbot");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(156, "li");
    \u0275\u0275text(157, "Aussichtsrecht");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(158, "li");
    \u0275\u0275text(159, "Wettbewerbsverbot");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(160, "p");
    \u0275\u0275text(161, "Zum Beispiel kann ein Hotel eine Grunddienstbarkeit bestellen, die den Eigent\xFCmers des Nachbargrundst\xFCcks eine Bebauung untersagt, um den G\xE4sten die sch\xF6ne Aussicht zu erhalten.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(162, "h3");
    \u0275\u0275text(163, "Duldung");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(164, "p");
    \u0275\u0275text(165, "Dem Eigent\xFCmer des dienenden Grundst\xFCcks wird von der Aus\xFCbung eines bestimmten Rechts ausgeschlossen.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(166, "p");
    \u0275\u0275text(167, "Beispiele:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(168, "ul")(169, "li");
    \u0275\u0275text(170, "Duldung von Abgase einer Fabrik");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(171, "li");
    \u0275\u0275text(172, "Duldung von L\xE4rm");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(173, "p");
    \u0275\u0275text(174, "(Ausgeschlossen wird das Recht zu klagen)");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(175, "section", 6);
    \u0275\u0275element(176, "hr");
    \u0275\u0275elementStart(177, "div", 1)(178, "h2");
    \u0275\u0275text(179, "Beschr\xE4nke pers\xF6nliche Dienstbarkeit");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(180, "blockquote", 3);
    \u0275\u0275text(181, "\u201ERecht zugunsten einer individuell bestimmten nat\xFCrlichen oder juristischen Person\u201C \xA7 1090 BGB");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(182, "p");
    \u0275\u0275text(183, "Die berechtigte Person wird mit Namen eingetragen.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(184, "p");
    \u0275\u0275text(185, "Inhaltlich oft wie bei der Grunddienstbarkeit.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(186, "p");
    \u0275\u0275text(187, "Eine beschr\xE4nkte pers\xF6nliche Dienstbarkeit ist nicht \xFCbertragbar und nicht vererbbar. \xA7 1092 I S.1 BGB ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(188, "p");
    \u0275\u0275text(189, "Beispiele:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(190, "ul")(191, "li");
    \u0275\u0275text(192, "Wegerecht");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(193, "li");
    \u0275\u0275text(194, "Leitungsrecht");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(195, "li");
    \u0275\u0275text(196, "Wohnungsrecht");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(197, "p");
    \u0275\u0275text(198, "Beispiel: Ein Stromanbieter m\xF6chte Strommasten auf einem Grundst\xFCck errichten. Eine Grunddienstbarkeit ist nicht sinnvoll, da das Recht nicht einem Grundst\xFCckseigent\xFCmer zustehen soll, sondern dem Stromanbieter. Es kann eine beschr\xE4nkte pers\xF6nliche Dienstbarkeit f\xFCr den Stromanbieter eingetragen werden.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(199, "p");
    \u0275\u0275text(200, "Das Recht erlischt wenn:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(201, "ul")(202, "li");
    \u0275\u0275text(203, "der Berechtigte verzichtet");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(204, "li");
    \u0275\u0275text(205, "der Berechtigte verstirbt");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(206, "p");
    \u0275\u0275text(207, "Zur L\xF6schung ist die L\xF6schungsbewilligung oder die Sterbeurkunde erforderlich.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(208, "p");
    \u0275\u0275text(209, "Die L\xF6schung erfolgt auf Antrag.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(210, "h3");
    \u0275\u0275text(211, "Wohnungsrecht:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(212, "p");
    \u0275\u0275text(213, "Als beschr\xE4nkte pers\xF6nliche Dienstbarkeit kann ein Wohnungsrecht eingetragen werden. Das Wohnungsrecht ist von dem Dauerwohnrecht zu unterscheiden.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(214, "table")(215, "tbody")(216, "tr")(217, "th");
    \u0275\u0275text(218, "Wohnungsrecht \xA7 1093 BGB");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(219, "th");
    \u0275\u0275text(220, "Dauerwohnrecht \xA7 31 WEG");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(221, "tr")(222, "td");
    \u0275\u0275text(223, "Nutzung nur durch eingetragene Person");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(224, "td");
    \u0275\u0275text(225, "Vermietung m\xF6glich");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(226, "tr")(227, "td");
    \u0275\u0275text(228, "Nicht ver\xE4u\xDFerbar");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(229, "td");
    \u0275\u0275text(230, "ver\xE4u\xDFerbar");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(231, "tr")(232, "td");
    \u0275\u0275text(233, "Nicht vererbbar");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(234, "td");
    \u0275\u0275text(235, "vererbbar");
    \u0275\u0275elementEnd()()()()()();
    \u0275\u0275elementStart(236, "section", 7);
    \u0275\u0275element(237, "hr");
    \u0275\u0275elementStart(238, "div", 1)(239, "h3");
    \u0275\u0275text(240, "Nie\xDFbrauchrecht");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(241, "blockquote", 3);
    \u0275\u0275text(242, "\u201EDas pers\xF6nliche Recht zur vollen Nutzung einer Sache\u201C \xA7\xA7 1030 ff. BGB");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(243, "p");
    \u0275\u0275text(244, "Das Recht entsteht durch Einigung und Eintragung.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(245, "p");
    \u0275\u0275text(246, "Rechte des Nie\xDFbrauchers:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(247, "ul")(248, "li");
    \u0275\u0275text(249, "Anspruch auf nat\xFCrliche Fr\xFCchte des Grundst\xFCcks (z.B. Erzeugnisse der Landwirtschaft)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(250, "li");
    \u0275\u0275text(251, "Anspruch auf Rechtsfr\xFCchte des Grundst\xFCcks (z.B. Mieteinnahmen)");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(252, "p");
    \u0275\u0275text(253, "Pflichten des Nie\xDFbrauchers:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(254, "ul")(255, "li");
    \u0275\u0275text(256, "Instandhaltung der Sache und Beibehaltung der wirtschaftlichen Bestimmung \xA7\xA7 1041, 1036 Abs. 2 BGB");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(257, "li");
    \u0275\u0275text(258, "Tragen der Lasten der Sache (z.B. Versicherungskosten, Steuern) \xA7\xA7 1045, 1047 BGB");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(259, "p");
    \u0275\u0275text(260, "Das Nie\xDFbrauchrecht ist nicht \xFCbertragbar und nicht vererbbar. \xA7 1059 S.1 BGB");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(261, "p");
    \u0275\u0275text(262, "Die Aus\xFCbung kann einem andern \xFCberlassen werden.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(263, "p");
    \u0275\u0275text(264, "Das Recht erlischt wenn:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(265, "ul")(266, "li");
    \u0275\u0275text(267, "der Berechtigte verzichtet");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(268, "li");
    \u0275\u0275text(269, "der Berechtigte verstirbt");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(270, "p");
    \u0275\u0275text(271, "Zur L\xF6schung ist die L\xF6schungsbewilligung oder die Sterbeurkunde erforderlich.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(272, "p");
    \u0275\u0275text(273, "Die L\xF6schung erfolgt auf Antrag.");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(274, "section", 8);
    \u0275\u0275element(275, "hr");
    \u0275\u0275elementStart(276, "div", 1)(277, "h2");
    \u0275\u0275text(278, "Vorkaufsrecht");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(279, "blockquote", 3);
    \u0275\u0275text(280, "\u201EDer Berechtigte ist dem Eigent\xFCmer gegen\xFCber zum Vorkauf berechtigt\u201C \xA7 1094 BGB ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(281, "p");
    \u0275\u0275text(282, "F\xFCr eine bestimmte Person oder einem jeweiligen Eigent\xFCmer m\xF6glich.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(283, "p");
    \u0275\u0275text(284, "Entsteht durch Einigung und Eintragung.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(285, "p");
    \u0275\u0275text(286, "Beschr\xE4nkt auf dem ersten Verkaufsfall, mehrere Verkaufsf\xE4lle oder alle Verkaufsf\xE4lle. \xA7 1097 BGB");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(287, "p");
    \u0275\u0275text(288, "Das Vorkaufsrecht gilt nicht f\xFCr Schenkung, Erbschaft oder Zwangsversteigerung.");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(289, "section", 9);
    \u0275\u0275element(290, "hr");
    \u0275\u0275elementStart(291, "div", 1)(292, "h2");
    \u0275\u0275text(293, "Realast");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(294, "blockquote", 3);
    \u0275\u0275text(295, " \u201EWiederkehrende Leistungen aus dem Grundst\xFCck\u201C \xA7 1105 Abs. 1 BGB ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(296, "p");
    \u0275\u0275text(297, "F\xFCr eine bestimmte Person oder einem jeweiligen Eigent\xFCmer m\xF6glich.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(298, "p");
    \u0275\u0275text(299, "Die zu erbringenden Leistungen k\xF6nnen sein:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(300, "ul")(301, "li");
    \u0275\u0275text(302, "Naturalien");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(303, "li");
    \u0275\u0275text(304, "Geldzahlungen");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(305, "li");
    \u0275\u0275text(306, "Handlungen (Instandhaltung von Geb\xE4uden, Pflegeleistungen)");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(307, "p");
    \u0275\u0275text(308, "Es m\xFCssen stets wiederkehrende Leistungen geschuldet sein.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(309, "p");
    \u0275\u0275text(310, "Der Eigent\xFCmer haftet mit dem Grundst\xFCck und pers\xF6nlich.");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(311, "section", 10);
    \u0275\u0275element(312, "hr");
    \u0275\u0275elementStart(313, "div", 1)(314, "h2");
    \u0275\u0275text(315, "Altenteil");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(316, "p");
    \u0275\u0275text(317, "Ist gesetzlich nicht definiert.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(318, "p");
    \u0275\u0275text(319, "Besteht in der Regel aus mehreren Rechten:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(320, "ul")(321, "li");
    \u0275\u0275text(322, "Wohnungsrecht");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(323, "li");
    \u0275\u0275text(324, "Nie\xDFbrauch");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(325, "li");
    \u0275\u0275text(326, "Reallasten");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(327, "p");
    \u0275\u0275text(328, "Das Altenteil hat Bedeutung insbesondere im Bereich der Hof\xFCbergabe: Der Bauer, der den Hof an seinen Nachfolger \xFCbergibt, l\xE4sst sich ein Altenteilsrecht einr\xE4umen.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(329, "p");
    \u0275\u0275text(330, "Reallast und Wohnungsrecht k\xF6nnen im Grundbuch aber auch als ein Recht eingetragen werden, unter der Bezeichnung \u201EAltenteil\u201C oder \u201ELeibgedinge\u201C.");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(331, "section", 11);
    \u0275\u0275element(332, "hr");
    \u0275\u0275elementStart(333, "div", 1)(334, "h2");
    \u0275\u0275text(335, "Vormerkung");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(336, "blockquote", 3);
    \u0275\u0275text(337, "\u201ESicherung des Anspruchs auf Einr\xE4umung oder Aufhebung eines Rechts.\u201C \xA7 883 BGB ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(338, "p");
    \u0275\u0275text(339, "Auch zur Sicherung eines k\xFCnftigen Anspruchs zul\xE4ssig.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(340, "p");
    \u0275\u0275text(341, "Eine Verf\xFCgung, die nach der Eintragung der Vormerkung \xFCber das Grundst\xFCck getroffen wird, ist insoweit unwirksam, als sie den Anspruch verhindern oder beeintr\xE4chtigen w\xFCrde.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(342, "p");
    \u0275\u0275text(343, "Beispiel:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(344, "ul")(345, "li");
    \u0275\u0275text(346, "Eigentums\xFCbertragungsvormerkung");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(347, "section", 12);
    \u0275\u0275element(348, "hr");
    \u0275\u0275elementStart(349, "div", 1)(350, "h2");
    \u0275\u0275text(351, "Erbbaurecht");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(352, "blockquote", 3);
    \u0275\u0275text(353, "\u201EDas Recht ein Bauwerk auf oder unter einem fremden Grundst\xFCck zu errichten oder zu haben\u201C \xA7 1 ErbbauRG");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(354, "p");
    \u0275\u0275text(355, "Das Erbbaurecht ist ein grundst\xFCckgleiches Recht. Es kann genauso wie ein Grundst\xFCck ver\xE4u\xDFert oder belastet werden. Es ist somit auch vererbbar.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(356, "p");
    \u0275\u0275text(357, "Es wird ein besonderes Grundbuchblatt angelegt. Das Erbaugrundbuch. Im Erbbaugrundbuch wird das Erbbaurecht im Bestandsverzeichnis eingetragen und im Grundst\xFCcksgrundbuch in Abteilung II.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(358, "p");
    \u0275\u0275text(359, "Bei einem Erbbaurecht gibt es zwei Eigent\xFCmer:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(360, "ul")(361, "li");
    \u0275\u0275text(362, "den des Grundst\xFCcks und");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(363, "li");
    \u0275\u0275text(364, "den des Geb\xE4udes");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(365, "p");
    \u0275\u0275text(366, "Entsteht durch Einigung und Eintragung.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(367, "p");
    \u0275\u0275text(368, "Das Erbbaurecht kann auf Dauer oder f\xFCr eine bestimmte Zeit bestellt werden. \xDCblich sind oft 99 Jahre.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(369, "p");
    \u0275\u0275text(370, "Das Eigentum am Bauwerk steht dem Erbbauberechtigten zu.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(371, "p");
    \u0275\u0275text(372, "Es k\xF6nnen Abmachungen getroffen werden hinsichtlich");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(373, "ul")(374, "li");
    \u0275\u0275text(375, "des Bauwerks (z.B. Baustil)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(376, "li");
    \u0275\u0275text(377, "der Lastentragung (Grundsteuer usw.)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(378, "li");
    \u0275\u0275text(379, "eines Anspruchs auf R\xFCck\xFCbertragung des Erbbaurechts gegen Verg\xFCtung (Heimfall)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(380, "li");
    \u0275\u0275text(381, "das Recht auf Erneuerung des Erbbaurechts nach dessen Ablauf");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(382, "li");
    \u0275\u0275text(383, "einer Verkaufsverpflichtung des Grundst\xFCckseigent\xFCmers an den jeweiligen Erbbauberechtigten");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(384, "p");
    \u0275\u0275text(385, "\xA7 2 ErbbauRG");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(386, "p");
    \u0275\u0275text(387, "Es besteht die M\xF6glichkeit, dass sich der Eigent\xFCmer die Zustimmung zum Verkauf oder zur Belastung des Erbbaurechts vorbeh\xE4lt. \xA7 5 ff. ErbbauRG");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(388, "p");
    \u0275\u0275text(389, "Das Erbbaurecht erlischt");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(390, "ul")(391, "li");
    \u0275\u0275text(392, "Aufhebung und Eintragung oder");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(393, "li");
    \u0275\u0275text(394, "Ablauf der vereinbarten Dauer");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(395, "p");
    \u0275\u0275text(396, "Das Bauwerk geht dann in das Eigentum des Grundst\xFCckseigent\xFCmers \xFCber. Dieser hat den Erbbauberechtigten eine angemessene Entsch\xE4digung f\xFCr das Bauwerk zu zahlen.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(397, "p");
    \u0275\u0275text(398, "Statt der Entsch\xE4digung kann aber auch die Verl\xE4ngerung des Erbbaurechts angeboten werden. Lehnt der Erbbauberechtigte die Verl\xE4ngerung ab, verliert er den Entsch\xE4digungsanspruch. \xA7 27 ErbbauRG");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(399, "p");
    \u0275\u0275text(400, "Bei L\xF6schung des Erbbaurechts wird das dazugeh\xF6rige Erbbaugrundbuch geschlossen.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(401, "p");
    \u0275\u0275text(402, "Beispiel: Die Stadt m\xF6chte das die Innenstadt belebt ist. Statt Grundst\xFCcke zu verkaufen, kann die Stadt Erbbaurechte bestellen und bleibt Eigent\xFCmer des Grundst\xFCcks und kann das Erbbaurecht auslaufen lassen. Tiefgaragen sind auch ein passendes Beispiel.");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(403, "section", 13);
    \u0275\u0275element(404, "hr");
    \u0275\u0275elementStart(405, "div", 1)(406, "h2");
    \u0275\u0275text(407, "Nacherbenvermerk");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(408, "blockquote", 3);
    \u0275\u0275text(409, "\u201EEin Vorerbe ist nur Erbe auf Zeit. Nach Beendigung der Vorerbschaft wird der Nacherbe der Erbe des Erblassers\u201C");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(410, "p");
    \u0275\u0275text(411, "Der Erblasser kann mit einer Verf\xFCgung von Todes wegen die Vor- und Nacherbschaft anordnen.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(412, "p");
    \u0275\u0275text(413, "Der Vorerbe kann nur mit Zustimmung des Nacherben \xFCber das Grundst\xFCck verf\xFCgen.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(414, "p");
    \u0275\u0275text(415, "Der Nacherbenvermerk wird gleichzeitig mit der Eintragung des Vorerben als Eigent\xFCmer eingetragen.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(416, "p");
    \u0275\u0275text(417, "Die Eintragung des Vermerks soll den gutgl\xE4ubigen Erwerb des Grundst\xFCcks verhindern.");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(418, "section", 14);
    \u0275\u0275element(419, "hr");
    \u0275\u0275elementStart(420, "div", 1)(421, "h2");
    \u0275\u0275text(422, "Testaments\xADvollstrecker\xADvermerk");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(423, "p");
    \u0275\u0275text(424, "Im Testament kann der Erblasser festlegen, dass ein Testamentsvollstrecker eingesetzt wird.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(425, "p");
    \u0275\u0275text(426, "Der Testamentsvollstrecker fungiert als Treuh\xE4nder gegen\xFCber dem Erben. Seine Aufgabe ist vor allem die ordnungsgem\xE4\xDFe Verwaltung des Nachlasses.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(427, "p");
    \u0275\u0275text(428, "Dem Testamentsvollstrecker steht die Verwaltungs- und Verf\xFCgungsbefugnis \xFCber den Nachlass zu. \xA7 2205 BGB");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(429, "p");
    \u0275\u0275text(430, "Der Erbe kann \xFCber die Nachlassgegenst\xE4nde, die der Verwaltung unterliegen nicht verf\xFCgen \xA7 2211 Abs. 1 BGB");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(431, "p");
    \u0275\u0275text(432, "Der Vermerk dient dazu, das eingeschr\xE4nkte Verf\xFCgungsrecht des Eigent\xFCmers deutlich zu machen und gutgl\xE4ubigen Erwerb Dritter auszuschlie\xDFen.");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(433, "section", 15);
    \u0275\u0275element(434, "hr");
    \u0275\u0275elementStart(435, "div", 1)(436, "h2");
    \u0275\u0275text(437, "Zwangs\xADversteigerungs\xADvermerk");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(438, "p");
    \u0275\u0275text(439, "Mit Wirksamwerden des Anordnungsbeschlusses des Vollstreckungsgerichts entsteht ein relatives Verf\xFCgungsverbot (Ver\xE4u\xDFerungsverbot).");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(440, "p");
    \u0275\u0275text(441, "S\xE4mtliche Verf\xFCgungen des Schuldners \xFCber sein Grundeigentum sind dem betreibenden Gl\xE4ubiger gegen\xFCber unwirksam.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(442, "p");
    \u0275\u0275text(443, "\xA7\xA7 23, 20 I ZVG, 135 , 136 BGB");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(444, "p");
    \u0275\u0275text(445, "Dieses relative Verf\xFCgungsverbot muss unverz\xFCglich ins Grundbuch eingetragen werden, da sonst ein Dritter das betroffene Grundst\xFCck gutgl\xE4ubig erwerben k\xF6nnte.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(446, "p");
    \u0275\u0275text(447, "Das Vollstreckungsgericht ersucht das Grundbuchamt um die Eintragung. \xA7 19 Abs. 1 ZVG");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(448, "p");
    \u0275\u0275text(449, "Das Ersuchen ersetzt den sonst notwendigen Antrag und die Bewilligung.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(450, "p");
    \u0275\u0275text(451, "Es gibt zwei Zeitpunkte an dem das Verf\xFCgungsverbot wirksam werden kann:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(452, "ul")(453, "li");
    \u0275\u0275text(454, "Zeitpunkt der Zustellung des Anordnungs- beschlusses an den Schuldner \xA7 22 Abs. 1 S. 1 ZVG");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(455, "li");
    \u0275\u0275text(456, "Zeitpunkt des Eingang des Ersuchens beim Grundbuchamt \xA7 22 Abs. 1 S. 2 ZVG");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(457, "p");
    \u0275\u0275text(458, "Der fr\xFChere Zeitpunk ist entscheidend.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(459, "p");
    \u0275\u0275text(460, "Das Grundbuchamt ist verpflichtet dem Vollstreckungsgericht mitzuteilen, was \xFCber Wohnort und Wohnung der eingetragenen Beteiligten und deren Vertreter bekannt ist. Die Vorschrift wird durch die \xDCbersendung des Wohnungsblattes erf\xFCllt. \xA7 19 Abs. 2 ZVG");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(461, "p");
    \u0275\u0275text(462, "Das Grundbuchamt ist au\xDFerdem verpflichtet dem Vollstreckungsgericht von allen Eintragungen im Grundbuch beglaubigte Abschriften der Urkunden zu \xFCbersenden. Diese Vorschrift wird in der Praxis dadurch erf\xFCllt, dass die Grundakte bei Bedarf vom Vollstreckungsgericht angefordert wird. \xA7 19 Abs. 2 ZVG");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(463, "p");
    \u0275\u0275text(464, "Das Vollstreckungsgericht ist von allen folgenden Eintragungen zu benachrichtigen. \xA7 19 Abs. 2 ZVG");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(465, "section", 16);
    \u0275\u0275element(466, "hr");
    \u0275\u0275elementStart(467, "div", 1)(468, "h2");
    \u0275\u0275text(469, "Zwangs\xADverwaltungs\xADvermerk");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(470, "p");
    \u0275\u0275text(471, "Statt der Zwangsversteigerung kann auch die Zwangsverwaltung erfolgen.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(472, "p");
    \u0275\u0275text(473, "Bei der Zwangsverwaltung sollen die Forderungen des Gl\xE4ubigers durch die Ertr\xE4ge des Grundst\xFCcks erf\xFCllt werden.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(474, "p");
    \u0275\u0275text(475, "Beispiel: Das Grundst\xFCck ist vermietet und der Gl\xE4ubiger kann die Miteinnahmen abgreifen.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(476, "p");
    \u0275\u0275text(477, "Die Zwangsverwaltung kann den Gl\xE4ubiger auch davor sch\xFCtzen, dass ein unf\xE4higer oder unwilliger Schuldner das Zugriffsobjekt durch unzureichende Bewirtschaftung im Wert mindert oder sonst wie beeintr\xE4chtigt.");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(478, "section", 17);
    \u0275\u0275element(479, "hr");
    \u0275\u0275elementStart(480, "div", 1)(481, "h2");
    \u0275\u0275text(482, "Insolvenzvermerk (Er\xF6ffnungsvermerk)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(483, "blockquote", 3);
    \u0275\u0275text(484, "\u201EAbsolute Grundbuchsperre. Verf\xFCgungen des Schuldners d\xFCrfen nicht mehr eingetragen werden\u201C");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(485, "p");
    \u0275\u0275text(486, "Dieses Verf\xFCgungsbeschr\xE4nkung muss unverz\xFCglich ins Grundbuch eingetragen werden.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(487, "p");
    \u0275\u0275text(488, "Mit der Insolvenzer\xF6ffnung verliert der Schuldner die Verf\xFCgungsgewalt \xFCber sein Verm\xF6gen. \xA7 80 InsO");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(489, "p");
    \u0275\u0275text(490, "Das Verwaltungs- und Verf\xFCgungsrecht geht auf den Insolvenzverwalter \xFCber. \xA7 56 InsO");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(491, "section", 18);
    \u0275\u0275element(492, "hr");
    \u0275\u0275elementStart(493, "div", 1)(494, "h2");
    \u0275\u0275text(495, "Verf\xFCgungs\xADbeschr\xE4nkung nach der InsO");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(496, "p");
    \u0275\u0275text(497, "Schon vor der Er\xF6ffnung des Insolvenzverfahrens hat das Insolvenzgericht alle Ma\xDFnahmen zu treffen, um eine Verm\xF6gensverschlechterung beim Schuldner zu Lasten der Gl\xE4ubiger zu verhindern. \xA7 21 InsO");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(498, "p");
    \u0275\u0275text(499, "Hierf\xFCr kommt in Frage");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(500, "ul")(501, "li");
    \u0275\u0275text(502, "eine Verf\xFCgungsbeschr\xE4nkung oder");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(503, "li");
    \u0275\u0275text(504, "ein Verf\xFCgungsverbot");
    \u0275\u0275elementEnd()()()()();
  }
}, dependencies: [ArtikelComponent] });
var Abteilung2Component = _Abteilung2Component;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(Abteilung2Component, { className: "Abteilung2Component", filePath: "src/app/routes/grundbuchrecht/abteilung2/abteilung2.component.ts", lineNumber: 9 });
})();

// src/app/routes/grundbuchrecht/abteilung3/abteilung3.component.ts
var _Abteilung3Component = class _Abteilung3Component {
  constructor(meta, titleService) {
    this.meta = meta;
    this.titleService = titleService;
    this.meta.addTag({
      name: "description",
      content: "Eine kompakte Einleitung ins Grundbuchrecht. Kurze Erkl\xE4rung der Eintragungen der Abteilung III des Grundbuchs."
    });
    this.titleService.setTitle("Einleitung Grundbuchrecht: Abteilung III");
  }
};
_Abteilung3Component.\u0275fac = function Abteilung3Component_Factory(t) {
  return new (t || _Abteilung3Component)(\u0275\u0275directiveInject(Meta), \u0275\u0275directiveInject(Title));
};
_Abteilung3Component.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _Abteilung3Component, selectors: [["app-abteilung3"]], decls: 254, vars: 0, consts: [["nextSite", "/grundbuchrecht/einleitung"], [1, "sectiondiv"], ["id", "grundschuld"], [1, "infokasten"], ["id", "eigent\xFCmergrundschuld"], ["id", "rentenschuld"], ["id", "hypothek"]], template: function Abteilung3Component_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "app-artikel", 0)(1, "section")(2, "div", 1)(3, "h1");
    \u0275\u0275text(4, "Abteilung III (Grundpfandrechte)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p");
    \u0275\u0275text(6, "In Abteilung III werden die Grundpfandrechte eingetragen.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p");
    \u0275\u0275text(8, "Diese Rechte dienen der Sicherung der Geldhingabe (z.B. eines Darlehns)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "p");
    \u0275\u0275text(10, "Sie k\xF6nnen als Einzelrechte (es ist ein Grundst\xFCck belastet) oder als Gesamtrechte (es sind mehrere Grundst\xFCcke belastet) eingetragen werden.");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(11, "section", 2);
    \u0275\u0275element(12, "hr");
    \u0275\u0275elementStart(13, "div", 1)(14, "h2");
    \u0275\u0275text(15, "Grundschuld");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "blockquote", 3);
    \u0275\u0275text(17, "\u201ERecht aus einem Grundst\xFCck die Zahlung eines bestimmten Geldbetrages zu fordern.\u201C \xA7 1191 Abs. 1 BGB");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "p");
    \u0275\u0275text(19, "Keine rechtliche Bindung zur Forderung. Die Grundschuld ist unabh\xE4ngig von der Forderung und eine abstrakte Grundst\xFCcksbelastung.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "p");
    \u0275\u0275text(21, "Die Verkn\xFCpfung von Forderung und Grundschuld erfolgt nicht kraft Gesetztes, sondern durch eine schuldrechtliche Vereinbarung.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "p");
    \u0275\u0275text(23, "Die Grundschuld bietet den Vorteil der m\xF6glichen Forderungsauswechslung.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "p");
    \u0275\u0275text(25, "Auf die Grundschuld sind die Vorschriften der Hypothek grunds\xE4tzlich entsprechend anwendbar.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "p");
    \u0275\u0275text(27, "Eine Grundschuld kann als Brief- oder als Buchrecht bestellt werden.");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(28, "section", 4);
    \u0275\u0275element(29, "hr");
    \u0275\u0275elementStart(30, "div", 1)(31, "h2");
    \u0275\u0275text(32, "Eigent\xFCmer\xADgrundschuld");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "blockquote", 3);
    \u0275\u0275text(34, "\u201EGrundschuld auf den Namen des Eigent\xFCmers. Eigent\xFCmer und Gl\xE4ubiger sind identisch.\u201C \xA7 1196 Abs. 1 BGB");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(35, "p");
    \u0275\u0275text(36, "Die Bestellung erfolgt durch einseitige Erkl\xE4rung und Eintragung.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(37, "p");
    \u0275\u0275text(38, "Der Eigent\xFCmer sichert sich den Rang der Grundschuld.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(39, "p");
    \u0275\u0275text(40, "Diese Grundschuld kann als Sicherheit angeboten werden, wenn beabsichtigt wird, ein Darlehn aufzunehmen. (Abtretung)");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(41, "section", 5);
    \u0275\u0275element(42, "hr");
    \u0275\u0275elementStart(43, "div", 1)(44, "h2");
    \u0275\u0275text(45, "Rentenschuld");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(46, "blockquote", 3);
    \u0275\u0275text(47, "\u201ERecht aus einem Grundst\xFCck zu regelm\xE4\xDFig wiederkehrenden Terminen die Zahlung eines bestimmten Geldbetrages zu fordern.\u201C \xA7 1199 Abs. 1 BGB");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(48, "p");
    \u0275\u0275text(49, "Die Rentenschuld ist eine Sonderform der Grundschuld.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(50, "p");
    \u0275\u0275text(51, "Es muss ein Betrag bestimmt werden, durch dessen Zahlung die Rentenschuld abgel\xF6st werden kann. Die Abl\xF6sesumme muss im Grundbuch angegeben werden. \xA7 1199Abs. 2 BGB");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(52, "p");
    \u0275\u0275text(53, "Zahlt der Eigent\xFCmer diese Betrag, geht die Rentenschuld auf ihn \xFCber. \xA7 1200 Abs. 1 BGB");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(54, "p");
    \u0275\u0275text(55, "Der Eigent\xFCmer haftet nur mit dem Grundst\xFCck.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(56, "p");
    \u0275\u0275text(57, "Eine Rentenschuld kann als Brief- oder als Buchrecht bestellt werden.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(58, "p");
    \u0275\u0275text(59, "Die Rentenschuld verfolgt \xE4hnliche wirtschaftliche Ziele wie die Reallast:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(60, "table")(61, "tr")(62, "th");
    \u0275\u0275text(63, "Rentenschuld \xA7 1199 BGB");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(64, "th");
    \u0275\u0275text(65, "Reallast \xA7 1105 BGB");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(66, "tr")(67, "td");
    \u0275\u0275text(68, "Nur Geldzahlungen");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(69, "td");
    \u0275\u0275text(70, "Leistungen aller Art");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(71, "tr")(72, "td");
    \u0275\u0275text(73, "Eintragung in Abteilung III");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(74, "td");
    \u0275\u0275text(75, "Eintragung in Abteilung II");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(76, "tr")(77, "td");
    \u0275\u0275text(78, "Haftung nur mit Grundst\xFCck");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(79, "td");
    \u0275\u0275text(80, "Haftung mit Grundst\xFCck und pers\xF6nlich");
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275elementStart(81, "section", 6);
    \u0275\u0275element(82, "hr");
    \u0275\u0275elementStart(83, "div", 1)(84, "h2");
    \u0275\u0275text(85, "Hypothek");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(86, "blockquote", 3);
    \u0275\u0275text(87, "\u201ERecht aus einem Grundst\xFCck die Zahlung eines bestimmten Geldbetrages zur Befriedigung einer zustehenden Forderung zu fordern.\u201C \xA7 1113 Abs. 1 BGB");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(88, "p");
    \u0275\u0275text(89, "Die Hypothek ist Abh\xE4ngig von einer zugrunde liegenden pers\xF6nlichen Forderung. (Akzessoriet\xE4t)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(90, "p");
    \u0275\u0275text(91, "Die Forderung kann nicht ohne die Hypothek, die Hypothek kann nicht ohne die Forderung \xFCbertragen werden. \xA7 1153 Abs. 2 BGB");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(92, "p");
    \u0275\u0275text(93, "Die \xDCbertragung der Forderung bewirkt vielmehr automatisch den \xDCbergang der Hypothek auf den neuen Gl\xE4ubiger. \xA7 1153 Abs. 1 BGB");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(94, "p");
    \u0275\u0275text(95, "Erlischt die Forderung wird aus der Hypothek eine Eigent\xFCmergrundschuld. \xA7 1177 BGB");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(96, "p");
    \u0275\u0275text(97, "Man unterscheidet die");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(98, "ul")(99, "li");
    \u0275\u0275text(100, "Verkehrshypothek und");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(101, "li");
    \u0275\u0275text(102, "die Sicherungshypothek");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(103, "h3");
    \u0275\u0275text(104, "Verkehrshypothek");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(105, "p");
    \u0275\u0275text(106, "Eine Verkehrshypothek kann als Brief- oder als Buchrecht bestellt werden.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(107, "p");
    \u0275\u0275text(108, "Die Verkehrshypothek erwirbt der Gl\xE4ubiger erst dann, wenn folgende Voraussetzungen erf\xFCllt sind:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(109, "p");
    \u0275\u0275text(110, "Bei einer Buchhypothek:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(111, "ul")(112, "li");
    \u0275\u0275text(113, "Einigung und Eintragung \xA7 873 BGB");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(114, "li");
    \u0275\u0275text(115, "Entstehung der Forderung \xA7 1113 BGB");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(116, "p");
    \u0275\u0275text(117, "Bei einer Briefhypothek:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(118, "ul")(119, "li");
    \u0275\u0275text(120, "Einigung und Eintragung \xA7 873 BGB");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(121, "li");
    \u0275\u0275text(122, "Entstehung der Forderung \xA7 1113 BGB");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(123, "li");
    \u0275\u0275text(124, "\xDCbergabe des Hypothekenbriefes \xA7 1117 BGB");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(125, "p");
    \u0275\u0275text(126, "Vor der Brief\xFCbergabe steht das Recht dem Eigent\xFCmer zu. \xA7 1163 Abs. 2 BGB");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(127, "p");
    \u0275\u0275text(128, "Die Brief\xFCbergabe wird allerdings meist durch eine Vereinbarung ersetzt, die das Grundbuchamt zur Aush\xE4ndigung des Briefes an den Gl\xE4ubiger erm\xE4chtigt. \xA7 1117 Abs. 2 BGB");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(129, "h4");
    \u0275\u0275text(130, "Der Hypothekenbrief");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(131, "p");
    \u0275\u0275text(132, "Der Hypothekenbrief muss folgende Angaben enthalten:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(133, "ul")(134, "li");
    \u0275\u0275text(135, "Bezeichnung \u201EHypothekenbrief\u201C");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(136, "li");
    \u0275\u0275text(137, "Geldbetrag");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(138, "li");
    \u0275\u0275text(139, "belastetes Grundst\xFCck");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(140, "li");
    \u0275\u0275text(141, "Unterschrift des Rechtspflegers*");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(142, "li");
    \u0275\u0275text(143, "Unterschrift des Urkundsbeamten der Gesch\xE4ftsstelle*");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(144, "li");
    \u0275\u0275text(145, "Dienstsiegel");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(146, "p");
    \u0275\u0275text(147, "* Die Unterschriften entfallen bei maschinell gef\xFChrten Grundb\xFCchern. Der Zusatz \u201EMaschinell hergestellt und ohne Unterschrift g\xFCltig\u201C ist zu vermerken. \xA7 87 GBV");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(148, "p");
    \u0275\u0275text(149, "Weiterhin soll der Brief folgende Angaben enthalten:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(150, "ul")(151, "li");
    \u0275\u0275text(152, "Blattnummer");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(153, "li");
    \u0275\u0275text(154, "Inhalt der Eintragung");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(155, "p");
    \u0275\u0275text(156, "Fehlt eine der Muss-Angaben, so ist der Brief ung\xFCltig. Bei Fehlen einer Soll-Angabe gilt der Brief jedoch.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(157, "p");
    \u0275\u0275text(158, "Der Gl\xE4ubiger kann die Briefhypothek ohne Umschreibung im Grundbuch durch schriftliche Erkl\xE4rung und \xDCbergabe des Briefes auf einen anderen \xFCbertragen. \xA7 1154 Abs. 1 BGB");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(159, "p");
    \u0275\u0275text(160, "Wurde die Forderung gezahlt, muss der Gl\xE4ubiger den Brief dem Eigent\xFCmer aush\xE4ndigen. \xA7 1144 BGB");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(161, "h4");
    \u0275\u0275text(162, "Abtretung der Hypothek");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(163, "p");
    \u0275\u0275text(164, "F\xFCr die \xDCbertragung der Hypothek auf einen anderen Gl\xE4ubiger, ist die Abtretungserkl\xE4rung des bisherigen Gl\xE4ubigers notwendig. \xA7 398 BGB");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(165, "p");
    \u0275\u0275text(166, "Bei einer Buchhypothek muss die Abtretung ins Grundbuch eingetragen werden. Bei einer Briefhypothek gen\xFCgt die \xDCbergabe des Briefes.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(167, "h4");
    \u0275\u0275text(168, "Erl\xF6schen der Hypothek");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(169, "p");
    \u0275\u0275text(170, "Die Hypothek erlischt, wenn der Gl\xE4ubiger im Wege der Zwangsvollstreckung aus dem Grundst\xFCck befriedigt wird. \xA7 1181 BGB");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(171, "p");
    \u0275\u0275text(172, "Die Eintragung wird dann aufgrund eines Ersuchens des Zwangsvollstreckungsgericht gel\xF6scht.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(173, "p");
    \u0275\u0275text(174, "Bei R\xFCckzahlung des Darlehns oder Verzicht des Gl\xE4ubigers geht die Hypothek auf dem Eigent\xFCmer \xFCber. Gleichzeitig wird das Grundbuch unrichtig. \xA7\xA7 1163 Abs. I S. 2, 1168 BGB");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(175, "p");
    \u0275\u0275text(176, "Der Eigent\xFCmer kann das Recht l\xF6schen lassen oder in eine Eigent\xFCmergrundschuld umschreiben lassen.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(177, "p");
    \u0275\u0275text(178, "Die Umschreibung in eine Eigent\xFCmergrundschuld verhindert jedoch nicht das Aufr\xFCcken rangschlechterer Grundpfandrechte. Gleich- oder nachrangigen Grundpfandrechten steht ein gesetzlicher L\xF6schungsanspruch gegen\xFCber dem Eigent\xFCmer zu. \xA7 1179a Abs. 1 BGB");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(179, "p");
    \u0275\u0275text(180, "Der L\xF6schungsanspruch kann vertraglich ausgeschlossen werden. \xA7 1179a Abs. 5 BGB");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(181, "h3");
    \u0275\u0275text(182, "Sicherungshypothek");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(183, "ul")(184, "li");
    \u0275\u0275text(185, "muss als solche im Grundbuch bezeichnet sein \xA7 1184 BGB");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(186, "li");
    \u0275\u0275text(187, "kann nur als Buchrecht bestellt werden \xA7 1185 BGB");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(188, "p");
    \u0275\u0275text(189, "Die Erteilung eines Briefes ist immer ausgeschlossen.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(190, "p");
    \u0275\u0275text(191, "Sicherungshypothek kraft Gesetzes sind:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(192, "ul")(193, "li");
    \u0275\u0275text(194, "H\xF6chstbetragshypothek \xA7 1190 BGB");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(195, "li");
    \u0275\u0275text(196, "Zwangssicherungshypothek \xA7\xA7 866 ff. ZPO");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(197, "h4");
    \u0275\u0275text(198, "H\xF6chstbetragshypothek");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(199, "blockquote", 3);
    \u0275\u0275text(200, "\u201ESonderform der Sicherungshypothek, bei der die Haftung nur bis zu dem im Grundbuch eingetragenen H\xF6chstbetrag beschr\xE4nkt ist.\u201C");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(201, "ul")(202, "li");
    \u0275\u0275text(203, "wird nicht f\xFCr einen Forderungsbetrag sondern einen H\xF6chstbetrag bestellt");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(204, "li");
    \u0275\u0275text(205, "Zinsen sind im H\xF6chstbetrag eingerechnet");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(206, "li");
    \u0275\u0275text(207, "Forderung kann unabh\xE4ngig von der Hypothek \xFCbertragen werden");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(208, "li");
    \u0275\u0275text(209, "soweit die Forderung hinter dem H\xF6chstbetrag zur\xFCckbleibt, steht die Hypothek dem Eigent\xFCmer zu");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(210, "li");
    \u0275\u0275text(211, "Heute nicht mehr \xFCblich (Grundschuld ist vorteilhafter, aufgrund formloser Forderungsauswechslung)");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(212, "h4");
    \u0275\u0275text(213, "Zwangssicherungshypothek");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(214, "blockquote", 3);
    \u0275\u0275text(215, "\u201ESicherungshypothek, die im Wege der Zwangsvollstreckung wegen einer Geldforderung von mehr als 750 \u20AC ins Grundbuch eingetragen wird.\u201C");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(216, "p");
    \u0275\u0275text(217, "F\xFCr die Eintragung m\xFCssen die vollstreckungsrechtlichen Voraussetzungen als auch die grundbuchrechtlichen Voraussetzungen erf\xFCllt sein.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(218, "h5");
    \u0275\u0275text(219, "Vollstreckungsrechtliche Voraussetzungen");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(220, "ul")(221, "li");
    \u0275\u0275text(222, "Titel \xA7\xA7 704, 794 ZPO");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(223, "li");
    \u0275\u0275text(224, "Klausel \xA7\xA7 725 ZPO");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(225, "li");
    \u0275\u0275text(226, "Zustellung \xA7\xA7 750 ZPO");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(227, "p");
    \u0275\u0275text(228, "Die Forderung muss mehr als 750,00 \u20AC betragen. Auf Grund mehrerer demselben Gl\xE4ubiger zustehender Schuldtitel kann eine einheitliche Sicherungshypothek eingetragen werden. \xA7 866 ZPO");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(229, "p");
    \u0275\u0275text(230, "Es darf keine Gesamthypothek entstehen. (eine Hypothek f\xFCr mehrere Grundst\xFCcke)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(231, "p");
    \u0275\u0275text(232, "Sollen mehrere Grundst\xFCcke des Schuldners mit der Hypothek belastet werden, so ist der Betrag der Forderung auf die einzelnen Grundst\xFCcke zu verteilen. Der Betrag eines Teiles muss mehr als 750,00 \u20AC betragen. Die Gr\xF6\xDFe der Teile bestimmt der Gl\xE4ubiger. \xA7 867 Abs. 2 ZPO");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(233, "h5");
    \u0275\u0275text(234, "Grundbuchrechtliche Voraussetzungen");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(235, "ul")(236, "li");
    \u0275\u0275text(237, "Antrag \xA7 13 GBO");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(238, "li");
    \u0275\u0275text(239, "Titel (ersetzt die Bewilligung des Eigent\xFCmers)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(240, "li");
    \u0275\u0275text(241, "Schuldner muss eingetragen sein");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(242, "p");
    \u0275\u0275text(243, "Der Schuldtitel ist an den Gl\xE4ubiger zur\xFCckzugeben.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(244, "p");
    \u0275\u0275text(245, "Bei Antr\xE4gen von Bundes- und Landesbeh\xF6rden (z.B. Finanzamt, Gerichtskasse) braucht kein Vollstreckungstitel vorgelegt werden, hier gen\xFCgen Siegel und Unterschrift des Beh\xF6rdenleiters auf dem Eintragungsersuchen.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(246, "p");
    \u0275\u0275text(247, "Bei Antr\xE4gen von K\xF6rperschaften des \xF6ffentliches Rechts (z.B. Gemeinden, Krankenkassen, Innungen) wird anstelle eines Titels ein Ausstandsverzeichnis vorgelegt.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(248, "h5");
    \u0275\u0275text(249, "Titelvermerk");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(250, "p");
    \u0275\u0275text(251, "Die Eintragung ist auf dem Vollstreckungstitel zu vermerken. \xA7 867 Abs. 1 S. 1 ZPO");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(252, "p");
    \u0275\u0275text(253, "In der Praxis geschieht dies durch Verbindung des Titels mit einem Ausdruck eines Eintragungsvermerks.");
    \u0275\u0275elementEnd()()()();
  }
}, dependencies: [ArtikelComponent] });
var Abteilung3Component = _Abteilung3Component;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(Abteilung3Component, { className: "Abteilung3Component", filePath: "src/app/routes/grundbuchrecht/abteilung3/abteilung3.component.ts", lineNumber: 9 });
})();

// src/app/routes/grundbuchrecht/bestandsverzeichnis/bestandsverzeichnis.component.ts
var _BestandsverzeichnisComponent = class _BestandsverzeichnisComponent {
  constructor(meta, titleService) {
    this.meta = meta;
    this.titleService = titleService;
    this.meta.addTag({
      name: "description",
      content: "Eine kompakte Einleitung ins Grundbuchrecht. Kurze Erkl\xE4rung des Bestandsverzeichnises des Grundbuchs."
    });
    this.titleService.setTitle("Einleitung Grundbuchrecht: Bestandsverzeichnis");
  }
};
_BestandsverzeichnisComponent.\u0275fac = function BestandsverzeichnisComponent_Factory(t) {
  return new (t || _BestandsverzeichnisComponent)(\u0275\u0275directiveInject(Meta), \u0275\u0275directiveInject(Title));
};
_BestandsverzeichnisComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _BestandsverzeichnisComponent, selectors: [["app-bestandsverzeichnis"]], decls: 357, vars: 0, consts: [["nextSite", "/grundbuchrecht/abteilung1"], ["id", "definitiongrundst\xFCck"], [1, "sectiondiv"], [1, "infokasten"], [1, "musterbvz"], [1, "schriftganzoben", "spacebetween"], [1, "header"], [1, "width10", "columndiv", "borderright"], [1, "flexgrow1"], [1, "bordertop", "height20"], [1, "flexgrow1", "columndiv", "borderright"], [1, "padding", "borderbottom"], [1, "rowdiv"], [1, "columndiv", "borderright", "width20"], [1, "flexgrow1", "columndiv"], [1, "borderright", "flexgrow1"], [1, "columndiv", "borderright", "width15"], [1, "columndiv", "flexgrow1"], [1, "columndiv", "width10"], [1, "flexgrow1", "rowdiv"], [1, "borderright", "flexbasis100"], [1, "flexbasis100"], [1, "gbinhalt", "rowdiv"], [1, "width10", "borderright", "columndiv"], [1, "margin1"], [1, "flexgrow1", "borderright", "rowdiv"], [1, "width20", "borderright", "columndiv"], [1, "margin1", "rowdiv", "spacearound"], [1, "width15", "borderright", "columndiv"], [1, "margin1", "textalignleft"], [1, "width10", "rowdiv"], [1, "flexbasis100", "borderright", "flexshrink1", "columndiv"], [1, "flexbasis100", "columndiv"], [1, "rahmengrundst\xFCck"], ["id", "definitionflurst\xFCck"], ["routerLink", "/grundbuchrecht/bestandsverzeichnis", "fragment", "definitiongrundst\xFCck"], ["href", "https://www.gesetze-im-internet.de/gbvfg/__6.html", "target", "_blank"], ["id", "definitionflur"], ["id", "definitiongemarkung"], ["id", "liegenschaftskarte"], [1, "imageZoomBox"], ["src", "assets/Liegenschaftskarte.avif", "alt", "Liegenschaftskarte", 1, "responsive"], ["id", "zerlegung"], ["id", "verschmelzung"], ["id", "teilung"], ["id", "vereinigung"]], template: function BestandsverzeichnisComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "app-artikel", 0)(1, "section", 1)(2, "div", 2)(3, "h1");
    \u0275\u0275text(4, "Das Bestandsverzeichnis");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "h2");
    \u0275\u0275text(6, "Definition Grundst\xFCck");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "blockquote", 3);
    \u0275\u0275text(8, '"Ein Grundst\xFCck ist ein ');
    \u0275\u0275elementStart(9, "b");
    \u0275\u0275text(10, "katasterm\xE4\xDFig vermessener");
    \u0275\u0275elementEnd();
    \u0275\u0275text(11, " Teil der Erdoberfl\xE4che, der unter einer ");
    \u0275\u0275elementStart(12, "b");
    \u0275\u0275text(13, "laufenden Nummer im Grundbuch");
    \u0275\u0275elementEnd();
    \u0275\u0275text(14, ' eingetragen ist." ');
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "p");
    \u0275\u0275text(16, " Werfen wir einen Blick in das Bestandsverzeichnis eines Grundbuchs. Das Bestandsverzeichnis folgt direkt nach der Aufschrift/Titelseite des Grundbuchs. Hier sind alle Grundst\xFCcke aufgelistet, welche in einem Grundbuch verzeichnet sind. ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "div", 4)(18, "div", 5)(19, "div")(20, "b");
    \u0275\u0275text(21, "Amtsgericht");
    \u0275\u0275elementEnd();
    \u0275\u0275element(22, "br");
    \u0275\u0275text(23, "Musterstadt");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "div")(25, "b");
    \u0275\u0275text(26, "Grundbuch von");
    \u0275\u0275elementEnd();
    \u0275\u0275element(27, "br");
    \u0275\u0275text(28, "Musterhausen");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "div")(30, "b");
    \u0275\u0275text(31, "Blatt");
    \u0275\u0275elementEnd();
    \u0275\u0275element(32, "br");
    \u0275\u0275text(33, "354");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(34, "div")(35, "b");
    \u0275\u0275text(36, "Bestandsverzeichnis");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(37, "div", 6)(38, "div", 7)(39, "span", 8);
    \u0275\u0275text(40, "Laufende");
    \u0275\u0275element(41, "br");
    \u0275\u0275text(42, " Nummer");
    \u0275\u0275element(43, "br");
    \u0275\u0275text(44, "der");
    \u0275\u0275element(45, "br");
    \u0275\u0275text(46, "Grund\xADst\xFCcke");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(47, "span", 9);
    \u0275\u0275text(48, "1");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(49, "div", 7)(50, "span", 8);
    \u0275\u0275text(51, "Bisherige");
    \u0275\u0275element(52, "br");
    \u0275\u0275text(53, " laufende");
    \u0275\u0275element(54, "br");
    \u0275\u0275text(55, " Nummer");
    \u0275\u0275element(56, "br");
    \u0275\u0275text(57, "der Grund\xADst\xFCcke");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(58, "span", 9);
    \u0275\u0275text(59, "2");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(60, "div", 10)(61, "span", 11);
    \u0275\u0275text(62, "Bezeichnung der Grundst\xFCcke und der mit dem Eigentum verbundenen Rechte");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(63, "div", 12)(64, "div", 13)(65, "span", 8);
    \u0275\u0275text(66, "Gemarkung");
    \u0275\u0275element(67, "br");
    \u0275\u0275text(68, "(Vermess\xADungs\xADbezirk)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(69, "span", 9);
    \u0275\u0275text(70, "a");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(71, "div", 13)(72, "div", 14)(73, "span", 8);
    \u0275\u0275text(74, "Karte");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(75, "div", 12)(76, "Span", 15);
    \u0275\u0275text(77, "Flur");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(78, "span", 8);
    \u0275\u0275text(79, "Flurst\xFCck");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(80, "span", 9);
    \u0275\u0275text(81, "b");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(82, "div", 16)(83, "span", 8);
    \u0275\u0275text(84, "Liegen-");
    \u0275\u0275element(85, "br");
    \u0275\u0275text(86, "schafts-");
    \u0275\u0275element(87, "br");
    \u0275\u0275text(88, "buch");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(89, "span", 9);
    \u0275\u0275text(90, "c/d");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(91, "div", 17)(92, "span", 8);
    \u0275\u0275text(93, "Wirtschaftsart und Lage");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(94, "span", 9);
    \u0275\u0275text(95, "e");
    \u0275\u0275elementEnd()();
    \u0275\u0275element(96, "div");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(97, "span", 9);
    \u0275\u0275text(98, "3");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(99, "div", 18)(100, "span", 11);
    \u0275\u0275text(101, "Gr\xF6\xDFe");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(102, "div", 19)(103, "span", 20);
    \u0275\u0275text(104, "ha");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(105, "span", 20);
    \u0275\u0275text(106, "a");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(107, "span", 21);
    \u0275\u0275text(108, "m\xB2");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(109, "span", 9);
    \u0275\u0275text(110, "4");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(111, "div", 22)(112, "div", 23)(113, "span", 24);
    \u0275\u0275text(114, "1");
    \u0275\u0275elementEnd();
    \u0275\u0275element(115, "span", 24);
    \u0275\u0275elementStart(116, "span", 24);
    \u0275\u0275text(117, "2");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(118, "span", 24);
    \u0275\u0275text(119, "3");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(120, "div", 23)(121, "span", 24);
    \u0275\u0275text(122, "-");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(123, "span", 24);
    \u0275\u0275text(124, "-");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(125, "span", 24);
    \u0275\u0275text(126, "-");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(127, "span", 24);
    \u0275\u0275text(128, "-");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(129, "div", 25)(130, "div", 26)(131, "span", 24);
    \u0275\u0275text(132, "Musterhausen");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(133, "span", 24);
    \u0275\u0275text(134, "Musterhausen");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(135, "span", 24);
    \u0275\u0275text(136, "Musterhausen");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(137, "span", 24);
    \u0275\u0275text(138, "Musterhausen");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(139, "div", 26)(140, "div", 27)(141, "span");
    \u0275\u0275text(142, "4");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(143, "span");
    \u0275\u0275text(144, "7/2");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(145, "div", 27)(146, "span");
    \u0275\u0275text(147, "4");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(148, "span");
    \u0275\u0275text(149, "7/5");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(150, "div", 27)(151, "span");
    \u0275\u0275text(152, "2");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(153, "span");
    \u0275\u0275text(154, "1/3");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(155, "div", 27)(156, "span");
    \u0275\u0275text(157, "7");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(158, "span");
    \u0275\u0275text(159, "5");
    \u0275\u0275elementEnd()()();
    \u0275\u0275element(160, "div", 28);
    \u0275\u0275elementStart(161, "div", 14)(162, "span", 29);
    \u0275\u0275text(163, "Geb\xE4ude- und Freifl\xE4che");
    \u0275\u0275element(164, "br");
    \u0275\u0275text(165, "Alte Landstra\xDFe 34");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(166, "span", 29);
    \u0275\u0275text(167, "Landwirtschaftsfl\xE4che");
    \u0275\u0275element(168, "br");
    \u0275\u0275text(169, "Hohes Feld");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(170, "span", 29);
    \u0275\u0275text(171, "Geb\xE4ude- und Freifl\xE4che");
    \u0275\u0275element(172, "br");
    \u0275\u0275text(173, "Neue Allee 14");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(174, "span", 29);
    \u0275\u0275text(175, "Waldfl\xE4che");
    \u0275\u0275element(176, "br");
    \u0275\u0275text(177, "Auf dem H\xFCgel");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(178, "div", 30);
    \u0275\u0275element(179, "div", 31);
    \u0275\u0275elementStart(180, "div", 31)(181, "span", 24);
    \u0275\u0275text(182, "1");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(183, "span", 24);
    \u0275\u0275text(184, "1");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(185, "span", 24);
    \u0275\u0275text(186, "1");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(187, "span", 24);
    \u0275\u0275text(188, "25");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(189, "div", 32)(190, "span", 24);
    \u0275\u0275text(191, "63");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(192, "span", 24);
    \u0275\u0275text(193, "23");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(194, "span", 24);
    \u0275\u0275text(195, "74");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(196, "span", 24);
    \u0275\u0275text(197, "66");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(198, "div", 33);
    \u0275\u0275element(199, "div");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(200, "p");
    \u0275\u0275text(201, " Alles was in der ersten Spalte unter einer Nummer gef\xFChrt ist, geh\xF6rt rechtlich zu einem Grundst\xFCck. Oben ist bespielhaft das Grundst\xFCck mit der laufenden Nummer 1 farblich hervorgehoben. ");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(202, "section", 34);
    \u0275\u0275element(203, "hr");
    \u0275\u0275elementStart(204, "div", 2)(205, "h2");
    \u0275\u0275text(206, "Definition Flurst\xFCck");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(207, "blockquote", 3);
    \u0275\u0275text(208, "Ein Flurst\xFCck ist ein katasterm\xE4\xDFg vermessener Teil der Erdoberfl\xE4che, der unter der Flurst\xFCcksnummer im Liegenschaftskataster verzeichnet ist.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(209, "p");
    \u0275\u0275text(210, " Das Flurst\xFCck ist die kleinste Buchungseinheit des Liegenschaftskatasters.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(211, "p");
    \u0275\u0275text(212, "Andere Bezeichnung: Parzelle");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(213, "p");
    \u0275\u0275text(214, "Ein ");
    \u0275\u0275elementStart(215, "a", 35);
    \u0275\u0275text(216, "Grundst\xFCck");
    \u0275\u0275elementEnd();
    \u0275\u0275text(217, " besteht aus mindestens einem Flurst\xFCck, kann jedoch auch aus meheren Flurst\xFCcken bestehen.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(218, "p");
    \u0275\u0275text(219, " Schauen wir uns noch einmal das obige Bestandsverzeichnis an. Das farblichhervorgehobene Grundst\xFCck Nr. 1 besteht aus zwei Flurst\xFCcken. Das ");
    \u0275\u0275elementStart(220, "a", 35);
    \u0275\u0275text(221, "Grundst\xFCck");
    \u0275\u0275elementEnd();
    \u0275\u0275text(222, " mit der laufenden Nr. 2 sowie das Grundst\xFCck mit der laufenden Nr. 3 bestehen jeweils aus nur einem Flurst\xFCck.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(223, "p");
    \u0275\u0275text(224, " Zu jedem Flurst\xFCck wird die Nutzungsart/Wirtschaftsart, Lagebezeichnung und die Gr\xF6\xDFe ins Grundbuch eingetragen. ");
    \u0275\u0275elementStart(225, "a", 36);
    \u0275\u0275text(226, "\xA7 6 Abs. 3a Nr. 4 GBV");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(227, "section", 37);
    \u0275\u0275element(228, "hr");
    \u0275\u0275elementStart(229, "div", 2)(230, "h2");
    \u0275\u0275text(231, "Definition Flur");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(232, "blockquote", 3);
    \u0275\u0275text(233, "Zusammenfassung mehrere Flurst\xFCcke in eine gr\xF6\xDFere Einheit.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(234, "p");
    \u0275\u0275text(235, " Im obigen Bestandsverzeichnis sind die beiden Flurst\xFCcke des ");
    \u0275\u0275elementStart(236, "a", 35);
    \u0275\u0275text(237, "Grundst\xFCck");
    \u0275\u0275elementEnd();
    \u0275\u0275text(238, " mit der laufenden Nr. 1 der Flur 4 zugeordnet. ");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(239, "section", 38);
    \u0275\u0275element(240, "hr");
    \u0275\u0275elementStart(241, "div", 2)(242, "h2");
    \u0275\u0275text(243, "Definition Gemarkung");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(244, "blockquote", 3);
    \u0275\u0275text(245, "Bezirk, welcher die Bezeichnung des Ortsteils bzw. Stadtteils tr\xE4gt.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(246, "p");
    \u0275\u0275text(247, " In einem Grundbuch werden immer nur die ");
    \u0275\u0275elementStart(248, "a", 35);
    \u0275\u0275text(249, "Grundst\xFCck");
    \u0275\u0275elementEnd();
    \u0275\u0275text(250, " gef\xFChrt, welche zu einer Gemarkung geh\xF6ren. Hat eine Person Eigentum in zwei Gemarkungen, gibt es zwangsl\xE4ufig 2 verschiedene Grundb\xFCcher. ");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(251, "section", 39);
    \u0275\u0275element(252, "hr");
    \u0275\u0275elementStart(253, "div", 2)(254, "h2");
    \u0275\u0275text(255, "Liegenschaftskarte/");
    \u0275\u0275element(256, "wbr");
    \u0275\u0275text(257, "Flurkarte");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(258, "p");
    \u0275\u0275text(259, ' Die Flurkarte zeigt die geografische Lage der Flurst\xFCcke. Das Grundbuch kann nur in Verbindung mit der Flurkarte richtig gelesen werden. Das Grundbuchamt ist nicht f\xFCr Ausdrucke einer Flurkarte zust\xE4ndig. Im Grundbuch ist keine Flurkarte enthalten. Sie k\xF6nnen sich online im "Geoportal" die Lage der Flurst\xFCcke anzeigen lassen oder bei der zust\xE4ndigen Beh\xF6rde eine Flurkarte beantragen. ');
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(260, "div", 40);
    \u0275\u0275element(261, "img", 41);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(262, "section", 42);
    \u0275\u0275element(263, "hr");
    \u0275\u0275elementStart(264, "div", 2)(265, "h2");
    \u0275\u0275text(266, "Zerlegung");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(267, "blockquote", 3);
    \u0275\u0275text(268, "Katasterm\xE4\xDFige Aufteilung eines Flurst\xFCcks");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(269, "p");
    \u0275\u0275text(270, " Ein Flurst\xFCck wird in ");
    \u0275\u0275elementStart(271, "b");
    \u0275\u0275text(272, "mehrere");
    \u0275\u0275elementEnd();
    \u0275\u0275text(273, " Flurst\xFCcke aufgeteilt. ");
    \u0275\u0275element(274, "br")(275, "br");
    \u0275\u0275text(276, " Es bleibt jedoch bei einem ");
    \u0275\u0275elementStart(277, "a", 35);
    \u0275\u0275text(278, "Grundst\xFCck");
    \u0275\u0275elementEnd();
    \u0275\u0275text(279, " (Eine laufende Nr. im Bestansverzeichnis). ");
    \u0275\u0275element(280, "br")(281, "br");
    \u0275\u0275text(282, " Anlass kann beispielsweise der Verkauf eines Grundst\xFCcksteiles sein. (Nach der Zerlegung kann dann eine Teilung in zwei Grundst\xFCcke folgen.) ");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(283, "section", 43);
    \u0275\u0275element(284, "hr");
    \u0275\u0275elementStart(285, "div", 2)(286, "h2");
    \u0275\u0275text(287, "Verschmelzung");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(288, "blockquote", 3);
    \u0275\u0275text(289, " Katasterm\xE4\xDFige Zusammenf\xFChrung mehrerer Flurst\xFCcke. ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(290, "p");
    \u0275\u0275text(291, "Aus mehreren Flurst\xFCcken wird ein einziges.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(292, "p");
    \u0275\u0275text(293, " Folgende Voraussetzungen m\xFCssen f\xFCr eine Verschmelzung erf\xFCllt sein: ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(294, "ul")(295, "li");
    \u0275\u0275text(296, "die Flurst\xFCcke bilden \xF6rtlich und wirtschaftlich eine Einheit.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(297, "li");
    \u0275\u0275text(298, " die Flurst\xFCcke sind im Grundbuch unter einer laufenden Nummer gebucht (ein ");
    \u0275\u0275elementStart(299, "a", 35);
    \u0275\u0275text(300, "Grundst\xFCck");
    \u0275\u0275elementEnd();
    \u0275\u0275text(301, ") ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(302, "p");
    \u0275\u0275text(303, "Die Verschmelzung ist statthaft, wenn");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(304, "ul")(305, "li");
    \u0275\u0275text(306, " die Flurst\xFCcke in derselben Gemarkung liegen und unmittelbar aneinandergrenzen ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(307, "li");
    \u0275\u0275text(308, "die Flurst\xFCcke im gleichen Eigentum stehen");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(309, "li");
    \u0275\u0275text(310, "die Flurst\xFCcke unbelastet oder gleichbelastet sind");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(311, "p");
    \u0275\u0275text(312, " Die Verschmelzung ist kostenfrei, da dies auch der \xDCbersichtlichkeit der \xF6ffentlichen Nachweise dient. ");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(313, "section", 44);
    \u0275\u0275element(314, "hr");
    \u0275\u0275elementStart(315, "div", 2)(316, "h2");
    \u0275\u0275text(317, "Teilung");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(318, "blockquote", 3);
    \u0275\u0275text(319, " Die Aufteilung eines bestehenden ");
    \u0275\u0275elementStart(320, "a", 35);
    \u0275\u0275text(321, "Grundst\xFCcks");
    \u0275\u0275elementEnd();
    \u0275\u0275text(322, " in zwei oder mehrere rechtlich selbst\xE4ndige ");
    \u0275\u0275elementStart(323, "a", 35);
    \u0275\u0275text(324, "Grundst\xFCcke");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(325, "p");
    \u0275\u0275text(326, " Aus einen ");
    \u0275\u0275elementStart(327, "a", 35);
    \u0275\u0275text(328, "Grundst\xFCck");
    \u0275\u0275elementEnd();
    \u0275\u0275text(329, " wird mindestens ein Flurst\xFCck entnommen und als getrennt laufende Nummer im Bestandsverzeichnis gef\xFChrt. Es entsteht ein neues ");
    \u0275\u0275elementStart(330, "a", 35);
    \u0275\u0275text(331, "Grundst\xFCck");
    \u0275\u0275elementEnd();
    \u0275\u0275element(332, "br");
    \u0275\u0275text(333, "Die auf dem ");
    \u0275\u0275elementStart(334, "a", 35);
    \u0275\u0275text(335, "Grundst\xFCck");
    \u0275\u0275elementEnd();
    \u0275\u0275text(336, " lastenden Rechte gehen auf das neue ");
    \u0275\u0275elementStart(337, "a", 35);
    \u0275\u0275text(338, "Grundst\xFCck");
    \u0275\u0275elementEnd();
    \u0275\u0275text(339, " \xFCber. ");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(340, "section", 45);
    \u0275\u0275element(341, "hr");
    \u0275\u0275elementStart(342, "div", 2)(343, "h2");
    \u0275\u0275text(344, "Vereinigung");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(345, "blockquote", 3);
    \u0275\u0275text(346, " Zusammenf\xFChrung mehrerer ");
    \u0275\u0275elementStart(347, "a", 35);
    \u0275\u0275text(348, "Grundst\xFCcke");
    \u0275\u0275elementEnd();
    \u0275\u0275text(349, " zu einem einzigen ");
    \u0275\u0275elementStart(350, "a", 35);
    \u0275\u0275text(351, "Grundst\xFCck");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(352, "p");
    \u0275\u0275text(353, " H\xE4ufig ist eine Vereinigung von mehreren Grundst\xFCcken f\xFCr die Erteilung einer Baugenehmigung erforderlich. ");
    \u0275\u0275element(354, "br")(355, "br");
    \u0275\u0275text(356, "Eine Vereinigung soll insbesondere dann unterbleiben, wenn die Grundst\xFCcke mit unterschiedlichen Grundpfandrechten oder Reallasten belastet sind oder mit denselben Grundpfandrechten oder Reallasten in unterschiedlicher Rangfolge. ");
    \u0275\u0275elementEnd()()()();
  }
}, dependencies: [RouterLink, ArtikelComponent], styles: ['@charset "UTF-8";\n\n\n\n.musterbvz[_ngcontent-%COMP%] {\n  text-align: center;\n  width: 90%;\n  margin: 2em auto;\n}\n.musterbvz[_ngcontent-%COMP%]   *[_ngcontent-%COMP%] {\n  box-sizing: border-box;\n}\n.musterbvz[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: clamp(8px, 1vw, 14px);\n}\n@media only screen and (max-width: 700px) {\n  .musterbvz[_ngcontent-%COMP%] {\n    width: 100%;\n  }\n}\n.musterbvz[_ngcontent-%COMP%]   .schriftganzoben[_ngcontent-%COMP%] {\n  display: flex;\n  font-size: clamp(6px, 16px, 2vw);\n  justify-content: space-between;\n}\n.musterbvz[_ngcontent-%COMP%]   .header[_ngcontent-%COMP%] {\n  border: 1px solid var(--schrift);\n  display: flex;\n}\n.musterbvz[_ngcontent-%COMP%]   .width20[_ngcontent-%COMP%] {\n  width: 22%;\n}\n.musterbvz[_ngcontent-%COMP%]   .width10[_ngcontent-%COMP%] {\n  width: 10%;\n}\n.musterbvz[_ngcontent-%COMP%]   .width15[_ngcontent-%COMP%] {\n  width: 15%;\n}\n.musterbvz[_ngcontent-%COMP%]   .flexgrow1[_ngcontent-%COMP%] {\n  flex-grow: 1;\n}\n.musterbvz[_ngcontent-%COMP%]   .flexbasis100[_ngcontent-%COMP%] {\n  flex-basis: 100%;\n}\n.musterbvz[_ngcontent-%COMP%]   .height20[_ngcontent-%COMP%] {\n  height: 1.5em;\n}\n.musterbvz[_ngcontent-%COMP%]   .columndiv[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n}\n.musterbvz[_ngcontent-%COMP%]   .rowdiv[_ngcontent-%COMP%] {\n  display: flex;\n}\n.musterbvz[_ngcontent-%COMP%]   .borderright[_ngcontent-%COMP%] {\n  border-right: 1px solid var(--schrift);\n}\n.musterbvz[_ngcontent-%COMP%]   .borderbottom[_ngcontent-%COMP%] {\n  border-bottom: 1px solid var(--schrift);\n}\n.musterbvz[_ngcontent-%COMP%]   .bordertop[_ngcontent-%COMP%] {\n  border-top: 1px solid var(--schrift);\n}\n.musterbvz[_ngcontent-%COMP%]   .padding[_ngcontent-%COMP%] {\n  padding: 0.3em;\n}\n.musterbvz[_ngcontent-%COMP%]   .margin1[_ngcontent-%COMP%] {\n  margin-top: 1rem;\n  height: 2rem;\n}\n.musterbvz[_ngcontent-%COMP%]   .spacearound[_ngcontent-%COMP%] {\n  justify-content: space-around;\n}\n.musterbvz[_ngcontent-%COMP%]   .gbinhalt[_ngcontent-%COMP%] {\n  height: 200px;\n  border: 1px solid var(--schrift);\n  border-top: 0;\n  position: relative;\n}\n.musterbvz[_ngcontent-%COMP%]   .textalignleft[_ngcontent-%COMP%] {\n  text-align: left;\n  margin-left: 2%;\n}\n.musterbvz[_ngcontent-%COMP%]   .rahmengrundst\\fc ck[_ngcontent-%COMP%] {\n  position: absolute;\n  width: 100%;\n}\n.musterbvz[_ngcontent-%COMP%]   .rahmengrundst\\fc ck div[_ngcontent-%COMP%] {\n  border: 2px solid var(--primary-variant-much-brighter);\n  height: 5.5rem;\n  width: 99%;\n  margin: 0.9em auto;\n}\n.responsive[_ngcontent-%COMP%] {\n  max-width: 100%;\n  height: auto;\n}\n/*# sourceMappingURL=bestandsverzeichnis.component.css.map */'] });
var BestandsverzeichnisComponent = _BestandsverzeichnisComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(BestandsverzeichnisComponent, { className: "BestandsverzeichnisComponent", filePath: "src/app/routes/grundbuchrecht/bestandsverzeichnis/bestandsverzeichnis.component.ts", lineNumber: 9 });
})();

// src/app/routes/grundbuchrecht/einleitung/einleitung.component.ts
var _EinleitungComponent = class _EinleitungComponent {
  constructor(meta, titleService) {
    this.meta = meta;
    this.titleService = titleService;
    this.faUniversity = faUniversity;
    this.faMapMarkedAlt = faMapMarkedAlt;
    this.meta.addTag({
      name: "description",
      content: "Eine kompakte Einleitung ins Grundbuchrecht. Einfach geschrieben und die wichtigsten Themen angesprochen."
    });
    this.titleService.setTitle("Einleitung Grundbuchrecht");
  }
};
_EinleitungComponent.\u0275fac = function EinleitungComponent_Factory(t) {
  return new (t || _EinleitungComponent)(\u0275\u0275directiveInject(Meta), \u0275\u0275directiveInject(Title));
};
_EinleitungComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _EinleitungComponent, selectors: [["app-einleitung"]], decls: 140, vars: 2, consts: [["nextSite", "/grundbuchrecht/bestandsverzeichnis"], ["id", "definitiongrundbuch"], [1, "sectiondiv"], [1, "infokasten"], ["href", "https://dejure.org/gesetze/GBO/4.html"], ["href", "https://dejure.org/gesetze/GBO/2.html"], [1, "variantColor"], [1, "variant"], ["id", "aufbau"], ["routerLink", "/grundbuchrecht/bestandsverzeichnis"], ["routerLink", "/grundbuchrecht/abteilung1"], ["routerLink", "/grundbuchrecht/abteilung2"], ["routerLink", "/grundbuchrecht/abteilung3"], ["id", "zust\xE4ndigkeiten"], [1, "Zust\xE4ndigkeiten"], [1, "Zust\xE4ndigkeit"], [1, "iconContainer"], [1, "icon", 3, "icon"], ["href", "https://dejure.org/gesetze/GBO/1.html", "target", "_blank"], ["href", "https://www.justizadressen.nrw.de/de/justiz/gericht?ang=grundbuch&plz=&ort=", "target", "_blank"], ["id", "\xF6ffentlicherglaube"], [1, "rot"], ["href", "https://dejure.org/gesetze/BGB/892.html", "target", "_blank"]], template: function EinleitungComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "app-artikel", 0)(1, "section", 1)(2, "div", 2)(3, "h1");
    \u0275\u0275text(4, "Einleitung Grundbuchrecht");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "h2");
    \u0275\u0275text(6, "Definition Grundbuch");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "blockquote", 3);
    \u0275\u0275text(8, "\u201EDas Grundbuch ist ein ");
    \u0275\u0275elementStart(9, "b");
    \u0275\u0275text(10, "beschr\xE4nkt \xF6ffentliches");
    \u0275\u0275elementEnd();
    \u0275\u0275text(11, " Register, in welchem die ");
    \u0275\u0275elementStart(12, "b");
    \u0275\u0275text(13, "Grundst\xFCcke");
    \u0275\u0275elementEnd();
    \u0275\u0275text(14, ", die hieran bestehenden ");
    \u0275\u0275elementStart(15, "b");
    \u0275\u0275text(16, "Eigentumsverh\xE4ltnisse");
    \u0275\u0275elementEnd();
    \u0275\u0275text(17, " und die damit verbundenen ");
    \u0275\u0275elementStart(18, "b");
    \u0275\u0275text(19, "Rechte");
    \u0275\u0275elementEnd();
    \u0275\u0275text(20, " und ");
    \u0275\u0275elementStart(21, "b");
    \u0275\u0275text(22, "Belastungen");
    \u0275\u0275elementEnd();
    \u0275\u0275text(23, " verzeichnet sind.\u201C");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "p");
    \u0275\u0275text(25, "F\xFCr jeden Ort wird je Eigentumsverh\xE4ltnis ein Grundbuch gef\xFChrt. (Personalfolium) ");
    \u0275\u0275element(26, "br");
    \u0275\u0275elementStart(27, "a", 4);
    \u0275\u0275text(28, "\xA7\xA7 4 Abs. 1, ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "a", 5);
    \u0275\u0275text(30, "2 Abs. 1 GBO");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(31, "b");
    \u0275\u0275text(32, "Beispiel:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "span");
    \u0275\u0275text(34, "Max ");
    \u0275\u0275elementStart(35, "b", 6);
    \u0275\u0275text(36, "Alleineigentum");
    \u0275\u0275elementEnd();
    \u0275\u0275text(37, " in Musterstadt = ein Grundbuch in Musterstadt");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(38, "span");
    \u0275\u0275text(39, "Max ");
    \u0275\u0275elementStart(40, "b", 6);
    \u0275\u0275text(41, "Alleineigentum");
    \u0275\u0275elementEnd();
    \u0275\u0275text(42, " in Beispielhausen = ein Grundbuch in Beispielhausen ");
    \u0275\u0275elementEnd();
    \u0275\u0275element(43, "br");
    \u0275\u0275elementStart(44, "span");
    \u0275\u0275text(45, "Max und Erika ");
    \u0275\u0275elementStart(46, "b", 7);
    \u0275\u0275text(47, "Miteigentum");
    \u0275\u0275elementEnd();
    \u0275\u0275text(48, " in Musterstadt = ein weiteres Grundbuch in Musterstadt");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(49, "section", 8);
    \u0275\u0275element(50, "hr");
    \u0275\u0275elementStart(51, "Div", 2)(52, "h2");
    \u0275\u0275text(53, "Aufbau des Grundbuchs");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(54, "span");
    \u0275\u0275text(55, "Ein Grundbuch hat immer die folgende Struktur:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(56, "ul", 8)(57, "li")(58, "b");
    \u0275\u0275text(59, "Aufschrift");
    \u0275\u0275elementEnd();
    \u0275\u0275element(60, "br");
    \u0275\u0275elementStart(61, "span");
    \u0275\u0275text(62, "(Titelblatt/Deckblatt)");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(63, "li")(64, "a", 9)(65, "b");
    \u0275\u0275text(66, "Bestandsverzeichnis");
    \u0275\u0275elementEnd()();
    \u0275\u0275element(67, "br");
    \u0275\u0275elementStart(68, "span");
    \u0275\u0275text(69, "(Grundst\xFCcke)");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(70, "li")(71, "a", 10)(72, "b");
    \u0275\u0275text(73, "Abteilung I");
    \u0275\u0275elementEnd()();
    \u0275\u0275element(74, "br");
    \u0275\u0275elementStart(75, "span");
    \u0275\u0275text(76, "(Eigent\xFCmer)");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(77, "li")(78, "a", 11)(79, "b");
    \u0275\u0275text(80, "Abteilung II");
    \u0275\u0275elementEnd()();
    \u0275\u0275element(81, "br");
    \u0275\u0275elementStart(82, "span");
    \u0275\u0275text(83, "(Lasten und Beschr\xE4nkungen)");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(84, "li")(85, "a", 12)(86, "b");
    \u0275\u0275text(87, "Abteilung III");
    \u0275\u0275elementEnd()();
    \u0275\u0275element(88, "br");
    \u0275\u0275elementStart(89, "span");
    \u0275\u0275text(90, "(Grundschulden, Hypotheken und Rentenschulden)");
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275elementStart(91, "section", 13);
    \u0275\u0275element(92, "hr");
    \u0275\u0275elementStart(93, "div", 2)(94, "h2");
    \u0275\u0275text(95, "Zust\xE4ndigkeiten");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(96, "div", 14)(97, "figure", 15)(98, "div", 16);
    \u0275\u0275element(99, "fa-icon", 17);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(100, "figcaption")(101, "span")(102, "b");
    \u0275\u0275text(103, "Sachlich");
    \u0275\u0275elementEnd();
    \u0275\u0275text(104, " zust\xE4ndig ist das Amtsgericht (als\xA0Grundbuchamt). ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(105, "a", 18);
    \u0275\u0275text(106, "\xA7 1 Abs. 1 S. 1 GBO");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(107, "figure", 15)(108, "div", 16);
    \u0275\u0275element(109, "fa-icon", 17);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(110, "figcaption")(111, "p")(112, "b");
    \u0275\u0275text(113, "\xD6rtlich");
    \u0275\u0275elementEnd();
    \u0275\u0275text(114, " zust\xE4ndig ist das Amtsgericht in dessen Bezirk das Grundst\xFCck liegt. ");
    \u0275\u0275elementStart(115, "a", 18);
    \u0275\u0275text(116, "\xA7 1 Abs. 1 S. 2 GBO");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(117, "p");
    \u0275\u0275text(118, "Pr\xFCfen, in welchem Amtsgerichtsbezirk ein Grundst\xFCck liegt, k\xF6nnen Sie im ");
    \u0275\u0275elementStart(119, "a", 19)(120, "u");
    \u0275\u0275text(121, "Justizportal");
    \u0275\u0275elementEnd()();
    \u0275\u0275text(122, ". ");
    \u0275\u0275elementEnd()()()()()();
    \u0275\u0275elementStart(123, "section", 20);
    \u0275\u0275element(124, "hr");
    \u0275\u0275elementStart(125, "div", 2)(126, "h2");
    \u0275\u0275text(127, "\xD6ffentlicher Glaube");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(128, "span");
    \u0275\u0275text(129, "Das Grundbuch genie\xDFt \xF6ffentlichen Glauben.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(130, "blockquote", 3);
    \u0275\u0275text(131, "\u201EJeder gutgl\xE4ubiger Erwerber kann sich auf die Angaben im Grundbuch verlassen, auch wenn diese nicht der Richtigkeit entsprechen.\u201C");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(132, "p");
    \u0275\u0275text(133, "Es gilt die Vermutung, dass ein im Grundbuch eingetragenes Recht demjenigen zusteht, zu dessen Gunsten es eingetragen ist. Zugleich wird vermutet, dass ein im Grundbuch gel\xF6schtes Recht nicht mehr besteht.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(134, "span", 21);
    \u0275\u0275text(135, "Gilt nicht, wenn man anderweitige Kenntnisse hat.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(136, "p");
    \u0275\u0275text(137, "Der \xF6ffentliche Glaube des Grundbuchs dient dem Schutz des Rechtsverkehrs.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(138, "a", 22);
    \u0275\u0275text(139, "\xA7 892 Abs. 1 BGB");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    \u0275\u0275advance(99);
    \u0275\u0275property("icon", ctx.faUniversity);
    \u0275\u0275advance(10);
    \u0275\u0275property("icon", ctx.faMapMarkedAlt);
  }
}, dependencies: [RouterLink, FaIconComponent, ArtikelComponent], styles: ['@charset "UTF-8";\n\n\n\n[_nghost-%COMP%] {\n  display: flex;\n  flex-direction: column;\n}\nsection[_ngcontent-%COMP%]:first-of-type   .sectiondiv[_ngcontent-%COMP%]   .infokasten[_ngcontent-%COMP%] {\n  margin-top: 0;\n}\n#aufbau[_ngcontent-%COMP%] {\n  margin: 0;\n}\n#aufbau[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  margin: 1em;\n  border: 1px solid var(--primary-variant-darker);\n  padding: 0.5em;\n}\n.Zust\\e4ndigkeiten[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-evenly;\n  flex-wrap: wrap;\n  width: 100%;\n}\n.Zust\\e4ndigkeit[_ngcontent-%COMP%] {\n  border: 0.15rem solid var(--primary-variant-darker);\n  margin: 0 1em 1em 0;\n  border-radius: 15px;\n  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);\n  max-width: 25em;\n  min-width: 200px;\n  display: flex;\n  flex-direction: column;\n}\n.Zust\\e4ndigkeit[_ngcontent-%COMP%]   .iconContainer[_ngcontent-%COMP%] {\n  padding: 0.5em;\n  font-size: 2em;\n  background-color: var(--primary-variant-much-brighter);\n  border-bottom: 0;\n  border-radius: 13px 13px 0 0;\n  display: flex;\n  text-align: center;\n  justify-content: center;\n}\n.Zust\\e4ndigkeit figcaption[_ngcontent-%COMP%] {\n  border-top: 0;\n  border-radius: 0 0 8px 8px;\n  padding: 0.5em;\n  margin-bottom: auto;\n}\n/*# sourceMappingURL=einleitung.component.css.map */'] });
var EinleitungComponent = _EinleitungComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(EinleitungComponent, { className: "EinleitungComponent", filePath: "src/app/routes/grundbuchrecht/einleitung/einleitung.component.ts", lineNumber: 14 });
})();

// src/app/components/accordion/accordion.component.ts
var _c08 = ["accordionhead"];
var _c15 = ["*"];
var _c24 = (a0) => ({ "darkmode": a0 });
var _AccordionComponent = class _AccordionComponent {
  constructor(dl) {
    this.dl = dl;
    this.faAngleDown = faAngleDown;
    this.frage = "";
  }
  click() {
    const selectedElement = this.accordionhead.nativeElement;
    selectedElement.classList.toggle("FrageHeadAngeglickt");
    var Antwort = selectedElement.nextElementSibling;
    if (Antwort.style.maxHeight)
      Antwort.style.maxHeight = null;
    else
      Antwort.style.maxHeight = Antwort.scrollHeight + "px";
  }
};
_AccordionComponent.\u0275fac = function AccordionComponent_Factory(t) {
  return new (t || _AccordionComponent)(\u0275\u0275directiveInject(DesignloaderService));
};
_AccordionComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AccordionComponent, selectors: [["app-accordion"]], viewQuery: function AccordionComponent_Query(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275viewQuery(_c08, 5);
  }
  if (rf & 2) {
    let _t;
    \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.accordionhead = _t.first);
  }
}, inputs: { frage: "frage" }, ngContentSelectors: _c15, decls: 9, vars: 5, consts: [["accordionhead", ""], [1, "Frage", 3, "ngClass"], [1, "FrageHead", 2, "cursor", "pointer", 3, "click"], [3, "icon"], [1, "Antwort"], [1, "Antwortpanel"]], template: function AccordionComponent_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275projectionDef();
    \u0275\u0275elementStart(0, "div", 1)(1, "div", 2, 0);
    \u0275\u0275listener("click", function AccordionComponent_Template_div_click_1_listener() {
      \u0275\u0275restoreView(_r1);
      return \u0275\u0275resetView(ctx.click());
    });
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275element(5, "fa-icon", 3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 4)(7, "div", 5);
    \u0275\u0275projection(8);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(3, _c24, ctx.dl.darkmode.value));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx.frage);
    \u0275\u0275advance();
    \u0275\u0275property("icon", ctx.faAngleDown);
  }
}, dependencies: [NgClass, FaIconComponent], styles: ["\n\n.FrageHead[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 0.5em 1em;\n  -webkit-user-select: none;\n  user-select: none;\n  border-radius: 12px;\n  background-color: var(--hintergrund);\n}\n.FrageHead[_ngcontent-%COMP%]:hover {\n  background-color: var(--hintergrund-variant);\n}\n.FrageHead[_ngcontent-%COMP%]   fa-icon[_ngcontent-%COMP%] {\n  font-size: 20px;\n  margin: 5px;\n}\n.Antwort[_ngcontent-%COMP%] {\n  max-height: 0;\n  transition: max-height 0.2s ease-out;\n  overflow: hidden;\n  background-color: var(--hintergrund-variant);\n  border-radius: 12px;\n}\n.Antwortpanel[_ngcontent-%COMP%] {\n  padding: 0 1em;\n}\n.darkmode[_ngcontent-%COMP%]   .FrageHeadAngeglickt[_ngcontent-%COMP%], \n.FrageHeadAngeglickt[_ngcontent-%COMP%] {\n  border: 0.2em solid var(--primary-variant-darker);\n  background-color: var(--primary-variant-much-brighter);\n  font-weight: 700;\n}\n.darkmode[_ngcontent-%COMP%]   .FrageHeadAngeglickt[_ngcontent-%COMP%]    + .Antwort[_ngcontent-%COMP%], \n.FrageHeadAngeglickt[_ngcontent-%COMP%]    + .Antwort[_ngcontent-%COMP%] {\n  margin-top: 0.6em;\n}\n.FrageHeadAngeglickt[_ngcontent-%COMP%]   Span[_ngcontent-%COMP%] {\n  font-weight: 700;\n}\n.FrageHeadAngeglickt[_ngcontent-%COMP%]   fa-icon[_ngcontent-%COMP%] {\n  color: var(--primary-variant-darker);\n  transform: rotate(180deg);\n  transition: all 0.2s;\n}\n/*# sourceMappingURL=accordion.component.css.map */"] });
var AccordionComponent = _AccordionComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AccordionComponent, { className: "AccordionComponent", filePath: "src/app/components/accordion/accordion.component.ts", lineNumber: 17 });
})();

// src/app/routes/home/home.component.ts
var _c09 = (a0) => ({ "darkmode": a0 });
var _HomeComponent = class _HomeComponent {
  constructor(dl, router, meta, titleService) {
    this.dl = dl;
    this.router = router;
    this.meta = meta;
    this.titleService = titleService;
    this.title = "grundbuch";
    this.faFilePdf = faFilePdf;
    this.faPrint = faPrint;
    this.faDownload = faDownload;
    this.faHome = faHome;
    this.faEnvelope = faEnvelope;
    this.faFax = faFax;
    this.faUser = faUser;
    this.faPhone = faPhone;
    this.faAt = faAt;
    this.faGlobe = faGlobe;
    this.faUniversity = faUniversity;
    this.faMapMarkedAlt = faMapMarkedAlt;
    this.meta.updateTag({
      name: "description",
      content: "Download eines Musterantrags auf Erteilung eines Grundbuchausdrucks als pdf oder docx."
    });
    this.titleService.setTitle("Kostenloser Musterantrag auf Erteilung eines Grundbuchausdrucks");
  }
  grundbuchausdruckBeantragen() {
    this.router.navigate(["/grundbuchausdruck-beantragen"]);
  }
};
_HomeComponent.\u0275fac = function HomeComponent_Factory(t) {
  return new (t || _HomeComponent)(\u0275\u0275directiveInject(DesignloaderService), \u0275\u0275directiveInject(Router), \u0275\u0275directiveInject(Meta), \u0275\u0275directiveInject(Title));
};
_HomeComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _HomeComponent, selectors: [["app-home"]], decls: 349, vars: 18, consts: [["farbe", "var(--hintergrund-variant)"], ["id", "home", 3, "ngClass"], [1, "sectiondiv"], [1, "homebanner"], [1, "titeluntertext"], [1, "primary-variant-darker"], [1, "nurgerichtskosten"], [3, "click"], ["onclick", "location.href='#mehrInfos'", 1, "btntext"], [1, "labels"], [1, "icon", 3, "icon"], [1, "imgdiv"], [3, "icon"], ["id", "mehrInfos", 1, "infobanner"], [2, "color", "red"], ["id", "info", 3, "ngClass"], [1, "Erkl\xE4rung"], [1, "rot"], [1, "antragsartdiv"], [1, "antragsart"], [1, "icondiv"], [1, "antragsarttext"], [1, "BannerMusterantrag"], [1, "btnoutlined", 3, "click"], [1, "antragsart", "antragsartfalsch"], [1, "infobanner"], ["id", "Wo"], [1, "Zust\xE4ndigkeiten"], [1, "Zust\xE4ndigkeit"], [1, "icondivz"], [1, "Erkl\xE4rungZust\xE4ndigkeit"], ["href", "https://www.justizadressen.nrw.de/de/justiz/gericht?ang=grundbuch&plz=&ort=", "target", "_blank"], ["id", "Berechtigtes-Interesse"], [2, "color", "green"], ["id", "GB-Inhalt"], [1, "grid"], [1, "GB-Abschnitt"], ["id", "FAQ"], [1, "Fragen"], ["frage", "Welche Kosten entstehen?"], [1, "Antwortpanel"], ["href", "https://www.gesetze-im-internet.de/gnotkg/anlage_1.html", "target", "_blank"], ["frage", "Wie bezahle ich?"], ["frage", "Wie bekomme ich einen Grundbuchausdruck am schnellsten?"], ["frage", "Brauche ich einen beglaubigten Grundbuchausdruck?"], ["frage", "In welcher Form kann ich einen Grundbuchausdruck erhalten?"], ["frage", "Wie lange dauert es, bis ich einen Grundbuchausdruck erhalte?"]], template: function HomeComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-header", 0);
    \u0275\u0275elementStart(1, "section", 1)(2, "div", 2)(3, "div", 3)(4, "h1");
    \u0275\u0275text(5, " Musterantrag");
    \u0275\u0275element(6, "br");
    \u0275\u0275text(7, "auf Erteilung eines");
    \u0275\u0275element(8, "br");
    \u0275\u0275text(9, "Grundbuchausdrucks ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "div", 4)(11, "b", 5);
    \u0275\u0275text(12, " Keine");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "span");
    \u0275\u0275text(14, " versteckten Zusatzkosten");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "span", 6);
    \u0275\u0275text(16, " (nur\xA0Gerichtsgeb\xFChr)");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(17, "div")(18, "button", 7);
    \u0275\u0275listener("click", function HomeComponent_Template_button_click_18_listener() {
      return ctx.grundbuchausdruckBeantragen();
    });
    \u0275\u0275text(19, " Antrag ausf\xFCllen ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "button", 8);
    \u0275\u0275text(21, " Mehr Infos ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(22, "div", 9);
    \u0275\u0275element(23, "fa-icon", 10);
    \u0275\u0275elementStart(24, "span");
    \u0275\u0275text(25, ".pdf Datei");
    \u0275\u0275elementEnd();
    \u0275\u0275element(26, "fa-icon", 10);
    \u0275\u0275elementStart(27, "span");
    \u0275\u0275text(28, "download");
    \u0275\u0275elementEnd();
    \u0275\u0275element(29, "fa-icon", 10);
    \u0275\u0275elementStart(30, "span");
    \u0275\u0275text(31, "direkt drucken");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(32, "div", 11);
    \u0275\u0275element(33, "fa-icon", 12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(34, "div", 13)(35, "span");
    \u0275\u0275text(36, "Ein einfacher Grundbuchausdruck kostet ");
    \u0275\u0275elementStart(37, "b");
    \u0275\u0275text(38, "genau");
    \u0275\u0275elementEnd();
    \u0275\u0275text(39, " 10\xA0\u20AC Gerichtsgeb\xFChren. Internetanbieter verlangen oft \xFCber 25\xA0\u20AC und verstecken die ");
    \u0275\u0275elementStart(40, "b", 14);
    \u0275\u0275text(41, "zus\xE4tzlichen");
    \u0275\u0275elementEnd();
    \u0275\u0275text(42, " 10\xA0\u20AC Gerichtsgeb\xFChren im Kleingedruckten. ");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(43, "section", 15)(44, "div", 2)(45, "h2");
    \u0275\u0275text(46, "Wie beantrage ich einen Grundbuchausdruck?");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(47, "div", 16);
    \u0275\u0275text(48, " Ein Grundbuchausdruck kann ");
    \u0275\u0275elementStart(49, "b", 17);
    \u0275\u0275text(50, "ausschlie\xDFlich");
    \u0275\u0275elementEnd();
    \u0275\u0275text(51, " beantragt werden... ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(52, "div", 18)(53, "div", 19)(54, "div", 20);
    \u0275\u0275element(55, "fa-icon", 12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(56, "div", 21);
    \u0275\u0275text(57, "per\xA0Post");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(58, "div", 19)(59, "div", 20);
    \u0275\u0275element(60, "fa-icon", 12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(61, "div", 21);
    \u0275\u0275text(62, "per\xA0Fax");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(63, "div", 19)(64, "div", 20);
    \u0275\u0275element(65, "fa-icon", 12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(66, "div", 21);
    \u0275\u0275text(67, "pers\xF6nlich");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(68, "div", 22);
    \u0275\u0275text(69, " Nutzen Sie diesen kostenlosen Musterantrag ");
    \u0275\u0275elementStart(70, "button", 23);
    \u0275\u0275listener("click", function HomeComponent_Template_button_click_70_listener() {
      return ctx.grundbuchausdruckBeantragen();
    });
    \u0275\u0275text(71, "Antrag ausf\xFCllen");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(72, "span", 16);
    \u0275\u0275text(73, "Ein Grundbuchausdruck kann ");
    \u0275\u0275elementStart(74, "b", 17);
    \u0275\u0275text(75, "NICHT");
    \u0275\u0275elementEnd();
    \u0275\u0275text(76, " beantragt werden...");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(77, "div", 18)(78, "div", 24)(79, "div", 20);
    \u0275\u0275element(80, "fa-icon", 12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(81, "div", 21);
    \u0275\u0275text(82, "per\xA0Telefon");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(83, "div", 24)(84, "div", 20);
    \u0275\u0275element(85, "fa-icon", 12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(86, "div", 21);
    \u0275\u0275text(87, "per\xA0E-Mail");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(88, "div", 24)(89, "div", 20);
    \u0275\u0275element(90, "fa-icon", 12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(91, "div", 21);
    \u0275\u0275text(92, "online");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(93, "span", 25);
    \u0275\u0275text(94, "Lassen Sie sich nicht von teuren Internetanbietern abzocken, welche f\xFCr viel Geld nur den Antrag f\xFCr Sie einreichen.");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(95, "section", 26)(96, "div", 2)(97, "h2");
    \u0275\u0275text(98, "Wo beantrage ich einen Grundbuchausdruck?");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(99, "div", 27)(100, "div", 28)(101, "div", 29);
    \u0275\u0275element(102, "fa-icon", 12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(103, "div", 30)(104, "span")(105, "b");
    \u0275\u0275text(106, "Sachlich");
    \u0275\u0275elementEnd();
    \u0275\u0275text(107, " zust\xE4ndig ist das Amtsgericht (als\xA0Grundbuchamt).");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(108, "div", 28)(109, "div", 29);
    \u0275\u0275element(110, "fa-icon", 12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(111, "div", 30)(112, "span")(113, "b");
    \u0275\u0275text(114, "\xD6rtlich");
    \u0275\u0275elementEnd();
    \u0275\u0275text(115, " zust\xE4ndig ist das Amtsgericht in dessen Bezirk das Grundst\xFCck liegt. ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(116, "span");
    \u0275\u0275text(117, " Pr\xFCfen, in welchem Amtsgerichtsbezirk das Grundst\xFCck liegt, k\xF6nnen Sie ");
    \u0275\u0275elementStart(118, "a", 31);
    \u0275\u0275text(119, "hier");
    \u0275\u0275elementEnd();
    \u0275\u0275text(120, ". ");
    \u0275\u0275elementEnd()()()()()();
    \u0275\u0275elementStart(121, "section", 32)(122, "div", 2)(123, "h2");
    \u0275\u0275text(124, "Wer darf einen Grundbuchausdruck beantragen?");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(125, "p");
    \u0275\u0275text(126, "Jeder der ein ");
    \u0275\u0275elementStart(127, "b");
    \u0275\u0275text(128, '"berechtigtes Interesse"');
    \u0275\u0275elementEnd();
    \u0275\u0275text(129, " hat, darf Einsicht in das Grundbuch nehmen.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(130, "table")(131, "thead")(132, "tr")(133, "th", 33);
    \u0275\u0275text(134, "Berechtigt");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(135, "th", 14);
    \u0275\u0275text(136, "Nicht berechtigt");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(137, "tbody")(138, "tr")(139, "td");
    \u0275\u0275text(140, "Eigent\xFCmer");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(141, "td");
    \u0275\u0275text(142, " Kaufinteressent ");
    \u0275\u0275elementStart(143, "b", 5);
    \u0275\u0275text(144, "ohne");
    \u0275\u0275elementEnd();
    \u0275\u0275text(145, " Nachweis der Vertrags\xADverhandlungen oder Vollmacht ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(146, "tr")(147, "td");
    \u0275\u0275text(148, "Bevollm\xE4chtigter");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(149, "td");
    \u0275\u0275text(150, "Neugieriger Nachbar");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(151, "tr")(152, "td");
    \u0275\u0275text(153, " Dinglicher Berechtigter (z.B. Wegerecht, Wohungsrecht, Nie\xDFbrauch) ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(154, "td");
    \u0275\u0275text(155, " M\xF6glicher Erbe ");
    \u0275\u0275elementStart(156, "b", 5);
    \u0275\u0275text(157, "vor");
    \u0275\u0275elementEnd();
    \u0275\u0275text(158, " dem Erbfall ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(159, "tr")(160, "td");
    \u0275\u0275text(161, "Gl\xE4ubiger mit Vollstreckungstitel");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(162, "td");
    \u0275\u0275text(163, "Makler ");
    \u0275\u0275elementStart(164, "b", 5);
    \u0275\u0275text(165, "ohne");
    \u0275\u0275elementEnd();
    \u0275\u0275text(166, " Vollmacht");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(167, "tr")(168, "td");
    \u0275\u0275text(169, "Inl\xE4ndische \xF6ffentliche Beh\xF6rden");
    \u0275\u0275elementEnd();
    \u0275\u0275element(170, "td");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(171, "tr")(172, "td");
    \u0275\u0275text(173, "\xD6ffentlich bestellte Vermessungs\xADingenieure");
    \u0275\u0275elementEnd();
    \u0275\u0275element(174, "td");
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275elementStart(175, "section", 34)(176, "div", 2)(177, "h2");
    \u0275\u0275text(178, "Was steht im Grundbuch?");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(179, "p", 16);
    \u0275\u0275text(180, "F\xFCr jede Gemarkung (Ort) gibt es f\xFCr jedes Eigentumsverh\xE4ltnis ein Grundbuch");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(181, "div", 35)(182, "div", 36)(183, "h3");
    \u0275\u0275text(184, "Aufschrift");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(185, "ul")(186, "li");
    \u0275\u0275text(187, "Gemarkung (Ort)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(188, "li");
    \u0275\u0275text(189, "Blattnummer");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(190, "li");
    \u0275\u0275text(191, "Amtsgericht");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(192, "div", 36)(193, "h3");
    \u0275\u0275text(194, "Bestandsverzeichnis");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(195, "span");
    \u0275\u0275text(196, "Auflistung der Grundst\xFCcke");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(197, "ul")(198, "li");
    \u0275\u0275text(199, "Flur und Flurst\xFCck");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(200, "li");
    \u0275\u0275text(201, "Nutzungsart");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(202, "li");
    \u0275\u0275text(203, "Lagebezeichnung");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(204, "li");
    \u0275\u0275text(205, "Gr\xF6\xDFe");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(206, "div", 36)(207, "h3");
    \u0275\u0275text(208, "Abteilung 1");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(209, "span");
    \u0275\u0275text(210, "Eigent\xFCmer");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(211, "ul")(212, "li");
    \u0275\u0275text(213, "Vor- und Nachname");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(214, "li");
    \u0275\u0275text(215, "Geburtsdatum");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(216, "li");
    \u0275\u0275text(217, "Grundlage der Eintragung");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(218, "div", 36)(219, "h3");
    \u0275\u0275text(220, "Abteilung 2");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(221, "span");
    \u0275\u0275text(222, "Lasten und Beschr\xE4nkungen");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(223, "ul")(224, "li")(225, "b");
    \u0275\u0275text(226, "Beispiele:");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(227, "li");
    \u0275\u0275text(228, "Wegerechte");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(229, "li");
    \u0275\u0275text(230, "Wohnungsrechte");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(231, "li");
    \u0275\u0275text(232, "Vorkaufsrecht");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(233, "li");
    \u0275\u0275text(234, "Reallasten");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(235, "li");
    \u0275\u0275text(236, "Nie\xDFbrauch");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(237, "li");
    \u0275\u0275text(238, "Eigentums\xFCbertragungs\xADvormerkungen");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(239, "li");
    \u0275\u0275text(240, "R\xFCckauflassungsvormerkungen");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(241, "li");
    \u0275\u0275text(242, "Zwangsversteigerungsvermerk");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(243, "li");
    \u0275\u0275text(244, "Insolvenzvermerk");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(245, "li");
    \u0275\u0275text(246, "Leitungsrechte");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(247, "li");
    \u0275\u0275text(248, "Holzrechte");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(249, "li");
    \u0275\u0275text(250, "Nacherbenvermerk");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(251, "div", 36)(252, "h3");
    \u0275\u0275text(253, "Abteilung 3");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(254, "span");
    \u0275\u0275text(255, "Grundschulden, Hypotheken und Rentenschulden");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(256, "ul")(257, "li");
    \u0275\u0275text(258, "Gl\xE4ubiger (z.B. Banken)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(259, "li");
    \u0275\u0275text(260, "Geldbetrag");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(261, "h2");
    \u0275\u0275text(262, "NICHT im Grundbuch zu finden sind...");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(263, "table")(264, "thead")(265, "tr")(266, "th");
    \u0275\u0275text(267, "Dokument");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(268, "th");
    \u0275\u0275text(269, "zust\xE4ndiges Amt");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(270, "tbody")(271, "tr")(272, "td");
    \u0275\u0275text(273, "Baulastenverzeichnis");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(274, "td");
    \u0275\u0275text(275, "Bauamt");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(276, "tr")(277, "td");
    \u0275\u0275text(278, "Baujahr");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(279, "td");
    \u0275\u0275text(280, "Bauamt");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(281, "tr")(282, "td");
    \u0275\u0275text(283, "Flurkarte/");
    \u0275\u0275element(284, "wbr");
    \u0275\u0275text(285, "Liegenschaftskarte");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(286, "td");
    \u0275\u0275text(287, "Amt f\xFCr Bodenmanagement");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(288, "tr")(289, "td");
    \u0275\u0275text(290, "Teilungserkl\xE4rung");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(291, "td");
    \u0275\u0275text(292, "Grundbuchamt (Amtsgericht)");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(293, "tr")(294, "td");
    \u0275\u0275text(295, "Aufteilungsplan");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(296, "td");
    \u0275\u0275text(297, "Grundbuchamt (Amtsgericht)");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(298, "tr")(299, "td")(300, "span");
    \u0275\u0275text(301, "Abgeschlossenheits\xADbescheinigung");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(302, "td");
    \u0275\u0275text(303, "Grundbuchamt (Amtsgericht)");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(304, "tr")(305, "td");
    \u0275\u0275text(306, "Urkunden (z.B. Kaufvertr\xE4ge)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(307, "td");
    \u0275\u0275text(308, "Grundbuchamt (Amtsgericht)");
    \u0275\u0275elementEnd()()()()()();
    \u0275\u0275elementStart(309, "section", 37)(310, "div", 2)(311, "h2");
    \u0275\u0275text(312, "Fragen und Antworten");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(313, "div", 38)(314, "app-accordion", 39)(315, "div", 40)(316, "p");
    \u0275\u0275text(317, " Ein einfacher Grundbuchausdruck kostet je Ausdruck 10 \u20AC.");
    \u0275\u0275element(318, "br");
    \u0275\u0275text(319, " Ein beglaubigter Grundbuchausdruck kostet je Ausdruck 20 \u20AC. ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(320, "p");
    \u0275\u0275text(321, " Mehrfache Ausdrucke des gleichen Grundbuchs verursachen erneut die Geb\xFChr. ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(322, "p");
    \u0275\u0275text(323, "Die pers\xF6nliche Einsicht beim Grundbuchamt ist geb\xFChrenfrei.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(324, "p");
    \u0275\u0275text(325, " Die Geb\xFChren richteten sich nach dem GNotKG. Sie k\xF6nnen den ");
    \u0275\u0275elementStart(326, "a", 41);
    \u0275\u0275text(327, " Gesetzestext");
    \u0275\u0275elementEnd();
    \u0275\u0275text(328, " nachlesen. (ab der KV. Nr. 17000) ");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(329, "app-accordion", 42)(330, "p");
    \u0275\u0275text(331, " Wenn Sie einen schriftlichen Antrag gestellt haben, erhalten Sie eine Rechnung. In vielen Bundesl\xE4ndern k\xF6nnen Sie die Rechnung mit g\xE4ngigen Zahlungsm\xF6glichkeiten online bezahlen. Genaueres dazu finden Sie auf der Kostenrechnung. ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(332, "p");
    \u0275\u0275text(333, " Sie wollen unbedingt bar bezahlen? Dann beantragen Sie den Grundbuchausdruck am besten pers\xF6nlich bei Gericht. Wenn Sie eine bereits erhaltene Kostenrechnung bar bezahlen m\xF6chten, k\xF6nnen Sie dies an einem Kassenautomaten beim Amtsgericht oder bei dessen Gerichtszahlstelle erledigen. ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(334, "app-accordion", 43)(335, "p");
    \u0275\u0275text(336, " Am schnellsten erhalten Sie einen Grundbuchausdruck bei pers\xF6nlichem Erscheinen beim Grundbuchamt (Amtsgericht). ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(337, "app-accordion", 44)(338, "p");
    \u0275\u0275text(339, " Das muss derjenige entscheiden, der den Ausdruck erh\xE4lt. Normalerweise reicht ein einfacher Ausdruck. Sparen Sie sich das Geld f\xFCr den beglaubigten Ausdruck, wenn dieser nicht explizit verlangt wird. ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(340, "app-accordion", 45)(341, "p");
    \u0275\u0275text(342, " Grundbuchausdrucke erhalten Sie in Papierform. Per E-Mail ist der Versand nicht zul\xE4ssig. ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(343, "app-accordion", 46)(344, "p");
    \u0275\u0275text(345, " Nach Eingang Ihres schriftlichen Antrags bei Gericht, wird Ihr Antrag bereits sp\xE4testens in den n\xE4chsten Tagen bearbeitet. Hinzu kommt der Postweg. ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(346, "p");
    \u0275\u0275text(347, " Je nach Auslastung des Grundbuchamts, kann es auch l\xE4nger dauern. Sofort erhalten Sie den Grundbuchausdruck, wenn Sie ihn pers\xF6nlich beantragen. ");
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275element(348, "app-footer");
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(14, _c09, ctx.dl.darkmode.value));
    \u0275\u0275advance(22);
    \u0275\u0275property("icon", ctx.faFilePdf);
    \u0275\u0275advance(3);
    \u0275\u0275property("icon", ctx.faDownload);
    \u0275\u0275advance(3);
    \u0275\u0275property("icon", ctx.faPrint);
    \u0275\u0275advance(4);
    \u0275\u0275property("icon", ctx.faHome);
    \u0275\u0275advance(10);
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(16, _c09, ctx.dl.darkmode.value));
    \u0275\u0275advance(12);
    \u0275\u0275property("icon", ctx.faEnvelope);
    \u0275\u0275advance(5);
    \u0275\u0275property("icon", ctx.faFax);
    \u0275\u0275advance(5);
    \u0275\u0275property("icon", ctx.faUser);
    \u0275\u0275advance(15);
    \u0275\u0275property("icon", ctx.faPhone);
    \u0275\u0275advance(5);
    \u0275\u0275property("icon", ctx.faAt);
    \u0275\u0275advance(5);
    \u0275\u0275property("icon", ctx.faGlobe);
    \u0275\u0275advance(12);
    \u0275\u0275property("icon", ctx.faUniversity);
    \u0275\u0275advance(8);
    \u0275\u0275property("icon", ctx.faMapMarkedAlt);
  }
}, dependencies: [NgClass, FaIconComponent, HeaderComponent, AccordionComponent, FooterComponent], styles: ['@charset "UTF-8";\n\n\n\nhr[_ngcontent-%COMP%] {\n  width: clamp(1em, 65%, 60em);\n  margin: 1em 0;\n}\nh2[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: clamp(0.5rem, 7vw, 2rem);\n  text-align: center;\n}\n#home[_ngcontent-%COMP%]   .sectiondiv[_ngcontent-%COMP%] {\n  display: grid;\n  justify-content: space-evenly;\n  grid-template-columns: 60% 40%;\n}\nsection[_ngcontent-%COMP%]:nth-of-type(2n-1) {\n  background-color: var(--hintergrund-variant);\n}\n.imgdiv[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  font-size: clamp(5em, 15vw, 10em);\n  color: var(--primary-variant-brighter);\n}\n.darkmode[_ngcontent-%COMP%]   .imgdiv[_ngcontent-%COMP%] {\n  color: var(--schrift);\n}\n.homebanner[_ngcontent-%COMP%] {\n  box-sizing: border-box;\n  text-align: left;\n  display: flex;\n  justify-content: flex-start;\n  flex-flow: column;\n}\n.titeluntertext[_ngcontent-%COMP%] {\n  margin: 2% 0;\n  font-size: clamp(12px, 1.5vw, 1rem);\n}\n.divTitel[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 0.8em;\n}\nh1[_ngcontent-%COMP%] {\n  margin: 5px 0;\n  font-size: clamp(1.2rem, 3vw, 2rem);\n  line-height: 100%;\n  text-align: unset;\n  color: var(--schrift);\n}\n.homebanner[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  margin-bottom: 2%;\n}\n.labels[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  font-size: clamp(12px, 1vw, 0.8rem);\n  width: 100%;\n  margin: 8px;\n}\n.labels[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  margin: 0 1em;\n}\n.labels[_ngcontent-%COMP%]   .icon[_ngcontent-%COMP%] {\n  font-size: clamp(1rem, 1vw, 1.5rem);\n  color: var(--schrift);\n}\n.infobanner[_ngcontent-%COMP%] {\n  border-left: 10px solid #b60e0e;\n  background-color: #f2dede;\n  padding: 15px;\n  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);\n  color: #a94442;\n  margin-top: 10px;\n  border-radius: 5px;\n  grid-column-start: 1;\n  grid-column-end: 3;\n}\n.darkmode[_ngcontent-%COMP%]   .infobanner[_ngcontent-%COMP%] {\n  background-color: rgb(24, 24, 24);\n  color: var(--schrift);\n}\n@media only screen and (max-width: 700px) {\n  #home[_ngcontent-%COMP%]   .sectiondiv[_ngcontent-%COMP%] {\n    grid-template-columns: 70% 30%;\n  }\n}\n#info[_ngcontent-%COMP%]   .Erkl\\e4rung[_ngcontent-%COMP%] {\n  margin-top: 1em;\n  font-size: clamp(1rem, 1.5vw, 1.5rem);\n}\n.antragsartdiv[_ngcontent-%COMP%] {\n  display: flex;\n  margin-top: 0.5em;\n  width: 85%;\n  transform: scale(0);\n  animation: _ngcontent-%COMP%_grow 1s forwards;\n}\n@keyframes _ngcontent-%COMP%_grow {\n  100% {\n    transform: scale(1);\n  }\n}\n.icondiv[_ngcontent-%COMP%] {\n  font-size: clamp(0.8rem, 3vw, 2rem);\n  padding: clamp(0.8rem, 5vw, 1.2rem);\n  border-radius: 10px;\n  background-color: var(--primary-variant-much-brighter);\n  display: flex;\n  text-align: center;\n  justify-content: center;\n}\n.antragsarttext[_ngcontent-%COMP%] {\n  text-align: center;\n  font-size: clamp(0.8rem, 1vw, 1.2rem);\n  margin-top: 0.5em;\n}\n.antragsart[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  flex: 1;\n}\n.antragsartfalsch[_ngcontent-%COMP%]   .icondiv[_ngcontent-%COMP%] {\n  background-color: rgb(255, 118, 118);\n}\n#info[_ngcontent-%COMP%]   .sectiondiv[_ngcontent-%COMP%]   .BannerMusterantrag[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  margin: 1em;\n}\n.Zust\\e4ndigkeiten[_ngcontent-%COMP%] {\n  margin-top: 1em;\n  display: flex;\n  flex-direction: row;\n  align-items: flex-start;\n  justify-content: space-around;\n  flex-wrap: wrap;\n}\n.Zust\\e4ndigkeit[_ngcontent-%COMP%] {\n  margin: 0.5em;\n  font-size: clamp(1rem, 1.2vw, 1.2rem);\n  border-radius: 15px;\n  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);\n  max-width: 25rem;\n}\n.Erkl\\e4rungZust\\e4ndigkeit[_ngcontent-%COMP%] {\n  border: 0.15rem solid var(--primary-variant-darker);\n  border-top: 0;\n  border-radius: 0 0 8px 8px;\n  padding: 0.5em;\n  font-size: 0.9em;\n}\n.icondivz[_ngcontent-%COMP%] {\n  padding: 0.5em;\n  font-size: 2em;\n  background-color: var(--primary-variant-much-brighter);\n  border: 0.15rem solid var(--primary-variant-darker);\n  border-bottom: 0;\n  border-radius: 8px 8px 0 0;\n  display: flex;\n  text-align: center;\n  justify-content: center;\n}\n#GB-Inhalt[_ngcontent-%COMP%]   .sectiondiv[_ngcontent-%COMP%]   .grid[_ngcontent-%COMP%] {\n  width: 100%;\n  display: grid;\n  grid-template-columns: repeat(auto-fit, 20em);\n  justify-content: center;\n  gap: 0.5em;\n  max-width: 61em;\n  margin-bottom: 1.5em;\n}\n.GB-Abschnitt[_ngcontent-%COMP%] {\n  border-radius: 0.4em;\n  display: flex;\n  flex-direction: column;\n  padding: 0.3em;\n  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);\n  background-color: var(--hintergrund-variant-darker);\n  border: 2px solid var(--primary-color);\n}\n.GB-Abschnitt[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  margin: 0;\n  text-align: center;\n  font-weight: 700;\n  color: var(--primary-variant-darker);\n}\n.GB-Abschnitt[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  margin: 0.5em 0;\n  text-align: center;\n}\n.GB-Abschnitt[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%] {\n  margin: 0.3em 0;\n  padding: 0;\n}\n.Fragen[_ngcontent-%COMP%] {\n  margin-top: 1em;\n  display: flex;\n  flex-direction: column;\n  font-size: clamp(0.8rem, 1.2vw, 1rem);\n}\napp-accordion[_ngcontent-%COMP%] {\n  margin-top: 0.8em;\n}\n/*# sourceMappingURL=home.component.css.map */'] });
var HomeComponent = _HomeComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(HomeComponent, { className: "HomeComponent", filePath: "src/app/routes/home/home.component.ts", lineNumber: 30 });
})();

// src/app/routes/impressum/impressum.component.ts
var _ImpressumComponent = class _ImpressumComponent {
  constructor(titleService) {
    this.titleService = titleService;
    this.titleService.setTitle("Impressum");
  }
};
_ImpressumComponent.\u0275fac = function ImpressumComponent_Factory(t) {
  return new (t || _ImpressumComponent)(\u0275\u0275directiveInject(Title));
};
_ImpressumComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ImpressumComponent, selectors: [["app-impressum"]], decls: 19, vars: 0, consts: [[1, "sectiondiv"], ["href", "mailto:MailvonRico@gmail.com"], ["href", "https://www.ricoswebsite.com/"]], template: function ImpressumComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-header");
    \u0275\u0275elementStart(1, "section")(2, "div", 0)(3, "h1");
    \u0275\u0275text(4, "Impressum");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span");
    \u0275\u0275text(6, "Rico Angenvoort");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "span");
    \u0275\u0275text(8, "Pommernstra\xDFe 48");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "span");
    \u0275\u0275text(10, "34497 Korbach");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "a", 1);
    \u0275\u0275text(12, "MailvonRico@gmail.com");
    \u0275\u0275elementEnd();
    \u0275\u0275element(13, "br");
    \u0275\u0275elementStart(14, "a", 2);
    \u0275\u0275text(15, "www.ricoswebsite.com");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "p");
    \u0275\u0275text(17, "Dies ist eine private Webseite, welche keine staatliche Beh\xF6rde repr\xE4sentiert.");
    \u0275\u0275elementEnd()()();
    \u0275\u0275element(18, "app-footer");
  }
}, dependencies: [HeaderComponent, FooterComponent], styles: ["\n\n[_nghost-%COMP%] {\n  min-height: 100vh;\n  display: flex;\n  flex-direction: column;\n}\n.sectiondiv[_ngcontent-%COMP%] {\n  max-width: 24em;\n  padding-top: 0;\n}\nsection[_ngcontent-%COMP%] {\n  display: flex;\n  flex-flow: column;\n}\n/*# sourceMappingURL=impressum.component.css.map */"] });
var ImpressumComponent = _ImpressumComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ImpressumComponent, { className: "ImpressumComponent", filePath: "src/app/routes/impressum/impressum.component.ts", lineNumber: 9 });
})();

// src/app/routes/dashboard/dashboard.component.ts
function DashboardComponent_For_36_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 11);
    \u0275\u0275element(1, "fa-icon", 2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const file_r2 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275propertyInterpolate1("href", "/api/uploads/getFile?name=", file_r2.name, ".docx", \u0275\u0275sanitizeUrl);
    \u0275\u0275advance();
    \u0275\u0275property("icon", ctx_r2.faCircleDown);
  }
}
function DashboardComponent_For_36_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "fa-icon", 12);
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275property("icon", ctx_r2.faCircleExclamation);
  }
}
function DashboardComponent_For_36_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 13);
    \u0275\u0275element(1, "fa-icon", 2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const file_r2 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275propertyInterpolate1("href", "/api/uploads/getFile?name=", file_r2.name, ".pdf", \u0275\u0275sanitizeUrl);
    \u0275\u0275advance();
    \u0275\u0275property("icon", ctx_r2.faArrowUpRightFromSquare);
  }
}
function DashboardComponent_For_36_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "fa-icon", 12);
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275property("icon", ctx_r2.faCircleExclamation);
  }
}
function DashboardComponent_For_36_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr")(1, "td");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td");
    \u0275\u0275template(6, DashboardComponent_For_36_Conditional_6_Template, 2, 3, "a", 11)(7, DashboardComponent_For_36_Conditional_7_Template, 1, 1, "fa-icon", 12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "td");
    \u0275\u0275template(9, DashboardComponent_For_36_Conditional_9_Template, 2, 3, "a", 13)(10, DashboardComponent_For_36_Conditional_10_Template, 1, 1, "fa-icon", 12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "td", 14);
    \u0275\u0275listener("click", function DashboardComponent_For_36_Template_td_click_11_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.click($event.target));
    });
    \u0275\u0275element(12, "fa-icon", 12);
    \u0275\u0275elementStart(13, "ul", 15)(14, "li", 16);
    \u0275\u0275listener("click", function DashboardComponent_For_36_Template_li_click_14_listener() {
      const file_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.deleteFile(file_r2.name));
    });
    \u0275\u0275text(15, "l\xF6schen");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const file_r2 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(file_r2.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(file_r2.uploadDate);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(file_r2.docxFile != "" ? 6 : 7);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(file_r2.pdfFile != "" ? 9 : 10);
    \u0275\u0275advance(3);
    \u0275\u0275property("icon", ctx_r2.faEllipsisVertical);
  }
}
var _DashboardComponent = class _DashboardComponent {
  constructor(http, elem, cs, router, titleService) {
    this.http = http;
    this.elem = elem;
    this.cs = cs;
    this.router = router;
    this.titleService = titleService;
    this.faRotateRight = faRotateRight;
    this.faCircleExclamation = faCircleExclamation;
    this.faCircleDown = faCircleDown;
    this.faArrowUpRightFromSquare = faArrowUpRightFromSquare;
    this.faEllipsisVertical = faEllipsisVertical;
    this.faArrowRightFromBracket = faArrowRightFromBracket;
    this.faTrashCan = faTrashCan;
    this.page = 1;
    this.isLoading = false;
    this.titleService.setTitle("Dashboard");
  }
  ngOnInit() {
    this.getFiles();
  }
  scroll(element) {
    if (element.scrollTop > element.scrollHeight - element.clientHeight - 150) {
      this.getFiles();
    }
  }
  getFiles() {
    return __async(this, null, function* () {
      return new Promise((resolve, reject) => __async(this, null, function* () {
        try {
          if (this.isLoading)
            return;
          this.isLoading = true;
          console.log("Lade Daten...");
          if (this.infoJson && this.page > this.infoJson["totalPages"])
            return;
          if (!this.files)
            this.files = [];
          const url = "/api/uploads";
          const json = yield lastValueFrom(this.http.get(url, { params: new HttpParams().set("page", this.page) }));
          this.infoJson = json;
          for (const file of json["files"]) {
            this.files.push(file);
          }
          if (this.infoJson["totalPages"] != 0)
            this.page++;
          this.isLoading = false;
        } catch (err) {
          this.isLoading = false;
          console.error("Die Dateien konnten nicht geladen werden." + err.error, err);
          reject();
        }
      }));
    });
  }
  neuLaden() {
    this.isLoading = false;
    this.page = 0;
    this.files = [];
    this.getFiles();
  }
  onDocumentClick(event) {
    const dropDowns = this.elem.nativeElement.querySelectorAll(".dropDown");
    for (const dropdown of dropDowns) {
      const ul = dropdown.querySelector("ul");
      if (ul.style.visibility === "visible") {
        if (!dropdown.contains(event.target)) {
          ul.style.visibility = "collapse";
        }
      }
    }
  }
  click(element) {
    const dropdown = element.closest(".dropDown");
    const ulElement = dropdown.querySelector(".dropDownMenu");
    if (ulElement)
      ulElement.style.visibility = "visible";
  }
  deleteFile(name) {
    return __async(this, null, function* () {
      yield lastValueFrom(this.http.delete("/api/uploads/deleteFile", { params: new HttpParams().set("name", name) }));
      this.neuLaden();
    });
  }
  deleteFolder() {
    return __async(this, null, function* () {
      try {
        yield lastValueFrom(this.http.delete("/api/uploads/", { responseType: "text" }));
        this.neuLaden();
      } catch (error) {
        console.error("Error beim L\xF6schen des Ordners:", error);
      }
    });
  }
  deleteLogFile() {
    return __async(this, null, function* () {
      try {
        yield lastValueFrom(this.http.delete("/api/deleteLogFile/", { responseType: "text" }));
        alert("Logfile gel\xF6scht");
      } catch (error) {
        console.error("Error beim L\xF6schen des Ordners:", error);
      }
    });
  }
  abmelden() {
    this.cs.deleteCookie("loginToken");
    this.router.navigate(["/"]);
  }
};
_DashboardComponent.\u0275fac = function DashboardComponent_Factory(t) {
  return new (t || _DashboardComponent)(\u0275\u0275directiveInject(HttpClient), \u0275\u0275directiveInject(ElementRef), \u0275\u0275directiveInject(CookiesService), \u0275\u0275directiveInject(Router), \u0275\u0275directiveInject(Title));
};
_DashboardComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _DashboardComponent, selectors: [["app-dashboard"]], hostBindings: function DashboardComponent_HostBindings(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275listener("click", function DashboardComponent_click_HostBindingHandler($event) {
      return ctx.onDocumentClick($event);
    }, false, \u0275\u0275resolveDocument);
  }
}, decls: 37, vars: 4, consts: [["farbe", "transparent"], [1, "logoutBtn", "btnicon", 3, "click"], [3, "icon"], [1, "sectiondiv"], ["target", "_blank", "href", "/api/getlogfile"], [1, "btnicon", 3, "click"], [1, "tableHeader"], [1, "reloadBtn"], [3, "click", "icon"], [1, "btntext", 3, "click"], [1, "tableScrollContainer", 3, "scroll"], [1, "btnicon", 3, "href"], [1, "btnicon", 3, "icon"], ["target", "_blank", 1, "btnicon", 3, "href"], [1, "dropDown", 3, "click"], [1, "dropDownMenu"], [3, "click"]], template: function DashboardComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-header", 0);
    \u0275\u0275elementStart(1, "section")(2, "button", 1);
    \u0275\u0275listener("click", function DashboardComponent_Template_button_click_2_listener() {
      return ctx.abmelden();
    });
    \u0275\u0275element(3, "fa-icon", 2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 3)(5, "h1");
    \u0275\u0275text(6, "Dashboard");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "div")(8, "a", 4);
    \u0275\u0275text(9, "\xF6ffne Server Logfile");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "button", 5);
    \u0275\u0275listener("click", function DashboardComponent_Template_button_click_10_listener() {
      return ctx.deleteLogFile();
    });
    \u0275\u0275element(11, "fa-icon", 2);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "div", 6)(13, "h2");
    \u0275\u0275text(14, "Generierte Antr\xE4ge");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "span");
    \u0275\u0275text(16);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "button", 7)(18, "fa-icon", 8);
    \u0275\u0275listener("click", function DashboardComponent_Template_fa_icon_click_18_listener() {
      return ctx.neuLaden();
    });
    \u0275\u0275text(19, "Neuladen");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(20, "button", 9);
    \u0275\u0275listener("click", function DashboardComponent_Template_button_click_20_listener() {
      return ctx.deleteFolder();
    });
    \u0275\u0275text(21, "alle l\xF6schen");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(22, "div", 10);
    \u0275\u0275listener("scroll", function DashboardComponent_Template_div_scroll_22_listener($event) {
      return ctx.scroll($event.target);
    });
    \u0275\u0275elementStart(23, "table")(24, "thead")(25, "th");
    \u0275\u0275text(26, "Dateiname");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "th");
    \u0275\u0275text(28, "Datum");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "th");
    \u0275\u0275text(30, "docx");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "th");
    \u0275\u0275text(32, "pdf");
    \u0275\u0275elementEnd();
    \u0275\u0275element(33, "th");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(34, "tbody");
    \u0275\u0275repeaterCreate(35, DashboardComponent_For_36_Template, 16, 5, "tr", null, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    \u0275\u0275advance(3);
    \u0275\u0275property("icon", ctx.faArrowRightFromBracket);
    \u0275\u0275advance(8);
    \u0275\u0275property("icon", ctx.faTrashCan);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("Dateien: ", ctx.infoJson && ctx.infoJson.totalFiles, " ");
    \u0275\u0275advance(2);
    \u0275\u0275property("icon", ctx.faRotateRight);
    \u0275\u0275advance(17);
    \u0275\u0275repeater(ctx.files);
  }
}, dependencies: [FaIconComponent, HeaderComponent], styles: ["\n\n[_nghost-%COMP%] {\n  min-height: 100vh;\n  display: flex;\n  flex-direction: column;\n  background-color: var(--hintergrund-variant);\n}\nsection[_ngcontent-%COMP%] {\n  margin-top: 4vh;\n  top: -40em;\n  position: relative;\n  animation: _ngcontent-%COMP%_slideInFromTop 500ms forwards;\n}\n@keyframes _ngcontent-%COMP%_slideInFromTop {\n  100% {\n    top: 0em;\n  }\n}\nh1[_ngcontent-%COMP%] {\n  font-size: clamp(1.5rem, 5vw, 2rem);\n  margin-top: 0;\n}\n.logoutBtn[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 4em;\n  right: 2em;\n}\n.tableHeader[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  background-color: var(--body);\n  border-radius: 8px 8px 0 0;\n  width: clamp(300px, 90vw, 1000px);\n}\n.tableHeader[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin: 0.5em;\n  font-size: 1em;\n}\n.tableHeader[_ngcontent-%COMP%]   .reloadBtn[_ngcontent-%COMP%] {\n  padding: 0;\n  margin: 0;\n  height: 25px;\n  width: 25px;\n  text-align: center;\n}\n.tableScrollContainer[_ngcontent-%COMP%] {\n  height: 500px;\n  width: clamp(300px, 90vw, 1000px);\n  overflow: auto;\n  position: relative;\n  resize: vertical;\n  background-color: var(--body);\n}\n.tableScrollContainer[_ngcontent-%COMP%]   table[_ngcontent-%COMP%] {\n  width: 100%;\n  font-size: clamp(12px, 1vw, 16px);\n}\n.tableScrollContainer[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] {\n  text-align: left;\n}\n.tableScrollContainer[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  padding: 8px;\n}\n.tableScrollContainer[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]:last-child {\n  padding: 0;\n}\n.tableScrollContainer[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:hover {\n  background-color: var(--hintergrund-variant);\n}\n.tableScrollContainer[_ngcontent-%COMP%]   thead[_ngcontent-%COMP%] {\n  position: sticky;\n  top: 0;\n  background-color: var(--hintergrund);\n  z-index: 1;\n}\n.tableScrollContainer[_ngcontent-%COMP%]   table[_ngcontent-%COMP%] {\n  margin-top: 0;\n}\n[_ngcontent-%COMP%]::-webkit-scrollbar {\n  width: 5px;\n}\n[_ngcontent-%COMP%]::-webkit-scrollbar-thumb {\n  background: var(--primary-variant-darker);\n}\n[_ngcontent-%COMP%]::-webkit-scrollbar-thumb:hover {\n  background: #555;\n}\n.dropDown[_ngcontent-%COMP%] {\n  position: relative;\n  cursor: pointer;\n}\n.dropDown[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%] {\n  visibility: collapse;\n  padding: 0;\n  position: absolute;\n  left: -40px;\n  top: 0;\n  background-color: var(--hintergrund);\n  border-radius: 6px;\n  border: 1px solid var(--primary-variant-much-brighter);\n}\n.dropDown[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  padding: 10px;\n}\n.dropDown[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]:hover {\n  background-color: var(--hintergrund-variant-darker);\n}\ndetails[_ngcontent-%COMP%]    > summary[_ngcontent-%COMP%] {\n  list-style: none;\n  cursor: pointer;\n  z-index: 2;\n}\ndetails[_ngcontent-%COMP%]    > summary[_ngcontent-%COMP%]::-webkit-details-marker {\n  display: none;\n}\n/*# sourceMappingURL=dashboard.component.css.map */"] });
var DashboardComponent = _DashboardComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(DashboardComponent, { className: "DashboardComponent", filePath: "src/app/routes/dashboard/dashboard.component.ts", lineNumber: 21 });
})();

// src/app/app-routing.module.ts
var routes = [
  { path: "", component: HomeComponent },
  { path: "grundbuchausdruck-beantragen", component: GrundbuchausdruckBeantragenComponent },
  { path: "impressum", component: ImpressumComponent },
  { path: "datenschutz", component: DatenschutzComponent },
  { path: "grundbuchrecht/einleitung", component: EinleitungComponent },
  { path: "grundbuchrecht/bestandsverzeichnis", component: BestandsverzeichnisComponent },
  { path: "grundbuchrecht/abteilung1", component: Abteilung1Component },
  { path: "grundbuchrecht/abteilung2", component: Abteilung2Component },
  { path: "grundbuchrecht/abteilung3", component: Abteilung3Component },
  { path: "dashboard", component: DashboardComponent, canActivate: [AuthGuard] },
  { path: "**", redirectTo: "", pathMatch: "full" }
];
var _AppRoutingModule = class _AppRoutingModule {
};
_AppRoutingModule.\u0275fac = function AppRoutingModule_Factory(t) {
  return new (t || _AppRoutingModule)();
};
_AppRoutingModule.\u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({ type: _AppRoutingModule });
_AppRoutingModule.\u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({ imports: [RouterModule.forRoot(routes, {
  scrollPositionRestoration: "enabled",
  anchorScrolling: "enabled",
  onSameUrlNavigation: "reload"
}), RouterModule] });
var AppRoutingModule = _AppRoutingModule;

// src/app/app.component.ts
var _AppComponent = class _AppComponent {
  constructor(titleService, dl) {
    this.titleService = titleService;
    this.dl = dl;
    this.title = "grundbuch";
    this.faFilePdf = faFilePdf;
    this.faPrint = faPrint;
    this.faDownload = faDownload;
    this.faHome = faHome;
    this.faEnvelope = faEnvelope;
    this.faFax = faFax;
    this.faUser = faUser;
    this.faPhone = faPhone;
    this.faAt = faAt;
    this.faGlobe = faGlobe;
    this.faUniversity = faUniversity;
    this.faMapMarkedAlt = faMapMarkedAlt;
    this.titleService.setTitle("Grundbuch-Musterantrag.de");
  }
};
_AppComponent.\u0275fac = function AppComponent_Factory(t) {
  return new (t || _AppComponent)(\u0275\u0275directiveInject(Title), \u0275\u0275directiveInject(DesignloaderService));
};
_AppComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AppComponent, selectors: [["app-root"]], decls: 1, vars: 0, template: function AppComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "router-outlet");
  }
}, dependencies: [RouterOutlet] });
var AppComponent = _AppComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AppComponent, { className: "AppComponent", filePath: "src/app/app.component.ts", lineNumber: 26 });
})();

// src/app/app.module.ts
var _AppModule = class _AppModule {
};
_AppModule.\u0275fac = function AppModule_Factory(t) {
  return new (t || _AppModule)();
};
_AppModule.\u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({ type: _AppModule, bootstrap: [AppComponent] });
_AppModule.\u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({ providers: [
  provideHttpClient(),
  provideClientHydration()
], imports: [
  BrowserModule,
  AppRoutingModule,
  FontAwesomeModule,
  FormsModule,
  ReactiveFormsModule
] });
var AppModule = _AppModule;

// src/app/app.module.server.ts
var _AppServerModule = class _AppServerModule {
};
_AppServerModule.\u0275fac = function AppServerModule_Factory(t) {
  return new (t || _AppServerModule)();
};
_AppServerModule.\u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({ type: _AppServerModule, bootstrap: [AppComponent] });
_AppServerModule.\u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({ imports: [
  AppModule,
  ServerModule
] });
var AppServerModule = _AppServerModule;

export {
  AppServerModule
};
/*! Bundled license information:

@angular/forms/fesm2022/forms.mjs:
  (**
   * @license Angular v18.0.6
   * (c) 2010-2024 Google LLC. https://angular.io/
   * License: MIT
   *)
*/
//# sourceMappingURL=chunk-EJJXY23T.mjs.map
