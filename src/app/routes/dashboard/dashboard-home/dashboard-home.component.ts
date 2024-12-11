import { Component, inject } from '@angular/core';
import { HeaderComponent } from "../../../components/header/header.component";
import { FooterComponent } from "../../../components/footer/footer.component";
import { CookiesTileComponent } from "../../../components/dashboard/tiles/cookies-tile/cookies-tile.component";
import { LoggerTileComponent } from "../../../components/dashboard/tiles/logger-tile/logger-tile.component";
import { AntragslisteTileComponent } from 'src/app/components/dashboard/tiles/antragsliste-tile/antragsliste-tile.component';
import { AuthService } from 'src/app/services/auth.service';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Title } from '@angular/platform-browser';
import { TimeService } from 'src/app/services/time.service';
import { AntragsartenTileComponent } from "../../../components/dashboard/tiles/antragsarten-tile/antragsarten-tile.component";
import { MigrationTileComponent } from "../../../components/dashboard/tiles/migration-tile/migration-tile.component";
import { SettingsTileComponent } from "../../../components/dashboard/tiles/settings-tile/settings-tile.component";

@Component({
    selector: 'app-dashboard-home',
    imports: [HeaderComponent, FooterComponent, CookiesTileComponent, LoggerTileComponent, AntragslisteTileComponent, FontAwesomeModule, AntragsartenTileComponent, MigrationTileComponent, SettingsTileComponent],
    templateUrl: './dashboard-home.component.html',
    styleUrl: './dashboard-home.component.scss'
})
export class DashboardHomeComponent {
  // Injections
  authS = inject(AuthService);
  title = inject(Title);
  timeS = inject(TimeService);

  greeting: string = "";

  // FontAwesome Icons
  faArrowRightFromBracket = faArrowRightFromBracket;

  constructor() {
    this.title.setTitle('Dashboard');
    this.greeting = 'Guten ' + this.timeS.getTimeOfDay() + ', ' + this.authS.getUsername() + '!';
  }
}
