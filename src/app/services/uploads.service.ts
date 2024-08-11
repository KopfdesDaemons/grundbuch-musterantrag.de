import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { AuthService } from './auth.service';
import FileSaver from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class UploadsService {
  uploadsData: any;

  constructor(private http: HttpClient, private authS: AuthService) { }

  async getTotalPages(): Promise<number> {
    if (!this.uploadsData) {
      this.uploadsData = await lastValueFrom(
        this.http.get('/api/uploads', {
          headers: new HttpHeaders({ 'Authorization': `Bearer ${this.authS.getToken()}` }),
          params: new HttpParams().set('page', 0)
        })
      );
    };
    return this.uploadsData['totalPages'];
  }

  async getFiles(page: number = 1): Promise<{ page: number, files: any[] }> {
    return new Promise(async (resolve, reject) => {
      try {
        // Nicht laden, wenn über totalPages
        if (this.uploadsData && page > this.uploadsData['totalPages']) {
          return reject(new Error('Seite größer als die gesamte Anzahl der Seiten'));
        };

        console.log('Lade Daten der Seite:', page);

        // Lade neue Seite
        this.uploadsData = await lastValueFrom(
          this.http.get('/api/uploads', {
            headers: new HttpHeaders({ 'Authorization': `Bearer ${this.authS.getToken()}` }),
            params: new HttpParams().set('page', page)
          })
        );

        resolve({ page: this.uploadsData['page'], files: this.uploadsData['files'] });

      } catch (err: any) {
        console.error('Die Dateien konnten nicht geladen werden.' + err.error, err);
        console.log(err.status);

        if (err.status === 403) this.authS.abmelden();
        reject(err);
      }
    });
  }

  async getFile(fileName: string, fileType: 'pdf' | 'docx') {
    fileName = fileName + `.${fileType}`;

    try {
      const response: any = await fetch('/api/uploads/getFile?' + new URLSearchParams({ fileName }), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.authS.getToken()}`,
        }
      });

      if (!response.ok) throw new Error(`Netzwerkantwort war nicht ok: ${response.statusText}`);

      const contentType = fileType === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

      // body auslesen
      const reader = response.body.getReader();
      const chunks: Uint8Array[] = [];
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
      }

      const file = new window.Blob(chunks, { type: contentType });

      // PDF in neuen Tab öffnen
      if (fileType === 'pdf') {
        window.open(URL.createObjectURL(file), '_blank');
        return;
      }

      // DOCX als Datei speichern
      FileSaver.saveAs(file, fileName);

    } catch (error) {
      console.error('Error beim Abrufen der Datei:', error);
    }
  }

  async deleteFile(name: string) {
    await lastValueFrom(this.http.delete('/api/uploads/deleteFiles', {
      headers: new HttpHeaders({ 'Authorization': `Bearer ${this.authS.getToken()}` }),
      params: new HttpParams().set('fileName', name),
      responseType: 'text'
    }));
  }

  async deleteFolder() {
    try {
      await lastValueFrom(this.http.delete('/api/uploads/', {
        headers: new HttpHeaders({ 'Authorization': `Bearer ${this.authS.getToken()}` }),
        responseType: 'text'
      }));
    } catch (error: any) {
      console.error('Error beim Löschen des Ordners:', error);
    }
  }
}
