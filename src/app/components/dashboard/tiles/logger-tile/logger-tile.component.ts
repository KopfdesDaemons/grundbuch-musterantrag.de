import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DashboardTileComponent } from '../../dashboard-tile/dashboard-tile.component';
import { LoggerService } from 'src/app/services/server/logger.service';
import { ProgressSpinnerComponent } from '../../../progress-spinner/progress-spinner.component';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorDisplayComponent } from '../../../error-display/error-display.component';
import { DatePipe, NgClass } from '@angular/common';
import { Log } from 'common/models/log.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-logger-tile',
  imports: [DashboardTileComponent, ProgressSpinnerComponent, ErrorDisplayComponent, NgClass, DatePipe],
  templateUrl: './logger-tile.component.html',
  styleUrl: './logger-tile.component.scss'
})
export class LoggerTileComponent {
  readonly loggerS = inject(LoggerService);
  protected readonly error = signal<Error | HttpErrorResponse | null>(null);

  protected readonly disableControlls = computed<boolean>(() => {
    return this.loggerS.logerData.isLoading() || !!this.error() || !!this.loggerS.logerData.error() || !this.loggerS.logs();
  });

  firstLogPage = computed<Log[]>(() => {
    const logs = this.loggerS.logs();
    if (!logs) return [];
    return logs.slice(0, 10);
  });

  async deleteLogFile() {
    try {
      this.error.set(null);
      await this.loggerS.deleteLogFile();
      this.loggerS.loadLogs();
    } catch (error) {
      if (error instanceof Error || error instanceof HttpErrorResponse) {
        this.error.set(error);
      }
    }
  }

  reload() {
    this.error.set(null);
    this.loggerS.setPageToLoad(1);
    this.loggerS.resetLogs();
    this.loggerS.loadLogs();
  }

  addLineBreak(timestamp: string): string {
    const dateAndTime = timestamp.split(' ');
    const date = dateAndTime[0];
    const time = dateAndTime[1];
    return `${date} ${time}\u00A0Uhr`;
  }
}
