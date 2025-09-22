import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Settings } from 'server/models/settings.model';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private http = inject(HttpClient);

  private loadTrigger = signal(false);

  settingsResource = httpResource<Settings>(() => {
    if (!this.loadTrigger()) return undefined;
    return {
      url: '/api/settings'
    };
  });

  load() {
    this.loadTrigger.set(true);
  }

  async saveSettings(settings: Settings): Promise<void> {
    await lastValueFrom(this.http.put('/api/settings', { settings: settings }));
    this.settingsResource.set(settings);
  }

  async getPrimaryColorFromSetings(): Promise<string | null> {
    try {
      const result = await lastValueFrom(this.http.get('/api/settings/getPrimaryColor'));
      if (!result) return null;
      const { primaryColor } = result as { primaryColor: string };
      return primaryColor;
    } catch (error) {
      console.error('Error beim Laden der primären Farbe:', error);
      return null;
    }
  }
}
