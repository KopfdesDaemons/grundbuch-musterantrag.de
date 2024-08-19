import { Component, inject } from '@angular/core';
import { DashboardTileComponent } from "../../dashboard-tile/dashboard-tile.component";
import { CookiesService } from 'src/app/services/cookies.service';

@Component({
  selector: 'app-cookies-tile',
  standalone: true,
  imports: [DashboardTileComponent],
  templateUrl: './cookies-tile.component.html',
  styleUrl: './cookies-tile.component.scss'
})
export class CookiesTileComponent {
  cs = inject(CookiesService);
}
