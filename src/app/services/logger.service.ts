import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  constructor(private http: HttpClient, private authS: AuthService) { }

  async getLogFile() {
    try {
      const response = await lastValueFrom(
        this.http.get('/api/getLogFile', {
          headers: new HttpHeaders({ 'Authorization': `Bearer ${this.authS.getToken()}` }),
          observe: 'response',
          responseType: 'json' as 'json'
        })
      );

      if (response.status === 204) {
        // Keine Logs vorhanden
        const noContentMessage = { message: 'Keine Server-Logs vorhanden' };
        const jsonString = JSON.stringify(noContentMessage, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        window.open(URL.createObjectURL(blob), '_blank');
      } else {
        // Logs vorhanden
        const jsonString = JSON.stringify(response.body, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        window.open(URL.createObjectURL(blob), '_blank');
      }
    } catch (error) {
      console.error('Fehler beim Abrufen der Logs:', error);
    }
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
