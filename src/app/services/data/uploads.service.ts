import { HttpClient, HttpParams, httpResource } from '@angular/common/http';
import { computed, DOCUMENT, inject, Injectable, linkedSignal, signal } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Upload } from 'server/models/upload.model';
import { UploadData } from 'src/app/interfaces/uploadData';

@Injectable({
  providedIn: 'root'
})
export class UploadsService {
  private http = inject(HttpClient);
  private document = inject(DOCUMENT);

  private _pageToLoadSignal = signal<number>(1);
  readonly pageToLoad = this._pageToLoadSignal.asReadonly();

  setPageToLoad(value: number) {
    this._pageToLoadSignal.set(value);
  }

  private readonly _uploadsDataResource = httpResource<UploadData>(() => ({
    url: '/api/uploads',
    params: {
      page: this._pageToLoadSignal()
    }
  }));

  readonly uploadsData = this._uploadsDataResource.asReadonly();

  loadUploads() {
    this._uploadsDataResource.reload();
  }

  private uploadsSignal = linkedSignal<UploadData | undefined, Upload[]>({
    source: () => (this.uploadsData.hasValue() ? this.uploadsData.value() : undefined),
    computation: (source, previous) => {
      if (!source) {
        return previous?.value ?? [];
      }

      // When loading page 1, start a new list.
      if (source.page === 1) {
        return source.files;
      }

      // For subsequent pages, we append to the existing list.
      if (previous?.value && Array.isArray(previous.value)) {
        return previous.value.concat(source.files);
      }

      // Fallback
      return source.files;
    }
  });

  readonly uploads = this.uploadsSignal.asReadonly();

  resetUploads() {
    this.uploadsSignal.set([]);
  }

  readonly loadedPages = computed(() => {
    if (!this.uploadsData.hasValue()) return 0;
    return this.uploadsData.value().page;
  });

  readonly totalPages = computed<number | undefined>(() => (this.uploadsData.hasValue() ? this.uploadsData.value()?.totalPages : undefined));
  readonly totalFiles = linkedSignal<UploadData | undefined, number | undefined>({
    source: () => (this.uploadsData.hasValue() ? this.uploadsData.value() : undefined),
    computation: (source, previous) => {
      return source ? source.totalFiles : previous?.value;
    }
  }).asReadonly();

  readonly latestFile = computed<Upload | null>(() => {
    const files = this.uploadsData.value()?.files ?? [];
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
