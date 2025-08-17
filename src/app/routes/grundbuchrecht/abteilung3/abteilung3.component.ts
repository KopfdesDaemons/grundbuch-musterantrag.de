import { Component, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ArtikelComponent } from '../../../components/artikel/artikel.component';

@Component({
  selector: 'app-abteilung3',
  templateUrl: './abteilung3.component.html',
  styleUrls: ['./abteilung3.component.scss'],
  imports: [ArtikelComponent]
})
export class Abteilung3Component {
  private meta = inject(Meta);
  private titleService = inject(Title);

  constructor() {
    this.meta.addTag({
      name: 'description',
      content: 'Eine kompakte Einleitung ins Grundbuchrecht. Kurze Erklärung der Eintragungen der Abteilung III des Grundbuchs.'
    });
    this.titleService.setTitle('Einleitung Grundbuchrecht: Abteilung III');
  }
}
