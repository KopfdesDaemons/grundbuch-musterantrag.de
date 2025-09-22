import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Migration } from '../../models/migration.model';

@Injectable({
  providedIn: 'root'
})
export class MigrationService {
  private http = inject(HttpClient);

  migrations: Migration[] = [];

  constructor() {
    this.migrations = [
      new Migration(
        'Von Antrag zu Uploadinfo',
        'Migration der Struktur der gespeicherten Uploadinfos der Anträge. Es werden nicht mehr alle Daten aus dem Formular gespeichert, sondern nur die, die im Dashboard angezeigt werden.',
        this.migrateFromAntragToUploadinfo
      ),
      new Migration('Von JSON zur Datenbank', 'Migration von der JSON Struktur zur Datenbank.', this.migrateFromJSONToDatabase),
      new Migration(
        'Von .docx zu .odt',
        'Aktualisiert bereits vorhandene Datenbankeinträge von docxFile zu odtFile und entfernt die Spalte docxFile.',
        this.migrateFromDocxToOdt
      )
    ];
  }

  migrateFromAntragToUploadinfo = async (): Promise<any> => {
    const data = await lastValueFrom(this.http.post('/api/migration/fromAntragToUploadinfo', {}));
    return data;
  };

  migrateFromJSONToDatabase = async (): Promise<any> => {
    const data = await lastValueFrom(this.http.post('/api/migration/fromJSONToDatabase', {}));
    return data;
  };

  migrateFromDocxToOdt = async (): Promise<any> => {
    const data = await lastValueFrom(this.http.post('/api/migration/fromDocxToOdt', {}));
    return data;
  };
}
