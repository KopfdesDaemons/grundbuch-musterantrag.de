import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, ElementRef, HostListener, inject, signal } from '@angular/core';
import { AuthService } from 'src/app/services/user/auth.service';
import { UploadsService } from 'src/app/services/data/uploads.service';
import { DatePipe, NgClass } from '@angular/common';
import { ErrorDisplayComponent } from '../../../components/error-display/error-display.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-dashboard-antragsliste',
  templateUrl: './dashboard-antragsliste.component.html',
  styleUrls: ['./dashboard-antragsliste.component.scss'],
  imports: [DatePipe, ErrorDisplayComponent, NgClass]
})
export class DashboardAntragslisteComponent {
  private elem = inject(ElementRef);
  http = inject(HttpClient);
  authS = inject(AuthService);
  uploadsS = inject(UploadsService);

  error = signal<HttpErrorResponse | null>(null);

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

  async deleteUpload(name: string) {
    try {
      this.error.set(null);
      await this.uploadsS.deleteUpload(name);
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

  /* 
    Schließt Dropdowns, wenn Klick auf anderen Element
  */
  @HostListener('document:click', ['$event']) onDocumentClick(event: any) {
    const dropDowns = this.elem.nativeElement.querySelectorAll('.dropDown');

    for (const dropdown of dropDowns) {
      const ul = dropdown.querySelector('ul');

      if (ul.style.visibility === 'visible') {
        if (!dropdown.contains(event.target)) {
          ul.style.visibility = 'collapse';
        }
      }
    }
  }

  clickOnDropdown(element: any) {
    const dropdown = element.closest('.dropDown') as HTMLElement;
    const ulElement = dropdown.querySelector('.dropDownMenu') as HTMLElement;

    if (ulElement) ulElement.style.visibility = 'visible';
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
