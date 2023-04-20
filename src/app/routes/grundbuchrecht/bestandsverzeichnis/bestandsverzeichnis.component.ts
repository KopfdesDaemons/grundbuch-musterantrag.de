import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-bestandsverzeichnis',
  templateUrl: './bestandsverzeichnis.component.html',
  styleUrls: ['./bestandsverzeichnis.component.scss']
})
export class BestandsverzeichnisComponent {
  constructor(private meta: Meta, private titleService: Title) {
    this.meta.addTag({ 
      name: 'description',
      content: 'Eine kompakte Einleitung ins Grundbuchrecht. Kurze Erklärung des Bestandsverzeichnises des Grundbuchs.' });
    this.titleService.setTitle('Einleitung Grundbuchrecht: Bestandsverzeichnis');
  }
}
