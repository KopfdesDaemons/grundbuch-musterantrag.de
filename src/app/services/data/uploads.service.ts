import { HttpClient, HttpParams, httpResource } from '@angular/common/http';
import { computed, DOCUMENT, inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Upload } from 'common/models/upload.model';
import { PaginatedDataService } from './paginated-data.service';

@Injectable({
  providedIn: 'root'
})
export class UploadsService {
  private readonly http = inject(HttpClient);
  private readonly document = inject(DOCUMENT);
  private readonly paginatedDataService = new PaginatedDataService<Upload>();

  constructor() {
    this.paginatedDataService.init('/api/uploads', upload => upload.uploadID);
  }

  setPageToLoad = this.paginatedDataService.setPageToLoad.bind(this.paginatedDataService);
  loadUploads = this.paginatedDataService.loadData.bind(this.paginatedDataService);
  resetUploads = this.paginatedDataService.resetItems.bind(this.paginatedDataService);

  readonly uploadsData = this.paginatedDataService.data;
  readonly uploads = this.paginatedDataService.items;
  readonly loadedPages = this.paginatedDataService.loadedPages;
  readonly totalPages = this.paginatedDataService.totalPages;
  readonly totalFiles = this.paginatedDataService.totalItems;

  readonly latestFile = computed<Upload | null>(() => {
    const files = this.uploadsData.value()?.items ?? [];
    if (files.length === 0) return null;
    return files[0];
  });

  private readonly _statisticResourceWeek = httpResource<{ date: string; count: number }[]>(() => ({
    url: '/api/uploads/getUploadCountPerDays',
    params: {
      timeframe: 'week'
    }
  }));

  readonly statisticResourceWeek = this._statisticResourceWeek.asReadonly();

  reloadStatisticWeek() {
    this._statisticResourceWeek.reload();
  }

  private readonly _statisticResourceMonth = httpResource<{ date: string; count: number }[]>(() => ({
    url: '/api/uploads/getUploadCountPerDays',
    params: {
      timeframe: 'month'
    }
  }));

  readonly statisticResourceMonth = this._statisticResourceMonth.asReadonly();

  reloadStatisticMonth() {
    this._statisticResourceMonth.reload();
  }

  private readonly _totalUploadsByTypResource = httpResource<{ [key: string]: number }>(() => ({
    url: '/api/statistic'
  }));

  readonly totalUploadsByTypResource = this._totalUploadsByTypResource.asReadonly();

  reloadUploadsByTyp() {
    this._totalUploadsByTypResource.reload();
  }

  readonly totalUploadsByTyp = computed<{ antragsart: string; anzahl: number }[]>(() => {
    const json = this._totalUploadsByTypResource.value();
    if (!json) return [];
    const statisticArray = Object.entries(json).map(([key, value]) => ({ antragsart: key, anzahl: value }));
    return statisticArray.sort((a, b) => b.anzahl - a.anzahl);
  });

  async getFile(fileName: string, fileType: 'pdf' | 'odt') {
    fileName = `${fileName}.${fileType}`;

    const response = await lastValueFrom(
      this.http.get('/api/uploads/getFile', {
        params: new HttpParams().set('fileName', fileName),
        responseType: 'blob'
      })
    );

    const contentType = fileType === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

    const blob = new Blob([response], { type: contentType });
    const blobUrl = URL.createObjectURL(blob);

    // Open pdf in new tab
    if (fileType === 'pdf') {
      window.open(blobUrl, '_blank');
      return;
    }

    // Odt download
    const link = this.document.createElement('a');
    link.href = blobUrl;
    link.download = fileName;
    this.document.body.appendChild(link);
    link.click();
    this.document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  }

  async deleteUpload(UploadIDs: string[]) {
    await lastValueFrom(
      this.http.delete('/api/uploads/deleteUpload', {
        params: new HttpParams().set('uploadIDs', UploadIDs.toString())
      })
    );
  }

  async deleteFolder() {
    await lastValueFrom(this.http.delete('/api/uploads/'));
  }

  async deleteGeneratedFiles(uploadID: string) {
    await lastValueFrom(
      this.http.delete('/api/uploads/deleteGeneratedFiles', {
        params: new HttpParams().set('uploadID', uploadID)
      })
    );
  }

  async deleteAllGeneratedFiles() {
    await lastValueFrom(this.http.delete('/api/uploads/deleteAllGeneratedFiles'));
  }
}
