import { HttpClient, HttpParams } from '@angular/common/http';
import { DOCUMENT, inject, Injectable, PLATFORM_ID } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { AuthService } from '../user/auth.service';
import { isPlatformBrowser } from '@angular/common';
import { Upload } from 'server/models/upload.model';

@Injectable({
  providedIn: 'root'
})
export class UploadsService {
  private http = inject(HttpClient);
  private authS = inject(AuthService);
  private document = inject(DOCUMENT);
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

  private async getUploadsData(): Promise<{ page: number; totalPages: number; totalFiles: number; files: Upload[] }> {
    const data = await lastValueFrom(
      this.http.get('/api/uploads', {
        headers: this.authS.getAuthHeader(),
        params: new HttpParams().set('page', 0)
      })
    );
    return data as { page: number; totalPages: number; totalFiles: number; files: Upload[] };
  }

  async getFiles(page: number = 1): Promise<{ page: number; files: Upload[] }> {
    if (!isPlatformBrowser(this.platformId)) return { page: 1, files: [] };

    // no load if page is greater than total pages
    if (this.uploadsData && page > this.uploadsData['totalPages']) {
      throw new Error('Seite größer als die gesamte Anzahl der Seiten');
    }

    // reload uploadsData
    const result = await lastValueFrom(
      this.http.get('/api/uploads', {
        headers: this.authS.getAuthHeader(),
        params: new HttpParams().set('page', page)
      })
    );

    this.uploadsData = result as { page: number; totalPages: number; totalFiles: number; files: Upload[] };
    return { page: this.uploadsData['page'], files: this.uploadsData['files'] };
  }

  async getFile(fileName: string, fileType: 'pdf' | 'odt') {
    fileName = `${fileName}.${fileType}`;

    const response = await lastValueFrom(
      this.http.get('/api/uploads/getFile', {
        headers: this.authS.getAuthHeader(),
        params: new HttpParams().set('fileName', fileName),
        responseType: 'blob'
      })
    );

    const contentType = fileType === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

    const blob = new Blob([response], { type: contentType });
    const blobUrl = URL.createObjectURL(blob);

    // open pdf in new tab
    if (fileType === 'pdf') {
      window.open(blobUrl, '_blank');
      return;
    }

    // odt download
    const link = this.document.createElement('a');
    link.href = blobUrl;
    link.download = fileName;
    this.document.body.appendChild(link);
    link.click();
    this.document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  }

  async getTotalFiles(): Promise<number> {
    if (!isPlatformBrowser(this.platformId)) return 0;
    this.uploadsData = await this.getUploadsData();
    return this.uploadsData.totalFiles;
  }

  async getStatistic(): Promise<{ [key: string]: number }> {
    if (!isPlatformBrowser(this.platformId)) return {};
    const data = await lastValueFrom(
      this.http.get('/api/statistic', {
        headers: this.authS.getAuthHeader()
      })
    );
    return data as { [key: string]: number };
  }

  async deleteUpload(name: string) {
    await lastValueFrom(
      this.http.delete('/api/uploads/deleteUpload', {
        headers: this.authS.getAuthHeader(),
        params: new HttpParams().set('uploadID', name)
      })
    );
  }

  async deleteFolder() {
    await lastValueFrom(
      this.http.delete('/api/uploads/', {
        headers: this.authS.getAuthHeader()
      })
    );
  }

  async deleteGeneratedFiles(uploadID: string) {
    await lastValueFrom(
      this.http.delete('/api/uploads/deleteGeneratedFiles', {
        headers: this.authS.getAuthHeader(),
        params: new HttpParams().set('uploadID', uploadID)
      })
    );
  }

  async deleteAllGeneratedFiles() {
    await lastValueFrom(
      this.http.delete('/api/uploads/deleteAllGeneratedFiles', {
        headers: this.authS.getAuthHeader()
      })
    );
  }

  async getUploadDatesAndCounts(timeframe: 'week' | 'month'): Promise<{ date: string; count: number }[]> {
    const response = await lastValueFrom(
      this.http.get('/api/uploads/getUploadCountPerDays', {
        headers: this.authS.getAuthHeader(),
        params: new HttpParams().set('timeframe', timeframe)
      })
    );
    return response as { date: string; count: number }[];
  }
}
