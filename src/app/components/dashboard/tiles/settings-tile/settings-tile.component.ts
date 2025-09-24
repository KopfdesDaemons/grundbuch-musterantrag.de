import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { DashboardTileComponent } from '../../dashboard-tile/dashboard-tile.component';
import { SettingsService } from 'src/app/services/server/settings.service';
import { ProgressSpinnerComponent } from '../../../progress-spinner/progress-spinner.component';
import { UploadsService } from 'src/app/services/data/uploads.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorDisplayComponent } from '../../../error-display/error-display.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-settings-tile',
  imports: [DashboardTileComponent, ProgressSpinnerComponent, ErrorDisplayComponent],
  templateUrl: './settings-tile.component.html',
  styleUrl: './settings-tile.component.scss'
})
export class SettingsTileComponent implements OnInit {
  private uploadS = inject(UploadsService);
  settingsS = inject(SettingsService);
  error = signal<Error | HttpErrorResponse | null>(null);

  ngOnInit(): void {
    this.settingsS.load();
  }

  async changeSetting(settingName: string, value: boolean | string): Promise<void> {
    try {
      this.error.set(null);
      if (!this.settingsS.settingsResource.hasValue()) return;
      const settings = this.settingsS.settingsResource.value();
      (settings as any)[settingName] = value;
      await this.settingsS.saveSettings(settings);
    } catch (error) {
      if (error instanceof Error || error instanceof HttpErrorResponse) {
        this.error.set(error);
      }
    }
  }

  async deleteAllGeneratedFiles(): Promise<void> {
    try {
      this.error.set(null);
      if (!confirm('Soll wirklich alle generierten Dateien gelöscht werden?')) return;
      await this.uploadS.deleteAllGeneratedFiles();
    } catch (error) {
      if (error instanceof Error || error instanceof HttpErrorResponse) {
        this.error.set(error);
      }
    }
  }
}
