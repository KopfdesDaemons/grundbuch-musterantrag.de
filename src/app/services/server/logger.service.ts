import { HttpClient, httpResource } from '@angular/common/http';
import { computed, inject, Injectable, PLATFORM_ID } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { AuthService } from '../user/auth.service';
import { TimeHelper } from '../../helpers/time.helper';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  http = inject(HttpClient);
  authS = inject(AuthService);
  platformID = inject(PLATFORM_ID);

  loggerResource = httpResource<{ level: string; timestamp: string; message: string }[]>(() => ({
    url: '/api/logger',
    headers: this.authS.getAuthHeader()
  }));

  formatedLogs = computed(() => {
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
    await lastValueFrom(
      this.http.delete('/api/logger', {
        headers: this.authS.getAuthHeader()
      })
    );
  }
}
