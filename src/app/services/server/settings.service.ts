import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { inject, Injectable, Injector, untracked } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Settings } from 'common/models/settings.model';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private readonly http = inject(HttpClient);
  private readonly injector = inject(Injector);

  private _settingsResource?: HttpResourceRef<Settings | undefined>;

  get settingsResource() {
    if (!this._settingsResource) {
      this._settingsResource = untracked(() =>
        httpResource<Settings>(
          () => ({
            url: '/api/settings'
          }),
          { injector: this.injector }
        )
      );
    }
    return this._settingsResource.asReadonly();
  }

  load() {
    this._settingsResource?.reload();
  }

  async saveSettings(settings: Settings): Promise<void> {
    await lastValueFrom(this.http.put('/api/settings', { settings: settings }));
    this._settingsResource?.set(settings);
  }

  async getPrimaryColorFromSettings(): Promise<string | null> {
    try {
      const result = await lastValueFrom(this.http.get<{ primaryColor: string }>('/api/settings/getPrimaryColor'));
      if (!result) return null;
      return result.primaryColor;
    } catch (error) {
      console.error('Error beim Laden der primären Farbe:', error);
      return null;
    }
  }
}
