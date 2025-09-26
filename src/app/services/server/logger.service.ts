import { HttpClient, httpResource } from '@angular/common/http';
import { computed, inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { TimeHelper } from '../../helpers/time.helper';
import { PaginatedDataService } from '../data/paginated-data.service';
import { Log } from 'common/models/log.model';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  private readonly http = inject(HttpClient);
  private readonly paginatedDataService = new PaginatedDataService<Log>();
  constructor() {
    this.paginatedDataService.init('/api/logger', log => log.timestamp.toString());
  }

  setPageToLoad = this.paginatedDataService.setPageToLoad.bind(this.paginatedDataService);
  loadLogs = this.paginatedDataService.loadData.bind(this.paginatedDataService);
  resetLogs = this.paginatedDataService.resetItems.bind(this.paginatedDataService);

  readonly logerData = this.paginatedDataService.data;
  readonly logs = this.paginatedDataService.items;
  readonly loadedPages = this.paginatedDataService.loadedPages;
  readonly totalPages = this.paginatedDataService.totalPages;
  readonly totalLogs = this.paginatedDataService.totalItems;

  // Private readonly _loggerResource = httpResource<{ level: string; timestamp: string; message: string }[]>(() => ({
  //   Url: '/api/logger'
  // }));

  // Readonly loggerResource = this._loggerResource.asReadonly();

  // ReloadLogger() {
  //   This._loggerResource.reload();
  // }

  // Readonly formatedLogs = computed(() => {
  //   If (!this.loggerResource.hasValue()) return;
  //   Const logs = this.loggerResource.value();

  //   Const formattedLogs = logs.map(log => {
  //     Const date = new Date(log.timestamp);
  //     Const formattedDate = TimeHelper.formatDate(date);
  //     Const formattedTime = TimeHelper.formatTime(date);
  //     Const formattedTimestamp = `${formattedDate} ${formattedTime}`;

  //     Return { ...log, timestamp: formattedTimestamp };
  //   });

  //   Return formattedLogs;
  // });

  openLogFileInNewTab() {
    const logFile = this.logs();

    if (!logFile) {
      alert('Keine Logs vorhanden');
      return;
    }
    const jsonString = JSON.stringify(logFile, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    window.open(URL.createObjectURL(blob), '_blank');
  }

  async deleteLogFile() {
    await lastValueFrom(this.http.delete('/api/logger'));
  }
}
