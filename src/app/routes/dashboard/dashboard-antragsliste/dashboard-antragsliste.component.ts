import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, HostListener, inject, OnInit } from '@angular/core';
import { CookiesService } from 'src/app/services/utils/cookies.service';
import { Title } from '@angular/platform-browser';
import { AuthService } from 'src/app/services/user/auth.service';
import { UploadsService } from 'src/app/services/data/uploads.service';
import { LoggerService } from 'src/app/services/server/logger.service';
import { Upload } from 'server/models/upload.model';
import { DatePipe } from '@angular/common';
import { ErrorDisplayComponent } from '../../../components/error-display/error-display.component';

@Component({
  selector: 'app-dashboard-antragsliste',
  templateUrl: './dashboard-antragsliste.component.html',
  styleUrls: ['./dashboard-antragsliste.component.scss'],
  imports: [DatePipe, ErrorDisplayComponent]
})
export class DashboardAntragslisteComponent implements OnInit {
  private elem = inject(ElementRef);
  http = inject(HttpClient);
  cs = inject(CookiesService);
  authS = inject(AuthService);
  uploadsdS = inject(UploadsService);
  loggerS = inject(LoggerService);
  titleService = inject(Title);

  files: Upload[] = [];
  private loadedPages: number = 0;
  totalPages: number = 0;
  totalFiles: number = 0;
  isLoadingNextPage: boolean = false;
  error: HttpErrorResponse | null = null;

  async ngOnInit() {
    this.titleService.setTitle('Dashboard');
    await this.reloadFiles();
  }

  async scroll(element: any) {
    if (element.scrollTop > element.scrollHeight - element.clientHeight - 150) {
      if (!this.isLoadingNextPage) await this.loadPage(this.loadedPages + 1);
    }
  }

  async loadPage(pageNumber: number = 1) {
    if (pageNumber > this.totalPages) return;
    try {
      this.error = null;
      this.isLoadingNextPage = true;
      const { page, files } = await this.uploadsdS.getFiles(pageNumber);
      this.loadedPages = page;
      this.files = this.files.concat(files);
      this.isLoadingNextPage = false;
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        this.error = error;
      }
    }
    this.isLoadingNextPage = false;
  }

  async reloadFiles() {
    try {
      this.error = null;
      this.loadedPages = 0;
      this.totalPages = await this.uploadsdS.getTotalPages();
      this.totalFiles = await this.uploadsdS.getTotalFiles();
      this.files = [];
      await this.loadPage();
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        this.error = error;
      }
    }
  }

  async deleteUpload(name: string) {
    try {
      this.error = null;
      await this.uploadsdS.deleteUpload(name);
      await this.reloadFiles();
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        this.error = error;
      }
    }
  }

  async deleteGeneratedFiles(uploadID: string) {
    try {
      this.error = null;
      await this.uploadsdS.deleteGeneratedFiles(uploadID);
      await this.reloadFiles();
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        this.error = error;
      }
    }
  }

  async deleteFolder() {
    try {
      this.error = null;
      if (!confirm('Soll wirklich alle Antragsdaten gelöscht werden?')) return;
      await this.uploadsdS.deleteFolder();
      await this.reloadFiles();
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        this.error = error;
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
      this.error = null;
      await this.uploadsdS.getFile(fileName, fileType);
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        this.error = error;
      }
    }
  }
}
