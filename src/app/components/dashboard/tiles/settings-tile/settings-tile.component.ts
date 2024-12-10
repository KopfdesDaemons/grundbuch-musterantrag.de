import { AfterViewInit, Component, inject } from '@angular/core';
import { DashboardTileComponent } from "../../dashboard-tile/dashboard-tile.component";
import { SettingsService } from 'src/app/services/settings.service';
import { Settings } from 'server/models/settings';
import { ProgressSpinnerComponent } from "../../../progress-spinner/progress-spinner.component";

@Component({
  selector: 'app-settings-tile',
  standalone: true,
  imports: [DashboardTileComponent, ProgressSpinnerComponent],
  templateUrl: './settings-tile.component.html',
  styleUrl: './settings-tile.component.scss'
})
export class SettingsTileComponent implements AfterViewInit {
  settingsS = inject(SettingsService);

  settings: Settings | null = null;

  async ngAfterViewInit(): Promise<void> {
    this.settings = await this.settingsS.getSettings();
  }

  async changeSetting(settingName: string, value: boolean): Promise<void> {
    const settings = await this.settingsS.getSettings();
    if (!settings) return;
    if (settings.hasOwnProperty(settingName)) {
      (settings as any)[settingName] = value;
      this.settingsS.saveSettings(settings);
    } else {
      console.error(`Einstellung "${settingName}" existiert nicht.`);
    }
  }
}
