import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { AuthService } from './auth.service';
import { isPlatformBrowser } from '@angular/common';
import { TimeHelper } from '../helpers/time.helper';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  http = inject(HttpClient);
  authS = inject(AuthService);
  platformID = inject(PLATFORM_ID);

  async getLogFile(): Promise<{ timestamp: string, message: string }[] | null> {
    if (!isPlatformBrowser(this.platformID)) return null;
    const response: any = await lastValueFrom(
      this.http.get('/api/logger', {
        headers: new HttpHeaders({ 'Authorization': `Bearer ${this.authS.authToken}` }),
        observe: 'response',
        responseType: 'json' as const
      })
    );

    if (response.status === 204) {
      // no content
      return null;
    } else {
      // content
      const logs = response.body as { timestamp: string, message: string }[];

      // format the logs
      const formattedLogs = logs.map(log => {
        const date = new Date(log.timestamp);
        const formattedDate = TimeHelper.formatDate(date);
        const formattedTime = TimeHelper.formatTime(date);
        const formattedTimestamp = `${formattedDate} ${formattedTime}`;

        return { ...log, timestamp: formattedTimestamp };
      });

      return formattedLogs;
    }
  }

  async openLogFileInNewTab() {
    const logFile = await this.getLogFile();

    if (!logFile) {
      alert('Keine Logs vorhanden');
      return;
    }
    const jsonString = JSON.stringify(logFile, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    window.open(URL.createObjectURL(blob), '_blank');
  }

  async deleteLogFile() {
    await lastValueFrom(this.http.delete('/api/logger', {
      headers: new HttpHeaders({ 'Authorization': `Bearer ${this.authS.authToken}` })
    }));
  }
}
