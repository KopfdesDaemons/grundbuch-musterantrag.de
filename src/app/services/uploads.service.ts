import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { AuthService } from './auth.service';
import FileSaver from 'file-saver';
import { isPlatformBrowser } from '@angular/common';
import { Upload } from 'server/models/upload';

@Injectable({
  providedIn: 'root'
})
export class UploadsService {
  http = inject(HttpClient);
  authS = inject(AuthService);
  private platformId = inject(PLATFORM_ID);

  uploadsData: {
    page: number;
    totalPages: number;
    totalFiles: number;
    files: Upload[];
  } = { page: 0, totalPages: 0, totalFiles: 0, files: [] };

  async getTotalPages(): Promise<number> {
    if (!isPlatformBrowser(this.platformId)) return 0;
    this.uploadsData = await this.getUploadsData();
    return this.uploadsData.totalPages;
  }

  private async getUploadsData(): Promise<{ page: number, totalPages: number, totalFiles: number, files: Upload[] }> {
    const data = await lastValueFrom(
      this.http.get('/api/uploads', {
        headers: new HttpHeaders({ 'Authorization': `Bearer ${this.authS.getToken()}` }),
        params: new HttpParams().set('page', 0)
      })
    );
    return data as { page: number, totalPages: number, totalFiles: number, files: Upload[] };
  }

  async getFiles(page: number = 1): Promise<{ page: number, files: Upload[] }> {
    if (!isPlatformBrowser(this.platformId)) return { page: 1, files: [] };

    // Nicht laden, wenn über totalPages
    if (this.uploadsData && page > this.uploadsData['totalPages']) {
      throw new Error('Seite größer als die gesamte Anzahl der Seiten');
    };

    // Lade neue Seite
    const result = await lastValueFrom(
      this.http.get('/api/uploads', {
        headers: new HttpHeaders({ 'Authorization': `Bearer ${this.authS.getToken()}` }),
        params: new HttpParams().set('page', page)
      })
    );

    this.uploadsData = result as { page: number, totalPages: number, totalFiles: number, files: Upload[] };
    return ({ page: this.uploadsData['page'], files: this.uploadsData['files'] });
  }

  async getFile(fileName: string, fileType: 'pdf' | 'docx') {
    fileName = fileName + `.${fileType}`;

    const response: any = await fetch('/api/uploads/getFile?' + new URLSearchParams({ fileName }).toString(), {
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
  }

  async getTotalFiles(): Promise<number> {
    if (!isPlatformBrowser(this.platformId)) return 0;
    this.uploadsData = await this.getUploadsData();
    return this.uploadsData.totalFiles
  }

  async getStatistic(): Promise<any> {
    if (!isPlatformBrowser(this.platformId)) return;
    const data = await lastValueFrom(
      this.http.get('/api/statistic', {
        headers: new HttpHeaders({ 'Authorization': `Bearer ${this.authS.getToken()}` })
      })
    );
    return data;
  }

  async deleteUpload(name: string) {
    await lastValueFrom(this.http.delete('/api/uploads/deleteUpload', {
      headers: new HttpHeaders({ 'Authorization': `Bearer ${this.authS.getToken()}` }),
      params: new HttpParams().set('uploadID', name)
    }));
  }

  async deleteFolder() {
    await lastValueFrom(this.http.delete('/api/uploads/', {
      headers: new HttpHeaders({ 'Authorization': `Bearer ${this.authS.getToken()}` })
    }));
  }

  async deleteGeneratedFiles(uploadID: string) {
    await lastValueFrom(this.http.delete('/api/uploads/deleteGeneratedFiles', {
      headers: new HttpHeaders({ 'Authorization': `Bearer ${this.authS.getToken()}` }),
      params: new HttpParams().set('uploadID', uploadID)
    }));
  }

  async deleteAllGeneratedFiles() {
    await lastValueFrom(this.http.delete('/api/uploads/deleteAllGeneratedFiles', {
      headers: new HttpHeaders({ 'Authorization': `Bearer ${this.authS.getToken()}` })
    }));
  }

  async getUploadDatesAndCounts(timeframe: 'week' | 'month'): Promise<{ date: string, count: number }[]> {
    const response = await lastValueFrom(this.http.get('/api/uploads/getUploadCountPerDays', {
      headers: new HttpHeaders({ 'Authorization': `Bearer ${this.authS.getToken()}` }),
      params: new HttpParams().set('timeframe', timeframe)
    }))
    return response as { date: string, count: number }[];
  }
}
