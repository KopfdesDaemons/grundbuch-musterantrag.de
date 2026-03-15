import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { PaginatedDataService } from './paginated-data.service';

@Injectable({
  providedIn: 'root'
})
export class BackupService {
  private http = inject(HttpClient);

  private readonly paginatedDataService = new PaginatedDataService<string>();

  constructor() {
    this.paginatedDataService.init('/api/backup', backupFileName => backupFileName);
  }

  setPageToLoad = this.paginatedDataService.setPageToLoad.bind(this.paginatedDataService);
  loadBackupList = this.paginatedDataService.loadData.bind(this.paginatedDataService);
  resetBackupList = this.paginatedDataService.resetItems.bind(this.paginatedDataService);

  readonly backupListData = this.paginatedDataService.data;
  readonly backupList = this.paginatedDataService.items;
  readonly loadedPages = this.paginatedDataService.loadedPages;
  readonly totalPages = this.paginatedDataService.totalPages;
  readonly totalFiles = this.paginatedDataService.totalItems;

  async createNewBackup(): Promise<{ message: string }> {
    return (await lastValueFrom(this.http.post('/api/backup', {}))) as { message: string };
  }

  async restoreBackupByFileUpload(file: File): Promise<{ message: string }> {
    const formData = new FormData();
    formData.append('backupFile', file);
    return (await lastValueFrom(this.http.post('/api/backup/restoreByFileUpload', formData))) as { message: string };
  }

  async restoreBackupByFileName(fileName: string): Promise<{ message: string }> {
    const params = { backupFileName: fileName };
    return (await lastValueFrom(this.http.post('/api/backup/restoreByFileName', {}, { params }))) as { message: string };
  }
}
