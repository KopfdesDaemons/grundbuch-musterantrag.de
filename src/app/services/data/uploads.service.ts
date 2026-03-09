import { HttpClient, HttpParams } from '@angular/common/http';
import { DOCUMENT, inject, Injectable, linkedSignal } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Upload } from 'common/models/upload.model';
import { PaginatedDataService } from './paginated-data.service';
import { PaginatedApiResponse } from 'common/interfaces/pagination-data.interface';

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

  readonly latestFile = linkedSignal<PaginatedApiResponse<Upload> | undefined, Upload | null>({
    source: () => (this.uploadsData.hasValue() ? this.uploadsData.value() : undefined),
    computation: (source, previous) => {
      const files = source?.items ?? [];
      if (this.uploadsData.value()?.page !== 1) return previous?.value ?? null;
      if (files.length === 0) return null;
      return files[0];
    }
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
