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
    try {
      const data = await lastValueFrom(this.http.post('/api/migration/fromAntragToUploadinfo', {}));
      return data;
    } catch (error) {
      console.error('Migration "AntragToUploadinfo" failed:', error);
      throw error;
    }
  }

  async migrateFromJSONToDatabase(): Promise<any> {
    try {
      const data = await lastValueFrom(this.http.post('/api/migration/fromJSONToDatabase', {}));
      return data;
    } catch (error) {
      console.error('Migration "JSONToDatabase" failed:', error);
      throw error;
    }
  }

  async migrateFromDocxToOdt(): Promise<any> {
    try {
      const data = await lastValueFrom(this.http.post('/api/migration/fromDocxToOdt', {}));
      return data;
    } catch (error) {
      console.error('Migration "DocxToOdt" failed:', error);
      throw error;
    }
  }
}
