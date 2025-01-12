import { AfterViewInit, Component, inject } from '@angular/core';
import { DashboardTileComponent } from "../../dashboard-tile/dashboard-tile.component";
import { SettingsService } from 'src/app/services/settings.service';
import { Settings } from 'server/models/settings';
import { ProgressSpinnerComponent } from "../../../progress-spinner/progress-spinner.component";
import { UploadsService } from 'src/app/services/uploads.service';

@Component({
  selector: 'app-settings-tile',
  imports: [DashboardTileComponent, ProgressSpinnerComponent],
  templateUrl: './settings-tile.component.html',
  styleUrl: './settings-tile.component.scss'
})
export class SettingsTileComponent implements AfterViewInit {
  private settingsS = inject(SettingsService);
  private uploadS = inject(UploadsService);

  settings: Settings | null = null;
  error: boolean = false;

  async ngAfterViewInit(): Promise<void> {
    try {
      this.error = false

      this.settings = await this.settingsS.getSettings();
    } catch (error) {
      this.error = true;
    }
  }

  async changeSetting(settingName: string, value: boolean | string): Promise<void> {
    const settings = await this.settingsS.getSettings();
    if (!settings) return;
    (settings as any)[settingName] = value;
    this.settingsS.saveSettings(settings);
  }

  async deleteAllGeneratedFiles(): Promise<void> {
    if (!confirm('Soll wirklich alle generierten Dateien gelöscht werden?')) return;
    await this.uploadS.deleteAllGeneratedFiles();
  }
}
