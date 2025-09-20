import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, DOCUMENT, inject, OnDestroy, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { FormService } from 'src/app/services/document/form.service';
import { DocumentService } from 'src/app/services/document/document.service';
import { ProgressSpinnerComponent } from '../../progress-spinner/progress-spinner.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-antragsgenerierung',
  templateUrl: './antragsgenerierung.component.html',
  styleUrl: './antragsgenerierung.component.scss',
  imports: [ProgressSpinnerComponent]
})
export class AntragsgenerierungComponent implements OnInit, OnDestroy {
  private fs = inject(FormService);
  private docS = inject(DocumentService);
  private platformId = inject(PLATFORM_ID);
  private document = inject(DOCUMENT);

  readonly odt = signal<Blob | null>(null);
  readonly pdf = signal<Blob | null>(null);
  submitIsLoading = signal<boolean>(false);
  pdfIsLoading = signal<boolean>(false);
  odtIsLoading = signal<boolean>(false);
  statusMessage = signal<string>('');

  readonly error = signal<HttpErrorResponse | null>(null);

  ngOnDestroy(): void {
    this.odt.set(null);
    this.pdf.set(null);
    this.error.set(null);
    this.pdfIsLoading.set(false);
    this.odtIsLoading.set(false);
  }

  async ngOnInit(): Promise<void> {
    await this.generatePdf();
  }

  downloadOdt() {
    const url = URL.createObjectURL(this.odt()!);
    const link = this.document.createElement('a');

    link.href = url;
    const fileName = this.fs.antrag?.title;
    link.download = fileName ? `${fileName}.odt` : 'Antrag.odt';
    this.document.body.appendChild(link);
    link.click();

    this.document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  openPdf() {
    window.open(URL.createObjectURL(this.pdf()!));
  }

  async generatePdf() {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      this.statusMessage.set('Dokument wird generiert...');
      this.error.set(null);
      if (!this.fs.antrag) return;
      this.fs.antragAbschließen();

      this.submitIsLoading.set(true);
      const uploadID = await this.docS.submitForm(this.fs.antrag);
      this.submitIsLoading.set(false);

      this.pdfIsLoading.set(true);
      this.pdf.set(await this.docS.getPdfAfterSubmitForm(uploadID));
      this.pdfIsLoading.set(false);

      this.odtIsLoading.set(true);
      this.odt.set(await this.docS.getOdtAfterSubmitForm(uploadID));
      this.odtIsLoading.set(false);

      this.statusMessage.set('Dokument wurde erfolgreich generiert.');
    } catch (error) {
      if (error instanceof HttpErrorResponse) this.error.set(error);
      this.statusMessage.set('Fehler bei der Dokumentgenerierung.');
    }
    this.pdfIsLoading.set(false);
    this.odtIsLoading.set(false);
    this.submitIsLoading.set(false);
  }
}
