import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { DashboardTileComponent } from "../../dashboard-tile/dashboard-tile.component";
import { CookiesService } from 'src/app/services/utils/cookies.service';
import { cookie } from 'src/app/models/cookie';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-cookies-tile',
  imports: [DashboardTileComponent, FontAwesomeModule],
  templateUrl: './cookies-tile.component.html',
  styleUrl: './cookies-tile.component.scss'
})
export class CookiesTileComponent implements OnInit {
  cs = inject(CookiesService);
  plattformId = inject(PLATFORM_ID);

  // Fontawesome Icons
  faTrashCan = faTrashCan;

  cookies: cookie[] = [];

  ngOnInit(): void {
    if (!isPlatformBrowser(this.plattformId)) return;
    this.cookies = this.cs.getAllCookies();
  }

  deleteCookie(cookie: cookie) {
    this.cs.deleteCookie(cookie.name);
    this.cookies = this.cs.getAllCookies();
  }

  deleteAllCookies() {
    this.cs.deleteAllCookies();
    this.cookies = this.cs.getAllCookies();
  }
}
