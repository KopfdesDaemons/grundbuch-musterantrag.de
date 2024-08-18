import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { faRotateRight, faCircleExclamation, faCircleDown, faArrowUpRightFromSquare, faEllipsisVertical, faArrowRightFromBracket, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { CookiesService } from 'src/app/services/cookies.service';
import { Title } from '@angular/platform-browser';
import { AuthService } from 'src/app/services/auth.service';
import { UploadsService } from 'src/app/services/uploads.service';
import { LoggerService } from 'src/app/services/logger.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [HeaderComponent, FaIconComponent]
})

export class DashboardComponent implements OnInit {
  faRotateRight = faRotateRight;
  faCircleExclamation = faCircleExclamation;
  faCircleDown = faCircleDown;
  faArrowUpRightFromSquare = faArrowUpRightFromSquare;
  faEllipsisVertical = faEllipsisVertical;
  faArrowRightFromBracket = faArrowRightFromBracket;
  faTrashCan = faTrashCan;

  files: any[] = [];
  private loadedPages: number = 0;
  totalPages: number = 0;
  isLoadingNextPage: boolean = false;

  constructor(
    public http: HttpClient,
    private elem: ElementRef,
    public cs: CookiesService,
    public authS: AuthService,
    public uploadsdS: UploadsService,
    public loggerS: LoggerService,
    public titleService: Title) {
    this.titleService.setTitle('Dashboard');
  }

  async ngOnInit() {
    this.totalPages = await this.uploadsdS.getTotalPages();
    this.loadPage();
  }

  scroll(element: any) {
    if (element.scrollTop > element.scrollHeight - element.clientHeight - 150) {
      if (!this.isLoadingNextPage) this.loadPage(this.loadedPages + 1);
    }
  }

  async loadPage(pageNumber: number = 1) {
    try {
      this.isLoadingNextPage = true;
      const { page, files } = await this.uploadsdS.getFiles(pageNumber);
      this.loadedPages = page;
      this.files = this.files.concat(files);
      this.isLoadingNextPage = false;
    } catch (err: any) {
      this.isLoadingNextPage = false;
    }
  }

  async reloadFiles() {
    this.loadedPages = 0;
    this.files = [];
    this.totalPages = await this.uploadsdS.getTotalPages();
    this.loadPage();
  }

  async deleteFile(name: string) {
    await this.uploadsdS.deleteFile(name);
    this.reloadFiles();
  }

  deleteFolder() {
    this.uploadsdS.deleteFolder();
    this.reloadFiles();
  }

  /* 
    Schließe Dropdowns, wenn Klick auf anderen Element
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
