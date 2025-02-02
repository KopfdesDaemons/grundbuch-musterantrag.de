import { Component, inject } from '@angular/core';
import { CookiesTileComponent } from "../../../components/dashboard/tiles/cookies-tile/cookies-tile.component";
import { LoggerTileComponent } from "../../../components/dashboard/tiles/logger-tile/logger-tile.component";
import { AntragslisteTileComponent } from 'src/app/components/dashboard/tiles/antragsliste-tile/antragsliste-tile.component';
import { AuthService } from 'src/app/services/auth.service';
import { Title } from '@angular/platform-browser';
import { TimeHelper } from 'src/app/helpers/time.helper';
import { AntragsartenTileComponent } from "../../../components/dashboard/tiles/antragsarten-tile/antragsarten-tile.component";
import { MigrationTileComponent } from "../../../components/dashboard/tiles/migration-tile/migration-tile.component";
import { SettingsTileComponent } from "../../../components/dashboard/tiles/settings-tile/settings-tile.component";

@Component({
  selector: 'app-dashboard-home',
  imports: [CookiesTileComponent, LoggerTileComponent, AntragslisteTileComponent, AntragsartenTileComponent, MigrationTileComponent, SettingsTileComponent],
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.scss'
})
export class DashboardHomeComponent {
  authS = inject(AuthService);
  title = inject(Title);

  greeting: string = "";

  constructor() {
    this.title.setTitle('Dashboard');
    this.greeting = 'Guten ' + TimeHelper.getTimeOfDay() + ', ' + this.authS.username + '!';
  }
}
