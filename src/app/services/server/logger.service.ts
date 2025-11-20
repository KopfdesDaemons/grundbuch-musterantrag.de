import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
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

  readonly loggerData = this.paginatedDataService.data;
  readonly logs = this.paginatedDataService.items;
  readonly loadedPages = this.paginatedDataService.loadedPages;
  readonly totalPages = this.paginatedDataService.totalPages;
  readonly totalLogs = this.paginatedDataService.totalItems;

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
