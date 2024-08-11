import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { faRotateRight, faCircleExclamation, faCircleDown, faArrowUpRightFromSquare, faEllipsisVertical, faArrowRightFromBracket, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { CookiesService } from 'src/app/services/cookies.service';
import { Title } from '@angular/platform-browser';
import { AuthService } from 'src/app/services/auth.service';
import FileSaver, { saveAs } from 'file-saver';

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

  constructor(
    public http: HttpClient,
    private elem: ElementRef,
    public cs: CookiesService,
    private authS: AuthService,
    public titleService: Title) {
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
        this.uploadsData = await lastValueFrom(
          this.http.get('/api/uploads', {
            headers: new HttpHeaders({ 'Authorization': `Bearer ${this.authS.getToken()}` }),
            params: new HttpParams().set('page', this.loadedPages)
          })
        );

        // Füge neu geladene Dateien hinzu
        for (const file of this.uploadsData['files']) {
          this.files.push(file);
        }

        this.loadedPages++;
        this.isLoading = false;

      } catch (err: any) {
        this.isLoading = false;
        console.error('Die Dateien konnten nicht geladen werden.' + err.error, err);
        console.log(err.status);

        if (err.status === 403) this.abmelden();
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
      headers: new HttpHeaders({ 'Authorization': `Bearer ${this.authS.getToken()}` }),
      params: new HttpParams().set('fileName', name),
      responseType: 'text'
    }));
    this.reloadFiles();
  }

  async deleteFolder() {
    try {
      await lastValueFrom(this.http.delete('/api/uploads/', {
        headers: new HttpHeaders({ 'Authorization': `Bearer ${this.authS.getToken()}` }),
        responseType: 'text'
      }));
      this.reloadFiles();
    } catch (error: any) {
      console.error('Error beim Löschen des Ordners:', error);
    }
  }

  async getLogFile() {
    try {
      const response: any = await lastValueFrom(
        this.http.get('/api/getLogFile', {
          headers: new HttpHeaders({ 'Authorization': `Bearer ${this.authS.getToken()}` }),
          responseType: 'json' || 'text'
        })
      );
      window.open(URL.createObjectURL(new Blob([response])), '_blank');
    } catch (error) {
      console.error('Error beim Abrufen des Logs:', error);
    }
  }

  async deleteLogFile() {
    try {
      await lastValueFrom(this.http.delete('/api/deleteLogFile/', {
        headers: new HttpHeaders({ 'Authorization': `Bearer ${this.authS.getToken()}` }),
        responseType: 'text'
      }));
      alert('Logfile gelöscht')
    } catch (error) {
      console.error('Error beim Löschen des Ordners:', error);
    }
  }

  async getFile(fileName: string, fileType: 'pdf' | 'docx') {
    fileName = fileName + `.${fileType}`;

    try {
      const response: any = await fetch('/api/uploads/getFile?' + new URLSearchParams({ fileName }), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.authS.getToken()}`,
        }
      });

      if (!response.ok) {
        throw new Error(`Netzwerkantwort war nicht ok: ${response.statusText}`);
      }

      const contentType = fileType === 'pdf'
        ? 'application/pdf'
        : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

      // DOCX aus dem body auslesen
      const reader = response.body.getReader();
      const chunks: Uint8Array[] = [];
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
      }

      const file = new window.Blob(chunks, { type: contentType });

      // PDF in neuen Tab öffnen
      if (fileType === 'pdf') {
        window.open(URL.createObjectURL(file), '_blank');
        return;
      }

      // DOCX als Datei speichern
      FileSaver.saveAs(file, fileName);

    } catch (error) {
      console.error('Error beim Abrufen der Datei:', error);
    }
  }

  abmelden() {
    this.authS.abmelden();
  }
}
