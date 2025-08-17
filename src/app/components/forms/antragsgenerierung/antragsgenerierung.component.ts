import { isPlatformBrowser } from '@angular/common';
import { Component, DOCUMENT, inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { faFilePdf, faFileWord } from '@fortawesome/free-regular-svg-icons';
import { DocxgeneratorService } from 'src/app/services/document/docxgenerator.service';
import { FormService } from 'src/app/services/document/form.service';
import { PdfgeneratorService } from 'src/app/services/document/pdfgenerator.service';
import { ProgressSpinnerComponent } from '../../progress-spinner/progress-spinner.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-antragsgenerierung',
  templateUrl: './antragsgenerierung.component.html',
  styleUrl: './antragsgenerierung.component.scss',
  imports: [FaIconComponent, ProgressSpinnerComponent]
})
export class AntragsgenerierungComponent implements OnInit, OnDestroy {
  private fs = inject(FormService);
  docxS = inject(DocxgeneratorService);
  pdfS = inject(PdfgeneratorService);
  private platformId = inject(PLATFORM_ID);
  private document = inject(DOCUMENT);

  faFileWord = faFileWord;
  faFilePdf = faFilePdf;

  docx: any;
  pdf: any;

  ngOnDestroy(): void {
    this.docxS.reset();
    this.pdfS.reset();
  }

  async ngOnInit(): Promise<void> {
    await this.generate();
  }

  downloadDocx() {
    const docxUrl = URL.createObjectURL(this.docx);
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

  async generate() {
    if (!isPlatformBrowser(this.platformId)) return;
    if (!this.fs.antrag) return;
    this.fs.antragAbschließen();
    this.docx = await this.docxS.generate(this.fs.antrag);
    this.pdf = await this.pdfS.generate(this.docx, this.fs.antrag);
  }
}
