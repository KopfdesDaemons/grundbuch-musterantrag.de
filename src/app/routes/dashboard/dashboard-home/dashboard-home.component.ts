import { Component } from '@angular/core';
import { HeaderComponent } from "../../../components/header/header.component";
import { FooterComponent } from "../../../components/footer/footer.component";
import { CookiesTileComponent } from "../../../components/dashboard/tiles/cookies-tile/cookies-tile.component";
import { LoggerTileComponent } from "../../../components/dashboard/tiles/logger-tile/logger-tile.component";
import { AntragslisteTileComponent } from 'src/app/components/dashboard/tiles/antragsliste-tile/antragsliste-tile.component';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, CookiesTileComponent, LoggerTileComponent, AntragslisteTileComponent],
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.scss'
})
export class DashboardHomeComponent {

}
