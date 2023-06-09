import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

import {
  faUniversity,
  faMapMarkedAlt,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-einleitung',
  templateUrl: './einleitung.component.html',
  styleUrls: ['./einleitung.component.scss']
})
export class EinleitungComponent {
  faUniversity = faUniversity;
  faMapMarkedAlt = faMapMarkedAlt;

  constructor(private meta: Meta, private titleService: Title) {
    this.meta.addTag({ 
      name: 'description',
      content: 'Eine kompakte Einleitung ins Grundbuchrecht. Einfach geschrieben und die wichtigsten Themen angesprochen.' });
    this.titleService.setTitle('Einleitung Grundbuchrecht');
  }
}
