import { AfterViewInit, Component, inject } from '@angular/core';
import { DashboardTileComponent } from "../../dashboard-tile/dashboard-tile.component";
import { SettingsService } from 'src/app/services/server/settings.service';
import { Settings } from 'server/models/settings.model';
import { ProgressSpinnerComponent } from "../../../progress-spinner/progress-spinner.component";
import { UploadsService } from 'src/app/services/data/uploads.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorDisplayComponent } from "../../../error-display/error-display.component";

@Component({
  selector: 'app-settings-tile',
  imports: [DashboardTileComponent, ProgressSpinnerComponent, ErrorDisplayComponent],
  templateUrl: './settings-tile.component.html',
  styleUrl: './settings-tile.component.scss'
})
export class SettingsTileComponent implements AfterViewInit {
  private settingsS = inject(SettingsService);
  private uploadS = inject(UploadsService);

  settings: Settings | null = null;
  error: HttpErrorResponse | null = null;

  async ngAfterViewInit(): Promise<void> {
    try {
      this.error = null
      this.settings = await this.settingsS.getSettings();
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        this.error = error;
      }
    }
  }

  async changeSetting(settingName: string, value: boolean | string): Promise<void> {
    try {
      this.error = null
      const settings = await this.settingsS.getSettings();
      if (!settings) return;
      (settings as any)[settingName] = value;
      await this.settingsS.saveSettings(settings);
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        this.error = error;
      }
    }
  }

  async deleteAllGeneratedFiles(): Promise<void> {
    try {
      this.error = null
      if (!confirm('Soll wirklich alle generierten Dateien gelöscht werden?')) return;
      await this.uploadS.deleteAllGeneratedFiles();
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        this.error = error;
      }
    }
  }
}
