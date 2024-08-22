import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { AuthService } from './auth.service';
import FileSaver from 'file-saver';
import { isPlatformBrowser } from '@angular/common';
import { AntragsData } from 'server/models/antragsData';

@Injectable({
  providedIn: 'root'
})
export class UploadsService {
  // Injections
  http = inject(HttpClient);
  authS = inject(AuthService);
  private platformId = inject(PLATFORM_ID);

  uploadsData: any;

  async getTotalPages(): Promise<number> {
    this.uploadsData = await this.getUploadsData();
    return this.uploadsData['totalPages'];
  }

  async getUploadsData(): Promise<any> {
    try {
      const data = await lastValueFrom(
        this.http.get('/api/uploads', {
          headers: new HttpHeaders({ 'Authorization': `Bearer ${this.authS.getToken()}` }),
          params: new HttpParams().set('page', 0)
        })
      );
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async getFiles(page: number = 1): Promise<{ page: number, files: AntragsData[] }> {
    try {
      // Nicht laden, wenn über totalPages
      if (this.uploadsData && page > this.uploadsData['totalPages']) {
        throw new Error('Seite größer als die gesamte Anzahl der Seiten');
      };

      console.log('Lade Daten der Seite:', page);

      // Lade neue Seite
      this.uploadsData = await lastValueFrom(
        this.http.get('/api/uploads', {
          headers: new HttpHeaders({ 'Authorization': `Bearer ${this.authS.getToken()}` }),
          params: new HttpParams().set('page', page)
        })
      );

      return ({ page: this.uploadsData['page'], files: this.uploadsData['files'] });

    } catch (err: any) {
      console.error('Die Dateien konnten nicht geladen werden.' + err.error, err);
      console.log(err.status);

      if (err.status === 403) this.authS.abmelden();
      throw err;
    }
  }

  async getFile(fileName: string, fileType: 'pdf' | 'docx') {
    fileName = fileName + `.${fileType}`;

    try {
      const response: any = await fetch('/api/uploads/getFile?' + new URLSearchParams({ fileName }), {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${this.authS.getToken()}` }
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

  async getTotalFiles(): Promise<number> {
    if (!isPlatformBrowser(this.platformId)) return 0;
    this.uploadsData = await this.getUploadsData();
    return this.uploadsData['totalFiles'];
  }

  async deleteFile(name: string) {
    try {
      await lastValueFrom(this.http.delete('/api/uploads/deleteFiles', {
        headers: new HttpHeaders({ 'Authorization': `Bearer ${this.authS.getToken()}` }),
        params: new HttpParams().set('fileName', name),
        responseType: 'text'
      }));
    } catch (error: any) {
      console.error('Error beim Löschen der Datei:', error);
    }
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
