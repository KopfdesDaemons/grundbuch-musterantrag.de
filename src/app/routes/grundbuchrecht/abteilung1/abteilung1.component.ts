import { Component } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-abteilung1',
  templateUrl: './abteilung1.component.html',
  styleUrls: ['./abteilung1.component.scss']
})
export class Abteilung1Component {
  constructor(private meta: Meta, private titleService: Title) {
    this.meta.addTag({ 
      name: 'description',
      content: 'Eine kompakte Einleitung ins Grundbuchrecht. Kurze Erklärung der Eintragungen der Abteilung I des Grundbuchs.' });
    this.titleService.setTitle('Einleitung Grundbuchrecht: Abteilung I');
  }
}
