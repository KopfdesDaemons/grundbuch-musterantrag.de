import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Antrag } from 'src/app/interfaces/antrag';
import { AntragLoesschungAbt2 } from 'src/app/models/antragLoeschungAbt2';

@Component({
  selector: 'app-infopage-loeschung-abteilung2',
  templateUrl: './infopage-loeschung-abteilung2.component.html',
  styleUrl: './infopage-loeschung-abteilung2.component.scss'
})
export class InfopageLoeschungAbteilung2Component {
  antrag: Antrag = new AntragLoesschungAbt2()

  constructor(private meta: Meta, private titleService: Title) {
    this.meta.updateTag({
      name: 'description',
      content: 'Download eines Musterantrags auf ' + this.antrag.title + ' als .pdf oder docx.'
    });
    this.titleService.setTitle('Kostenloser Musterantrag auf ' + this.antrag.title);
  }
}
