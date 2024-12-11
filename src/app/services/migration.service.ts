import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { lastValueFrom } from 'rxjs';
import { Migration } from '../models/migration';

@Injectable({
  providedIn: 'root'
})
export class MigrationService {
  http = inject(HttpClient);
  authS = inject(AuthService);
  platformId = inject(PLATFORM_ID);

  migrations: Migration[] = []

  constructor() {
    this.migrations = [
      new Migration(
        'Von Antrag zu Uploadinfo JSON',
        'Migration der Struktur der gespeicherten Uploadinfos der Anträge. Es werden nicht mehr alle Daten aus dem Formular gespeichert, sondern nur die, die im Dashboard angezeigt werden.',
        this.migrateFromAntragToUploadinfo)
    ]
  }


  migrateFromAntragToUploadinfo = async (): Promise<any> => {
    if (!isPlatformBrowser(this.platformId)) return;
    const data = await lastValueFrom(
      this.http.post('/api/migration/fromAntragToUploadinfo', {}, {
        headers: new HttpHeaders({ 'Authorization': `Bearer ${this.authS.getToken()}` }),
        responseType: 'text'
      })
    );
    return data;
  }
}