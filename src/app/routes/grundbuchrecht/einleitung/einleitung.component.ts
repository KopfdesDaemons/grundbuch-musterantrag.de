import { Component, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

import { faUniversity, faMapMarkedAlt } from '@fortawesome/free-solid-svg-icons';
import { SachlicheUndOrtlicheZustaendigkeitComponent } from '../../../components/sachliche-und-ortliche-zustaendigkeit/sachliche-und-ortliche-zustaendigkeit.component';
import { RouterLink } from '@angular/router';
import { ArtikelComponent } from '../../../components/artikel/artikel.component';

@Component({
  selector: 'app-einleitung',
  templateUrl: './einleitung.component.html',
  styleUrls: ['./einleitung.component.scss'],
  imports: [ArtikelComponent, RouterLink, SachlicheUndOrtlicheZustaendigkeitComponent]
})
export class EinleitungComponent {
  private meta = inject(Meta);
  private titleService = inject(Title);

  faUniversity = faUniversity;
  faMapMarkedAlt = faMapMarkedAlt;

  constructor() {
    this.meta.addTag({
      name: 'description',
      content: 'Eine kompakte Einleitung ins Grundbuchrecht. Einfach geschrieben und die wichtigsten Themen angesprochen.'
    });
    this.titleService.setTitle('Einleitung Grundbuchrecht');
  }
}
