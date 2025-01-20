import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, HostListener, inject, OnInit } from '@angular/core';
import { faRotateRight, faCircleExclamation, faCircleDown, faArrowUpRightFromSquare, faEllipsisVertical, faCheck } from '@fortawesome/free-solid-svg-icons';
import { CookiesService } from 'src/app/services/cookies.service';
import { Title } from '@angular/platform-browser';
import { AuthService } from 'src/app/services/auth.service';
import { UploadsService } from 'src/app/services/uploads.service';
import { LoggerService } from 'src/app/services/logger.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { Upload } from 'server/models/upload';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard-antragsliste',
  templateUrl: './dashboard-antragsliste.component.html',
  styleUrls: ['./dashboard-antragsliste.component.scss'],
  imports: [FaIconComponent, DatePipe]
})

export class DashboardAntragslisteComponent implements OnInit {
  private elem = inject(ElementRef);
  http = inject(HttpClient);
  cs = inject(CookiesService);
  authS = inject(AuthService);
  uploadsdS = inject(UploadsService);
  loggerS = inject(LoggerService);
  titleService = inject(Title);

  // Fontawesome Icons
  faRotateRight = faRotateRight;
  faCircleExclamation = faCircleExclamation;
  faCircleDown = faCircleDown;
  faArrowUpRightFromSquare = faArrowUpRightFromSquare;
  faEllipsisVertical = faEllipsisVertical;
  faCheck = faCheck;

  files: Upload[] = [];
  private loadedPages: number = 0;
  totalPages: number = 0;
  totalFiles: number = 0;
  isLoadingNextPage: boolean = false;

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
      this.isLoadingNextPage = true;
      const { page, files } = await this.uploadsdS.getFiles(pageNumber);
      this.loadedPages = page;
      this.files = this.files.concat(files);
      this.isLoadingNextPage = false;
    } catch {
      this.isLoadingNextPage = false;
    }
  }

  async reloadFiles() {
    this.loadedPages = 0;
    this.totalPages = await this.uploadsdS.getTotalPages();
    this.totalFiles = await this.uploadsdS.getTotalFiles();
    this.files = [];
    await this.loadPage();
  }

  async deleteUpload(name: string) {
    await this.uploadsdS.deleteUpload(name);
    await this.reloadFiles();
  }

  async deleteGeneratedFiles(uploadID: string) {
    await this.uploadsdS.deleteGeneratedFiles(uploadID);
    await this.reloadFiles();
  }

  async deleteFolder() {
    if (!confirm('Soll wirklich alle Antragsdaten gelöscht werden?')) return;
    await this.uploadsdS.deleteFolder();
    await this.reloadFiles();
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
}
