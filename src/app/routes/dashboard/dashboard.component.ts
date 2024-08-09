import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import {
  faRotateRight,
  faCircleExclamation,
  faCircleDown,
  faArrowUpRightFromSquare,
  faEllipsisVertical,
  faArrowRightFromBracket,
  faTrashCan
} from '@fortawesome/free-solid-svg-icons';
import { CookiesService } from 'src/app/services/cookies.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  faRotateRight = faRotateRight;
  faCircleExclamation = faCircleExclamation;
  faCircleDown = faCircleDown;
  faArrowUpRightFromSquare = faArrowUpRightFromSquare;
  faEllipsisVertical = faEllipsisVertical;
  faArrowRightFromBracket = faArrowRightFromBracket;
  faTrashCan = faTrashCan;

  infoJson: any;
  files: any[] | undefined;
  page: number = 1;
  isLoading = false;

  constructor(public http: HttpClient, private elem: ElementRef, public cs: CookiesService, private router: Router, public titleService: Title) {
    this.titleService.setTitle('Dashboard');
  }

  ngOnInit() {
    this.getFiles();
  }

  scroll(element: any) {
    if (element.scrollTop > element.scrollHeight - element.clientHeight - 150) {
      this.getFiles();
    }
  }

  async getFiles() {
    return new Promise(async (resolve, reject) => {
      try {
        if (this.isLoading) return;
        this.isLoading = true;
        console.log('Lade Daten...');
        if (this.infoJson && this.page > this.infoJson['totalPages']) return;
        if (!this.files) this.files = [];
        const url = '/api/uploads';
        const json: any = await lastValueFrom(this.http.get(url, { params: new HttpParams().set('page', this.page) }));
        this.infoJson = json;

        for (const file of json['files']) {
          this.files.push(file);
        }
        if (this.infoJson['totalPages'] != 0) this.page++;
        this.isLoading = false;
      } catch (err: any) {
        this.isLoading = false;
        console.error('Die Dateien konnten nicht geladen werden.' + err.error, err);
        if (err.status = 401) this.abmelden();
        reject();
      }
    });
  }

  neuLaden() {
    this.isLoading = false;
    this.page = 0;
    this.files = [];
    this.getFiles();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: any) {
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

  click(element: any) {
    const dropdown = element.closest('.dropDown') as HTMLElement;
    const ulElement = dropdown.querySelector('.dropDownMenu') as HTMLElement;

    if (ulElement) ulElement.style.visibility = 'visible';
  }

  async deleteFile(name: string) {
    await lastValueFrom(this.http.delete('/api/uploads/deleteFiles', {
      params: new HttpParams().set('fileName', name),
      responseType: 'text'
    }));
    this.neuLaden();
  }

  async deleteFolder() {
    try {
      await lastValueFrom(this.http.delete('/api/uploads/', { responseType: 'text' }));
      this.neuLaden();
    } catch (error) {
      console.error('Error beim Löschen des Ordners:', error);
    }
  }

  async deleteLogFile() {
    try {
      await lastValueFrom(this.http.delete('/api/deleteLogFile/', { responseType: 'text' }));
      alert('Logfile gelöscht')
    } catch (error) {
      console.error('Error beim Löschen des Ordners:', error);
    }
  }

  abmelden() {
    this.cs.deleteCookie('loginToken');
    console.log('Abmeldung erfolgt');
    this.router.navigate(['/']);
  }
}
