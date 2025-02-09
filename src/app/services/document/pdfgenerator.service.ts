import { HttpClient, HttpEventType } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Antrag } from '../../interfaces/antrag';

@Injectable({
  providedIn: 'root'
})
export class PdfgeneratorService {
  http = inject(HttpClient);

  prozentPdfUpload = 0;
  prozentPdfDownload = 0;
  fehler = false;
  statusmeldung = '';

  async generate(docx: any, antrag: Antrag) {
    this.reset();
    this.statusmeldung = 'Die .docx Datei wird zur Konvertierung an den Server gesendet.';

    return new Promise((resolve) => {
      const form = new FormData();
      form.append('docx', docx);
      form.append('uploadinfo', JSON.stringify({ antragsart: antrag.title, grundbuchamt: antrag.grundbuchamt.name }));
      const url = '/api/submitForm';

      this.http.post(url, form, {
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
                this.statusmeldung = 'Die .docx Datei wurde zur Konvertierung an den Server gesendet. Der Server muss die Datei noch in eine .pdf Datei konvertieren.';
              }
            }

            // Tracke Download Fortschritt
            if (res.type === HttpEventType.DownloadProgress) {
              const downloadProzent = Math.round((100 * res.loaded) / res.total!);
              this.prozentPdfDownload = downloadProzent;
              this.statusmeldung = 'Die .docx Datei wurde vom Server in eine .pdf Datei konvertiert und muss nun heruntergeladen werden.';
            }

            // Antwort vom Server
            if (res.type === HttpEventType.Response) {
              this.statusmeldung = 'Es wurden alle Dateien erfolgreich erstellt.';
              resolve(res.body);
            }
          },
          error: (err) => {
            this.fehler = true;
            if (err.status >= 500 && err.status < 600) {
              // Server-Fehler
              this.statusmeldung = 'Es gab einen Serverfehler. Die .pdf Datei konnte nicht generiert werden. Sie können die .docx Datei herunterladen.';
            } else {
              this.statusmeldung = 'Es gab einen Netzwerkfehler. Die .pdf Datei konnte nicht generiert werden. Sie können die .docx Datei herunterladen.';
            }
            throw err;
          },
        });
    });
  }

  reset() {
    this.prozentPdfUpload = 0;
    this.prozentPdfDownload = 0;
    this.fehler = false;
    this.statusmeldung = '';
  }
}
