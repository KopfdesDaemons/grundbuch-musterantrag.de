import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Antrag } from 'src/app/interfaces/antrag';
import { AntragTeilungserklaerung } from 'src/app/models/antrag/teilungserklaerung.antrag.model';
import { FooterComponent } from '../../../components/footer/footer.component';
import { AccordionComponent } from '../../../components/accordion/accordion.component';
import { SachlicheUndOrtlicheZustaendigkeitComponent } from '../../../components/sachliche-und-ortliche-zustaendigkeit/sachliche-und-ortliche-zustaendigkeit.component';
import { AntragsinfosHeroComponent } from '../../../components/antragsinfos-hero/antragsinfos-hero.component';
import { HeaderComponent } from '../../../components/header/header.component';
import { DisqusComponent } from '../../../components/disqus/disqus.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-infopage-teilungserklaerung',
  templateUrl: './infopage-teilungserklaerung.component.html',
  styleUrl: './infopage-teilungserklaerung.component.scss',
  imports: [
    HeaderComponent,
    AntragsinfosHeroComponent,
    SachlicheUndOrtlicheZustaendigkeitComponent,
    AccordionComponent,
    FooterComponent,
    DisqusComponent
  ]
})
export class InfopageTeilungserklaerungComponent {
  private meta = inject(Meta);
  private titleService = inject(Title);

  antrag: Antrag = new AntragTeilungserklaerung();

  constructor() {
    this.meta.updateTag({
      name: 'description',
      content: 'Download eines Musterantrags auf ' + this.antrag.title + ' als .pdf oder .odt.'
    });
    this.titleService.setTitle('Kostenloser Musterantrag auf ' + this.antrag.title);
  }
}
