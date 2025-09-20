import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { ArtikelComponent } from '../../../components/artikel/artikel.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-bestandsverzeichnis',
  templateUrl: './bestandsverzeichnis.component.html',
  styleUrls: ['./bestandsverzeichnis.component.scss'],
  imports: [ArtikelComponent, RouterLink]
})
export class BestandsverzeichnisComponent {
  private meta = inject(Meta);
  private titleService = inject(Title);

  constructor() {
    this.meta.addTag({
      name: 'description',
      content: 'Eine kompakte Einleitung ins Grundbuchrecht. Kurze Erklärung des Bestandsverzeichnises des Grundbuchs.'
    });
    this.titleService.setTitle('Einleitung Grundbuchrecht: Bestandsverzeichnis');
  }
}
