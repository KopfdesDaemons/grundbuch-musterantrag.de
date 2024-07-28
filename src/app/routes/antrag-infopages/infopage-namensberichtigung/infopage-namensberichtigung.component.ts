import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { faFilePdf, faPrint, faDownload } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-infopage-namensberichtigung',
  templateUrl: './infopage-namensberichtigung.component.html',
  styleUrl: './infopage-namensberichtigung.component.scss'
})
export class InfopageNamensberichtigungComponent {
  faFilePdf = faFilePdf;
  faPrint = faPrint;
  faDownload = faDownload;

  constructor(private meta: Meta, private titleService: Title) {
    this.meta.updateTag({
      name: 'description',
      content: 'Download eines Musterantrags auf Namensberichtigung als pdf oder docx.'
    });
    this.titleService.setTitle('Kostenloser Musterantrag auf Namensberichtigung einer natürlichen Person');
  }
}
