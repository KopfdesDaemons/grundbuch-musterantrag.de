import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Migration } from '../../models/migration.model';

@Injectable({
  providedIn: 'root'
})
export class MigrationService {
  private readonly http = inject(HttpClient);

  private _migrations: Migration[] = [
    new Migration(
      'Von Antrag zu Uploadinfo',
      'Migration der Struktur der gespeicherten Uploadinfos der Anträge. Es werden nicht mehr alle Daten aus dem Formular gespeichert, sondern nur die, die im Dashboard angezeigt werden.',
      this.migrateFromAntragToUploadinfo.bind(this)
    ),
    new Migration('Von JSON zur Datenbank', 'Migration von der JSON Struktur zur Datenbank.', this.migrateFromJSONToDatabase.bind(this)),
    new Migration(
      'Von .docx zu .odt',
      'Aktualisiert bereits vorhandene Datenbankeinträge von docxFile zu odtFile und entfernt die Spalte docxFile.',
      this.migrateFromDocxToOdt.bind(this)
    )
  ];

  get migrations(): Migration[] {
    return [...this._migrations];
  }

  async migrateFromAntragToUploadinfo(): Promise<any> {
    return await lastValueFrom(this.http.post('/api/migration/fromAntragToUploadinfo', {}));
  }

  async migrateFromJSONToDatabase(): Promise<any> {
    return await lastValueFrom(this.http.post('/api/migration/fromJSONToDatabase', {}));
  }

  async migrateFromDocxToOdt(): Promise<any> {
    return await lastValueFrom(this.http.post('/api/migration/fromDocxToOdt', {}));
  }
}
