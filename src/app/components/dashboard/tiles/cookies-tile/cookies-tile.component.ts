import { Component, inject, OnInit } from '@angular/core';
import { DashboardTileComponent } from "../../dashboard-tile/dashboard-tile.component";
import { CookiesService } from 'src/app/services/cookies.service';
import { cookie } from 'src/app/models/cookie';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-cookies-tile',
  standalone: true,
  imports: [DashboardTileComponent, FontAwesomeModule],
  templateUrl: './cookies-tile.component.html',
  styleUrl: './cookies-tile.component.scss'
})
export class CookiesTileComponent implements OnInit {
  cs = inject(CookiesService);

  // Fontawesome Icons
  faTrashCan = faTrashCan;

  cookies: cookie[] = [];

  ngOnInit(): void {
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
