import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { UploadsService } from 'src/app/services/data/uploads.service';
import { DatePipe, NgClass } from '@angular/common';
import { ErrorDisplayComponent } from '../../../components/error-display/error-display.component';
import { UploadRow } from 'src/app/interfaces/uploadRow';
import { FormsModule } from '@angular/forms';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-dashboard-antragsliste',
  templateUrl: './dashboard-antragsliste.component.html',
  styleUrls: ['./dashboard-antragsliste.component.scss'],
  imports: [DatePipe, ErrorDisplayComponent, NgClass, FormsModule]
})
export class DashboardAntragslisteComponent {
  uploadsS = inject(UploadsService);

  error = signal<HttpErrorResponse | null>(null);

  rows = computed<UploadRow[]>(() => {
    const upload = this.uploadsS.uploads();
    if (!upload) return [];
    return upload.map(upload => ({ isChecked: false, upload: upload, editMode: false }));
  });

  scroll(element: any) {
    if (element.scrollTop > element.scrollHeight - element.clientHeight - 150) {
      if (!this.uploadsS.uploadsResource.isLoading()) this.loadPage(this.uploadsS.loadedPages() + 1);
    }
  }

  loadPage(pageNumber: number) {
    if (!this.uploadsS.totalPages()) return;
    if (pageNumber > this.uploadsS.totalPages()!) return;
    this.uploadsS.pageToLoad.set(pageNumber);
    this.uploadsS.uploadsResource.reload();
  }

  reloadFiles() {
    this.error.set(null);
    this.uploadsS.uploads.set([]);
    this.uploadsS.pageToLoad.set(0);
    this.uploadsS.uploadsResource.reload();
  }

  async deleteUpload(uploadID: string) {
    try {
      this.error.set(null);
      await this.uploadsS.deleteUpload([uploadID]);
      this.reloadFiles();
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        this.error.set(error);
      }
    }
  }

  async deleteSelectedUploads() {
    try {
      this.error.set(null);
      const selectedUploadIDs = this.rows()
        .filter(row => row.isChecked)
        .map(row => row.upload.uploadID);
      if (selectedUploadIDs.length === 0) return;
      if (!confirm(`Soll wirklich ${selectedUploadIDs.length} ausgewählte Antragsdaten gelöscht werden?`)) return;
      await this.uploadsS.deleteUpload(selectedUploadIDs);
      this.reloadFiles();
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        this.error.set(error);
      }
    }
  }

  async deleteGeneratedFiles(uploadID: string) {
    try {
      this.error.set(null);
      await this.uploadsS.deleteGeneratedFiles(uploadID);
      this.reloadFiles();
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        this.error.set(error);
      }
    }
  }

  async deleteFolder() {
    try {
      this.error.set(null);
      if (!confirm('Soll wirklich alle Antragsdaten gelöscht werden?')) return;
      await this.uploadsS.deleteFolder();
      this.reloadFiles();
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        this.error.set(error);
      }
    }
  }

  async getFile(fileName: string, fileType: 'pdf' | 'odt') {
    try {
      this.error.set(null);
      await this.uploadsS.getFile(fileName, fileType);
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        this.error.set(error);
      }
    }
  }
}
