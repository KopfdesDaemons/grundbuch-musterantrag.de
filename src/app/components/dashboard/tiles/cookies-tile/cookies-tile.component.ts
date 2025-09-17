import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { DashboardTileComponent } from '../../dashboard-tile/dashboard-tile.component';
import { CookiesService } from 'src/app/services/utils/cookies.service';
import { Cookie } from 'src/app/models/cookie.model';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-cookies-tile',
  imports: [DashboardTileComponent],
  templateUrl: './cookies-tile.component.html',
  styleUrl: './cookies-tile.component.scss'
})
export class CookiesTileComponent implements OnInit {
  cs = inject(CookiesService);
  plattformId = inject(PLATFORM_ID);

  cookies: Cookie[] = [];

  ngOnInit(): void {
    if (!isPlatformBrowser(this.plattformId)) return;
    this.cookies = this.cs.getAllCookies();
  }

  deleteCookie(cookie: Cookie) {
    this.cs.deleteCookie(cookie.name);
    this.cookies = this.cs.getAllCookies();
  }

  deleteAllCookies() {
    this.cs.deleteAllCookies();
    this.cookies = this.cs.getAllCookies();
  }
}
