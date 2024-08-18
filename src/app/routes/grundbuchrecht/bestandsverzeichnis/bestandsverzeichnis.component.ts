import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { ArtikelComponent } from '../../../components/artikel/artikel.component';

@Component({
    selector: 'app-bestandsverzeichnis',
    templateUrl: './bestandsverzeichnis.component.html',
    styleUrls: ['./bestandsverzeichnis.component.scss'],
    standalone: true,
    imports: [ArtikelComponent, RouterLink]
})
export class BestandsverzeichnisComponent {
  constructor(private meta: Meta, private titleService: Title) {
    this.meta.addTag({ 
      name: 'description',
      content: 'Eine kompakte Einleitung ins Grundbuchrecht. Kurze Erklärung des Bestandsverzeichnises des Grundbuchs.' });
    this.titleService.setTitle('Einleitung Grundbuchrecht: Bestandsverzeichnis');
  }
}
