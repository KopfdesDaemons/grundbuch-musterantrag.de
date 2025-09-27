import { DatePipe } from '@angular/common';
import { Component, inject, linkedSignal, signal } from '@angular/core';
import { Log } from 'common/models/log.model';
import { LogRow } from 'src/app/interfaces/log-row';
import { LoggerService } from 'src/app/services/server/logger.service';
import { ErrorDisplayComponent } from 'src/app/components/error-display/error-display.component';
import { ProgressSpinnerComponent } from 'src/app/components/progress-spinner/progress-spinner.component';

@Component({
  selector: 'app-logs-list',
  imports: [DatePipe, ErrorDisplayComponent, ProgressSpinnerComponent],
  templateUrl: './logs-list.component.html',
  styleUrl: './logs-list.component.scss'
})
export class LogsListComponent {
  protected readonly error = signal<Error | null>(null);
  protected readonly loggerS = inject(LoggerService);

  private rowsMap = new Map<string, LogRow>();
  rows = linkedSignal<Log[], LogRow[]>({
    source: () => this.loggerS.logs(),
    computation: (logs, previous) => {
      if (!logs) {
        return previous?.value ?? [];
      }
      return logs.map(log => {
        if (this.rowsMap.has(log.timestamp.toString())) {
          return this.rowsMap.get(log.timestamp.toString())!;
        }
        const newRow: LogRow = { log: log, editMode: false };
        this.rowsMap.set(log.timestamp.toString(), newRow);
        return newRow;
      });
    }
  });

  addLineBreak(timestamp: string): string {
    const dateAndTime = timestamp.split(' ');
    const date = dateAndTime[0];
    const time = dateAndTime[1];
    return `${date} ${time}\u00A0Uhr`;
  }

  scroll(element: any) {
    if (element.scrollTop > element.scrollHeight - element.clientHeight - 150) {
      if (!this.loggerS.logerData.isLoading()) this.loadPage(this.loggerS.loadedPages() + 1);
    }
  }

  private loadPage(pageNumber: number) {
    if (!this.loggerS.totalPages()) return;
    if (pageNumber > this.loggerS.totalPages()!) return;
    this.loggerS.setPageToLoad(pageNumber);
    this.loggerS.loadLogs();
  }

  reloadFiles() {
    this.error.set(null);
    this.loggerS.resetLogs();
    this.rowsMap.clear();
    this.loggerS.setPageToLoad(1);
    this.loggerS.loadLogs();
  }

  async deleteAllLogs() {
    if (!confirm('Wirklich alle Logs löschen?')) return;
    await this.loggerS.deleteLogFile();
    this.reloadFiles();
  }
}
