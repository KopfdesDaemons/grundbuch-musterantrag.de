import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Antrag } from 'src/app/interfaces/antrag';
import { AntragTeilungserklaerung } from 'src/app/models/antragTeilungserklaerung';

@Component({
  selector: 'app-infopage-teilungserklaerung',
  templateUrl: './infopage-teilungserklaerung.component.html',
  styleUrl: './infopage-teilungserklaerung.component.scss'
})
export class InfopageTeilungserklaerungComponent {
  antrag: Antrag = new AntragTeilungserklaerung();

  constructor(private meta: Meta, private titleService: Title) {
    this.meta.updateTag({
      name: 'description',
      content: 'Download eines Musterantrags auf ' + this.antrag.title + ' als .pdf oder docx.'
    });
    this.titleService.setTitle('Kostenloser Musterantrag auf ' + this.antrag.title);
  }
}