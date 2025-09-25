import { HttpClient, httpResource } from '@angular/common/http';
import { computed, inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { TimeHelper } from '../../helpers/time.helper';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  private readonly http = inject(HttpClient);

  private readonly _loggerResource = httpResource<{ level: string; timestamp: string; message: string }[]>(() => ({
    url: '/api/logger'
  }));

  readonly loggerResource = this._loggerResource.asReadonly();

  reloadLogger() {
    this._loggerResource.reload();
  }

  readonly formatedLogs = computed(() => {
    if (!this.loggerResource.hasValue()) return;
    const logs = this.loggerResource.value();

    const formattedLogs = logs.map(log => {
      const date = new Date(log.timestamp);
      const formattedDate = TimeHelper.formatDate(date);
      const formattedTime = TimeHelper.formatTime(date);
      const formattedTimestamp = `${formattedDate} ${formattedTime}`;

      return { ...log, timestamp: formattedTimestamp };
    });

    return formattedLogs;
  });

  openLogFileInNewTab() {
    const logFile = this.loggerResource.value();

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
