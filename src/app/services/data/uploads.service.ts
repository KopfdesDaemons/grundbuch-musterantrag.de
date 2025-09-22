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

  pageToLoad = signal<number>(0);

  uploadsResource = httpResource<UploadData>(() => ({
    url: '/api/uploads',
    params: {
      page: this.pageToLoad()
    }
  }));

  uploads = linkedSignal<UploadData | undefined, Upload[]>({
    source: () => this.uploadsResource.value(),
    computation: (source, previous) => {
      if (!source) {
        return previous?.value ?? [];
      }

      // When loading page 0, start a new list.
      if (source.page === 0) {
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

  loadedPages = computed(() => {
    if (!this.uploadsResource.hasValue()) return 0;
    return this.uploadsResource.value().page;
  });

  totalPages = computed<number | undefined>(() => (this.uploadsResource.hasValue() ? this.uploadsResource.value()?.totalPages : undefined));
  totalFiles = computed<number | undefined>(() => (this.uploadsResource.hasValue() ? this.uploadsResource.value()?.totalFiles : undefined));

  latestFile = computed<Upload | null>(() => {
    const files = this.uploadsResource.value()?.files ?? [];
    if (files.length === 0) return null;
    return files[0];
  });

  statisticResourceWeek = httpResource<{ date: string; count: number }[]>(() => ({
    url: '/api/uploads/getUploadCountPerDays',
    params: {
      timeframe: 'week'
    }
  }));

  statisticResourceMonth = httpResource<{ date: string; count: number }[]>(() => ({
    url: '/api/uploads/getUploadCountPerDays',
    params: {
      timeframe: 'month'
    }
  }));

  totalUploadsByTypResource = httpResource<{ [key: string]: number }>(() => ({
    url: '/api/statistic'
  }));

  totalUploadsByTyp = computed<{ antragsart: string; anzahl: number }[]>(() => {
    const json = this.totalUploadsByTypResource.value();
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

  async deleteUpload(name: string) {
    await lastValueFrom(
      this.http.delete('/api/uploads/deleteUpload', {
        params: new HttpParams().set('uploadID', name)
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
