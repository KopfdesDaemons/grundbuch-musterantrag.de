import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-abteilung2',
  templateUrl: './abteilung2.component.html',
  styleUrls: ['./abteilung2.component.scss']
})
export class Abteilung2Component {
  constructor(private meta: Meta, private titleService: Title) {
    this.meta.addTag({ 
      name: 'description',
      content: 'Eine kompakte Einleitung ins Grundbuchrecht. Kurze Erklärung der Eintragungen der Abteilung II des Grundbuchs.' });
    this.titleService.setTitle('Einleitung Grundbuchrecht: Abteilung II');
  }
}
