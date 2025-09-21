import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Settings } from 'server/models/settings.model';
import { AuthService } from '../user/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  http = inject(HttpClient);
  authS = inject(AuthService);

  private loadTrigger = signal(false);

  settingsResource = httpResource<Settings>(() => {
    if (!this.loadTrigger()) return undefined;
    return {
      url: '/api/settings',
      headers: this.authS.getAuthHeader()
    };
  });

  load() {
    this.loadTrigger.set(true);
  }

  async saveSettings(settings: Settings): Promise<void> {
    await lastValueFrom(
      this.http.put(
        '/api/settings',
        { settings: settings },
        {
          headers: this.authS.getAuthHeader(),
          responseType: 'json' as const
        }
      )
    );
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
