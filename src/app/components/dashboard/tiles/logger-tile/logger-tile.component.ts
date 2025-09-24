import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DashboardTileComponent } from '../../dashboard-tile/dashboard-tile.component';
import { LoggerService } from 'src/app/services/server/logger.service';
import { ProgressSpinnerComponent } from '../../../progress-spinner/progress-spinner.component';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorDisplayComponent } from '../../../error-display/error-display.component';
import { NgClass } from '@angular/common';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-logger-tile',
  imports: [DashboardTileComponent, ProgressSpinnerComponent, ErrorDisplayComponent, NgClass],
  templateUrl: './logger-tile.component.html',
  styleUrl: './logger-tile.component.scss'
})
export class LoggerTileComponent {
  loggerS = inject(LoggerService);
  error = signal<Error | HttpErrorResponse | null>(null);

  async deleteLogFile() {
    try {
      this.error.set(null);
      await this.loggerS.deleteLogFile();
      this.loggerS.loggerResource.reload();
    } catch (error) {
      if (error instanceof Error || error instanceof HttpErrorResponse) {
        this.error.set(error);
      }
    }
  }

  addLineBreak(timestamp: string): string {
    const dateAndTime = timestamp.split(' ');
    const date = dateAndTime[0];
    const time = dateAndTime[1];
    return `${date} ${time}\u00A0Uhr`;
  }
}
