import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Settings } from 'server/models/settings';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  http = inject(HttpClient);
  authS = inject(AuthService);

  private settings: Settings | null = null;

  /**
   * Lade die Einstellungen von der API
   * @returns Settings
   */
  async loadSettings(): Promise<Settings | null> {
    try {
      const response = await lastValueFrom(
        this.http.get('/api/settings', {
          headers: new HttpHeaders({ 'Authorization': `Bearer ${this.authS.getToken()}` }),
          responseType: 'json' as 'json'
        })
      );
      return response as Settings;
    } catch (error) {
      console.error('Error beim Laden der Einstellungen:', error);
      return null;
    }
  }

  /**
   * Lade die Einstellungen aus dem Service ohne API-Aufruf, wenn sie bereits geladen wurden
   * @returns Settings
   */
  async getSettings(): Promise<Settings | null> {
    if (!this.settings) this.settings = await this.loadSettings();
    return this.settings;
  }

  async saveSettings(settings: Settings): Promise<void> {
    try {
      this.settings = settings;
      await lastValueFrom(
        this.http.put('/api/settings', { settings: settings }, {
          headers: new HttpHeaders({ 'Authorization': `Bearer ${this.authS.getToken()}` }),
          responseType: 'json' as 'json'
        })
      );
    } catch (error) {
      console.error('Error beim Speichern der Einstellungen:', error);
    }
  }

  async getPrimaryColorFromSetings(): Promise<string | null> {
    try {
      const primaryColor = await lastValueFrom(
        this.http.get('/api/settings/getPrimaryColor', { responseType: 'text' as 'text' })
      );
      return primaryColor as string;
    } catch (error) {
      console.error('Error beim Laden der primären Farbe:', error);
      return null;
    }
  }
};

