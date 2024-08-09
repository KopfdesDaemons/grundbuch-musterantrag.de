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

  uploadsData: any;
  files: any[] = [];
  loadedPages: number = 0;
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

        const pageToLoad = this.loadedPages + 1;

        // Nicht laden, wenn über totalPages
        if (this.uploadsData && pageToLoad > this.uploadsData['totalPages']) return;

        console.log('Lade Daten der Seite:', pageToLoad);

        // Lade neue Seite
        this.uploadsData = await lastValueFrom(this.http.get('/api/uploads', {
          params: new HttpParams().set('page', this.loadedPages)
        }));

        // Füge neu geladene Dateien hinzu
        for (const file of this.uploadsData['files']) {
          this.files.push(file);
        }

        this.loadedPages++;
        this.isLoading = false;

      } catch (err: any) {
        this.isLoading = false;
        console.error('Die Dateien konnten nicht geladen werden.' + err.error, err);
        if (err.status = 401) this.abmelden();
        reject();
      }
    });
  }

  reloadFiles() {
    this.isLoading = false;
    this.loadedPages = 0;
    this.files = [];
    this.getFiles();
  }

  // Schließe Dropdowns, wenn Klick auf anderen Element
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

  async deleteFile(name: string) {
    await lastValueFrom(this.http.delete('/api/uploads/deleteFiles', {
      params: new HttpParams().set('fileName', name),
      responseType: 'text'
    }));
    this.reloadFiles();
  }

  async deleteFolder() {
    try {
      await lastValueFrom(this.http.delete('/api/uploads/', { responseType: 'text' }));
      this.reloadFiles();
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
