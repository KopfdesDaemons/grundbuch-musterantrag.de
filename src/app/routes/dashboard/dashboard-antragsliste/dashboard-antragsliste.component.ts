import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, linkedSignal, signal, viewChild } from '@angular/core';
import { UploadsService } from 'src/app/services/data/uploads.service';
import { DatePipe, NgClass } from '@angular/common';
import { ErrorDisplayComponent } from '../../../components/error-display/error-display.component';
import { UploadRow } from 'src/app/interfaces/uploadRow';
import { FormsModule } from '@angular/forms';
import { Upload } from 'server/models/upload.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-dashboard-antragsliste',
  templateUrl: './dashboard-antragsliste.component.html',
  styleUrls: ['./dashboard-antragsliste.component.scss'],
  imports: [DatePipe, ErrorDisplayComponent, NgClass, FormsModule]
})
export class DashboardAntragslisteComponent {
  uploadsS = inject(UploadsService);
  error = signal<Error | null>(null);
  selectAllInput = viewChild.required<ElementRef>('selectAllInput');

  private rowsMap = new Map<string, UploadRow>();
  rows = linkedSignal<Upload[], UploadRow[]>({
    source: () => this.uploadsS.uploads(),
    computation: (uploads, previous) => {
      if (!uploads) {
        return previous?.value ?? [];
      }
      return uploads.map(upload => {
        if (this.rowsMap.has(upload.uploadID)) {
          return this.rowsMap.get(upload.uploadID)!;
        }
        const newRow: UploadRow = { isChecked: signal(false), upload: upload, editMode: false };
        this.rowsMap.set(upload.uploadID, newRow);
        return newRow;
      });
    }
  });

  selectedRows = computed<UploadRow[]>(() => this.rows().filter(row => row.isChecked()));
  selectedRowsWithGeneratedFiles = computed<UploadRow[]>(() => this.selectedRows().filter(row => row.upload.filesDeleted === false));

  scroll(element: any) {
    if (element.scrollTop > element.scrollHeight - element.clientHeight - 150) {
      if (!this.uploadsS.uploadsResource.isLoading()) this.loadPage(this.uploadsS.loadedPages() + 1);
    }
  }

  private loadPage(pageNumber: number) {
    if (!this.uploadsS.totalPages()) return;
    if (pageNumber > this.uploadsS.totalPages()!) return;
    this.uploadsS.pageToLoad.set(pageNumber);
    this.uploadsS.uploadsResource.reload();
  }

  reloadFiles() {
    this.error.set(null);
    this.uploadsS.uploads.set([]);
    this.rowsMap.clear();
    this.uploadsS.pageToLoad.set(1);
    this.uploadsS.uploadsResource.reload();
    this.selectAllInput().nativeElement.checked = false;
  }

  async deleteUpload(uploadID: string) {
    try {
      this.error.set(null);
      await this.uploadsS.deleteUpload([uploadID]);
      this.reloadFiles();
    } catch (error) {
      if (error instanceof Error || error instanceof HttpErrorResponse) {
        this.error.set(error);
      }
    }
  }

  async deleteSelectedUploads() {
    try {
      this.error.set(null);
      const selectedUploadIDs = this.selectedRows().map(row => row.upload.uploadID);
      if (selectedUploadIDs.length === 0) return;
      if (!confirm(`Soll wirklich ${selectedUploadIDs.length} ausgewählte Antragsdaten gelöscht werden?`)) return;
      await this.uploadsS.deleteUpload(selectedUploadIDs);
      this.reloadFiles();
    } catch (error) {
      if (error instanceof Error || error instanceof HttpErrorResponse) {
        this.error.set(error);
      }
    }
  }

  async deleteGeneratedFilesForSelectedUploads() {
    try {
      this.error.set(null);
      const selectedUploadIDs = this.selectedRowsWithGeneratedFiles().map(row => row.upload.uploadID);
      if (selectedUploadIDs.length === 0) return;
      if (!confirm(`Soll wirklich die generierten Dateien für ${selectedUploadIDs.length} ausgewählte Anträge gelöscht werden?`)) return;
      for (const id of selectedUploadIDs) {
        await this.uploadsS.deleteGeneratedFiles(id);
      }
      this.reloadFiles();
    } catch (error) {
      if (error instanceof Error || error instanceof HttpErrorResponse) {
        this.error.set(error);
      }
    }
  }

  selectAll(value: boolean) {
    this.rows().forEach(row => row.isChecked.set(value));
  }

  async deleteGeneratedFiles(uploadID: string) {
    try {
      this.error.set(null);
      await this.uploadsS.deleteGeneratedFiles(uploadID);
      this.reloadFiles();
    } catch (error) {
      if (error instanceof Error || error instanceof HttpErrorResponse) {
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
      if (error instanceof Error || error instanceof HttpErrorResponse) {
        this.error.set(error);
      }
    }
  }

  async getFile(fileName: string, fileType: 'pdf' | 'odt') {
    try {
      this.error.set(null);
      await this.uploadsS.getFile(fileName, fileType);
    } catch (error: unknown) {
      if (error instanceof Error || error instanceof HttpErrorResponse) {
        this.error.set(error);
      }
    }
  }
}
