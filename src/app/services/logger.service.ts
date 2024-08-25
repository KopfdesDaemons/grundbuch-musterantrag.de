import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { AuthService } from './auth.service';
import { TimeService } from './time.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  // Injections
  http = inject(HttpClient);
  authS = inject(AuthService);
  timeS = inject(TimeService);
  platformID = inject(PLATFORM_ID);

  async getLogFile(): Promise<{ timestamp: string, message: string }[] | null> {
    if (!isPlatformBrowser(this.platformID)) return null;
    try {
      const response: any = await lastValueFrom(
        this.http.get('/api/getLogFile', {
          headers: new HttpHeaders({ 'Authorization': `Bearer ${this.authS.getToken()}` }),
          observe: 'response',
          responseType: 'json' as 'json'
        })
      );

      if (response.status === 204) {
        // Keine Logs vorhanden
        return null;
      } else {
        // Logs vorhanden
        const logs = response.body as { timestamp: string, message: string }[];

        // Zeitstempel formatieren
        const formattedLogs = logs.map(log => {
          const date = new Date(log.timestamp);
          const formattedDate = this.timeS.formatDate(date);
          const formattedTime = this.timeS.formatTime(date);
          const formattedTimestamp = `${formattedDate} ${formattedTime}`;

          return { ...log, timestamp: formattedTimestamp };
        });

        return formattedLogs;
      }
    } catch (error) {
      console.error('Fehler beim Abrufen der Logs:', error);
      throw error;
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
    try {
      await lastValueFrom(this.http.delete('/api/deleteLogFile/', {
        headers: new HttpHeaders({ 'Authorization': `Bearer ${this.authS.getToken()}` }),
        responseType: 'text'
      }));
      alert('Logfile gelöscht')
    } catch (error) {
      console.error('Error beim Löschen des Ordners:', error);
    }
  }
}
