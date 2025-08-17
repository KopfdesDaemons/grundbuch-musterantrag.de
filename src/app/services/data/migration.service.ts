import { inject, Injectable } from '@angular/core';
import { AuthService } from '../user/auth.service';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Migration } from '../../models/migration.model';

@Injectable({
  providedIn: 'root'
})
export class MigrationService {
  private http = inject(HttpClient);
  private authS = inject(AuthService);

  migrations: Migration[] = [];

  constructor() {
    this.migrations = [
      new Migration(
        'Von Antrag zu Uploadinfo',
        'Migration der Struktur der gespeicherten Uploadinfos der Anträge. Es werden nicht mehr alle Daten aus dem Formular gespeichert, sondern nur die, die im Dashboard angezeigt werden.',
        this.migrateFromAntragToUploadinfo
      ),
      new Migration('Von JSON zur Datenbank', 'Migration von der JSON Struktur zur Datenbank.', this.migrateFromJSONToDatabase)
    ];
  }

  migrateFromAntragToUploadinfo = async (): Promise<any> => {
    const data = await lastValueFrom(
      this.http.post(
        '/api/migration/fromAntragToUploadinfo',
        {},
        {
          headers: this.authS.getAuthHeader()
        }
      )
    );
    return data;
  };

  migrateFromJSONToDatabase = async (): Promise<any> => {
    const data = await lastValueFrom(
      this.http.post(
        '/api/migration/fromJSONToDatabase',
        {},
        {
          headers: this.authS.getAuthHeader()
        }
      )
    );
    return data;
  };
}
