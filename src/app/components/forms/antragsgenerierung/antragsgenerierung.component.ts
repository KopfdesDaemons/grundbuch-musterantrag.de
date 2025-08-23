import { isPlatformBrowser } from '@angular/common';
import { Component, DOCUMENT, inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { faFileLines, faFilePdf } from '@fortawesome/free-regular-svg-icons';
import { FormService } from 'src/app/services/document/form.service';
import { DocumentService } from 'src/app/services/document/document.service';
import { ProgressSpinnerComponent } from '../../progress-spinner/progress-spinner.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-antragsgenerierung',
  templateUrl: './antragsgenerierung.component.html',
  styleUrl: './antragsgenerierung.component.scss',
  imports: [FaIconComponent, ProgressSpinnerComponent]
})
export class AntragsgenerierungComponent implements OnInit, OnDestroy {
  private fs = inject(FormService);
  pdfS = inject(DocumentService);
  private platformId = inject(PLATFORM_ID);
  private document = inject(DOCUMENT);

  faFilePdf = faFilePdf;
  faFileLines = faFileLines;

  odt: any = null;
  pdf: any = null;
  pdfIsLoading: boolean = false;
  statusMessage: string = '';

  pdfError: HttpErrorResponse | null = null;

  ngOnDestroy(): void {
    this.odt = null;
    this.pdf = null;
    this.pdfError = null;
    this.pdfIsLoading = false;
  }

  async ngOnInit(): Promise<void> {
    await this.generatePdf();
  }

  downloadDocx() {
    const docxUrl = URL.createObjectURL(this.odt);
    const link = this.document.createElement('a');

    link.href = docxUrl;
    const fileName = this.fs.antrag?.title;
    link.download = fileName ? `${fileName}.docx` : 'Antrag.docx';
    this.document.body.appendChild(link);
    link.click();

    this.document.body.removeChild(link);
    URL.revokeObjectURL(docxUrl);
  }

  openPdf() {
    window.open(URL.createObjectURL(this.pdf));
  }

  async generatePdf() {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      this.statusMessage = 'Dokument wird generiert...';
      this.pdfIsLoading = true;
      this.pdfError = null;
      if (!this.fs.antrag) return;
      this.fs.antragAbschließen();
      this.pdf = await this.pdfS.generatePdf(this.fs.antrag);
      this.statusMessage = 'Dokument wurde erfolgreich generiert.';
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        this.pdfError = error;
      }
      this.statusMessage = 'Fehler bei der Dokumentgenerierung.';
    }
    this.pdfIsLoading = false;
  }
}
