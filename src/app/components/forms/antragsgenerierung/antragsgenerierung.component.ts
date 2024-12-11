import { isPlatformBrowser } from '@angular/common';
import { Component, inject, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { faFilePdf, faFileWord } from '@fortawesome/free-regular-svg-icons';
import { DocxgeneratorService } from 'src/app/services/docxgenerator.service';
import { FormService } from 'src/app/services/form.service';
import { PdfgeneratorService } from 'src/app/services/pdfgenerator.service';
import { ProgressSpinnerComponent } from '../../progress-spinner/progress-spinner.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
    selector: 'app-antragsgenerierung',
    templateUrl: './antragsgenerierung.component.html',
    styleUrl: './antragsgenerierung.component.scss',
    imports: [FaIconComponent, ProgressSpinnerComponent]
})
export class AntragsgenerierungComponent implements OnInit, OnDestroy {
  fs = inject(FormService);
  docxS = inject(DocxgeneratorService);
  pdfS = inject(PdfgeneratorService);
  platformId = inject(PLATFORM_ID);

  faFileWord = faFileWord;
  faFilePdf = faFilePdf;

  docx: any;
  pdf: any;

  ngOnDestroy(): void {
    this.docxS.reset();
    this.pdfS.reset();
  }

  ngOnInit(): void {
    this.generate();
  }

  async downloadDocx() {
    window.open(URL.createObjectURL(this.docx));
  }

  async openPdf() {
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