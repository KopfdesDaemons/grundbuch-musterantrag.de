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
   * @returns Settings | null
   */
  async loadSettings(): Promise<Settings | null> {
    const response = await lastValueFrom(
      this.http.get('/api/settings', {
        headers: new HttpHeaders({ 'Authorization': `Bearer ${this.authS.getToken()}` }),
        responseType: 'json' as const
      })
    );
    return response as Settings;
  }

  /**
   * Lade die Einstellungen aus dem Service ohne API-Aufruf, wenn sie bereits geladen wurden
   * @returns Settings | null
   */
  async getSettings(): Promise<Settings | null> {
    if (!this.settings) this.settings = await this.loadSettings();
    return this.settings;
  }

  async saveSettings(settings: Settings): Promise<void> {
    this.settings = settings;
    await lastValueFrom(
      this.http.put('/api/settings', { settings: settings }, {
        headers: new HttpHeaders({ 'Authorization': `Bearer ${this.authS.getToken()}` }),
        responseType: 'json' as const
      })
    );
  }

  async getPrimaryColorFromSetings(): Promise<string | null> {
    try {
      const result = await lastValueFrom(
        this.http.get('/api/settings/getPrimaryColor')
      );
      if (!result) return null;
      const { primaryColor } = result as { primaryColor: string };
      return primaryColor;
    } catch (error) {
      console.error('Error beim Laden der primären Farbe:', error);
      return null;
    }
  }
};

