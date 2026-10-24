import { DatePipe } from '@angular/common';
import { Component, inject, linkedSignal, signal, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Log } from 'common/models/log.model';
import { LogRow } from 'src/app/interfaces/log-row';
import { LoggerService } from 'src/app/services/server/logger.service';
import { ErrorDisplayComponent } from 'src/app/components/error-display/error-display.component';
import { ProgressSpinnerComponent } from 'src/app/components/progress-spinner/progress-spinner.component';
import { UserSettingsService } from 'src/app/services/user/user-settings.service';
import { Feature, LoggerAction } from 'common/interfaces/user-permission.interface';

@Component({
  selector: 'app-logs-list',
  imports: [DatePipe, FormsModule, ErrorDisplayComponent, ProgressSpinnerComponent],
  templateUrl: './logs-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './logs-list.component.scss'
})
export class LogsListComponent implements OnDestroy {
  private readonly userSettingsS = inject(UserSettingsService);
  protected readonly error = signal<Error | null>(null);
  protected readonly loggerS = inject(LoggerService);

  protected readonly selectedLevel = signal<'all' | 'info' | 'warn' | 'error'>('all');
  protected readonly searchTerm = signal<string>('');
  protected readonly grouped = signal<boolean>(true);
  private searchTimeout: ReturnType<typeof setTimeout> | null = null;

  protected readonly userHasPermissionsDeleteLogs = this.userSettingsS.getPermissionsSignal({
    feature: Feature.Logger,
    allowedActions: [LoggerAction.ClearLogFile]
  });

  private rowsMap = new Map<string, LogRow>();
  rows = linkedSignal<Log[], LogRow[]>({
    source: () => this.loggerS.logs(),
    computation: (logs, previous) => {
      if (!logs) {
        return previous?.value ?? [];
      }
      return logs.map(log => {
        const key = `${String(log.timestamp)}_${log.level}_${log.message}`;
        if (this.rowsMap.has(key)) {
          const existing = this.rowsMap.get(key)!;
          existing.log = log;
          return existing;
        }
        const newRow: LogRow = { log: log, editMode: false };
        this.rowsMap.set(key, newRow);
        return newRow;
      });
    }
  });

  ngOnDestroy(): void {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
  }

  onLevelChange(level: 'all' | 'info' | 'warn' | 'error') {
    this.selectedLevel.set(level);
    this.applyFilters();
  }

  onGroupedChange(grouped: boolean) {
    this.grouped.set(grouped);
    this.applyFilters();
  }

  onSearchInput(value: string) {
    this.searchTerm.set(value);
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    this.searchTimeout = setTimeout(() => {
      this.applyFilters();
    }, 250);
  }

  clearSearch() {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    this.searchTerm.set('');
    this.applyFilters();
  }

  private applyFilters() {
    this.error.set(null);
    this.rowsMap.clear();
    const params: Record<string, string | number | boolean> = {
      grouped: this.grouped()
    };
    if (this.selectedLevel() !== 'all') {
      params['level'] = this.selectedLevel();
    }
    const trimmedSearch = this.searchTerm().trim();
    if (trimmedSearch !== '') {
      params['search'] = trimmedSearch;
    }
    this.loggerS.setParams(params);
  }

  hasDetails(log: Log): boolean {
    return Boolean(log.stack || log.route || (log.count && log.count > 1));
  }

  addLineBreak(timestamp: string): string {
    const dateAndTime = timestamp.split(' ');
    const date = dateAndTime[0];
    const time = dateAndTime[1];
    return `${date} ${time}\u00A0Uhr`;
  }

  scroll(element: HTMLElement) {
    if (element.scrollTop > element.scrollHeight - element.clientHeight - 150) {
      if (!this.loggerS.loggerData.isLoading()) this.loadPage(this.loggerS.loadedPages() + 1);
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
