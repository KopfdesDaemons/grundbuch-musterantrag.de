import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { faFilePdf, faFileWord } from '@fortawesome/free-regular-svg-icons';
import { AntragGrundbuchausdruck } from 'src/app/models/antragGrundbuchausdruck';
import { DocxgeneratorService } from 'src/app/services/docxgenerator.service';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-antragsgenerierung',
  templateUrl: './antragsgenerierung.component.html',
  styleUrl: './antragsgenerierung.component.scss',
})
export class AntragsgenerierungComponent implements OnInit {
  faFileWord = faFileWord;
  faFilePdf = faFilePdf;

  prozentPdfUpload = 0;
  prozentPdfDownload = 0;
  fehler = false;
  statusmeldung = 'Die Antragsgenerierung wird gestartet.';
  docx: any;
  pdf: any;
  isBrowser: boolean;

  constructor(
    public fs: FormService,
    public http: HttpClient,
    public docxS: DocxgeneratorService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.generate();
  }

  async downloadDocx() {
    if (this.isBrowser && this.docx) {
      const { default: saveAs } = await import('file-saver');
      saveAs(this.docx, 'AntragGrundbuchausdruck.docx');
    }
  }

  async openPdf() {
    if (this.isBrowser && this.pdf) {
      window.open(URL.createObjectURL(this.pdf));
    }
  }

  async generate() {
    if (!this.isBrowser) return;

    this.fehler = false;
    this.prozentPdfUpload = 0;
    this.prozentPdfDownload = 0;

    try {
      this.docx = await this.docxS.generateDocx(new AntragGrundbuchausdruck(this.fs.form.value));
    } catch (error: any) {
      this.statusmeldung = error.message;
      this.fehler = true;
      console.error(error);
      return;
    }

    this.statusmeldung = 'Die .docx Datei wird zur Konvertierung an den Server gesendet.';
    const form = new FormData();
    form.append('docx', this.docx);
    const url = '/api/antraggrundbuchausdruck';

    this.http
      .post(url, form, {
        responseType: 'blob',
        reportProgress: true,
        observe: 'events',
      })
      .subscribe({
        next: (res) => {
          // Tracke Upload Fortschritt
          if (res.type === HttpEventType.UploadProgress) {
            const uploadProzent = Math.round((100 * res.loaded) / res.total!);
            this.prozentPdfUpload = uploadProzent;
            if (uploadProzent === 100) {
              this.statusmeldung = 'Die .docx Datei wurde zur Konvertierung an den Server gesendet. Der Server muss die Datei noch in eine pdf Datei konvertieren.';
            }
          }

          // Tracke Download Fortschritt
          if (res.type === HttpEventType.DownloadProgress) {
            const downloadProzent = Math.round((100 * res.loaded) / res.total!);
            this.prozentPdfDownload = downloadProzent;
            this.statusmeldung = 'Die .docx Datei wurde vom Server in eine pdf Datei konvertiert und muss nun heruntergeladen werden.';
          }

          // Antwort vom Server
          if (res.type === HttpEventType.Response) {
            this.pdf = res.body;
            this.statusmeldung = 'Es wurden alle Dateien erfolgreich erstellt.';
          }
        },
        error: (err) => {
          this.fehler = true;
          if (err.status >= 500 && err.status < 600) {
            // Server-Fehler
            this.statusmeldung = 'Es gab einen Serverfehler. Die .pdf Datei konnte nicht generiert werden. Sie können die docx Datei herunterladen.';
          } else {
            this.statusmeldung = 'Es gab einen Netzwerkfehler. Die .pdf Datei konnte nicht generiert werden. Sie können die docx Datei herunterladen.';
          }
          throw err;
        },
      }
      );
  }
}
