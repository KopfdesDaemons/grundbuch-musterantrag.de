import { Component, computed, inject, OnInit } from '@angular/core';
import { CookiesTileComponent } from '../../../components/dashboard/tiles/cookies-tile/cookies-tile.component';
import { LoggerTileComponent } from '../../../components/dashboard/tiles/logger-tile/logger-tile.component';
import { AntragslisteTileComponent } from 'src/app/components/dashboard/tiles/antragsliste-tile/antragsliste-tile.component';
import { Title } from '@angular/platform-browser';
import { TimeHelper } from 'src/app/helpers/time.helper';
import { AntragsartenTileComponent } from '../../../components/dashboard/tiles/antragsarten-tile/antragsarten-tile.component';
import { MigrationTileComponent } from '../../../components/dashboard/tiles/migration-tile/migration-tile.component';
import { SettingsTileComponent } from '../../../components/dashboard/tiles/settings-tile/settings-tile.component';
import { UserSettingsService } from 'src/app/services/user/user-settings.service';

@Component({
  selector: 'app-dashboard-home',
  imports: [
    CookiesTileComponent,
    LoggerTileComponent,
    AntragslisteTileComponent,
    AntragsartenTileComponent,
    MigrationTileComponent,
    SettingsTileComponent
  ],
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.scss'
})
export class DashboardHomeComponent implements OnInit {
  userSettingsS = inject(UserSettingsService);
  title = inject(Title);
  greeting = computed(() => {
    const username = this.userSettingsS.username.value() ?? '';
    const greeting = TimeHelper.getTimeOfDay();
    if (username) return 'Guten ' + greeting + ', ' + username + '!';
    else return 'Guten ' + greeting + '!';
  });

  ngOnInit() {
    this.title.setTitle('Dashboard');
  }
}
