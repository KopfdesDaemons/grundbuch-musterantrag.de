import { Component, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Antrag } from 'src/app/interfaces/antrag';
import { AntragAbschriftBewilligung } from 'src/app/models/antrag/abschrift-bewilligung.antrag.model';
import { FooterComponent } from '../../../components/footer/footer.component';
import { AccordionComponent } from '../../../components/accordion/accordion.component';
import { SachlicheUndOrtlicheZustaendigkeitComponent } from '../../../components/sachliche-und-ortliche-zustaendigkeit/sachliche-und-ortliche-zustaendigkeit.component';
import { RouterLink } from '@angular/router';
import { AntragsinfosHeroComponent } from '../../../components/antragsinfos-hero/antragsinfos-hero.component';
import { HeaderComponent } from '../../../components/header/header.component';
import { DisqusComponent } from '../../../components/disqus/disqus.component';

@Component({
  selector: 'app-infopage-bewilligungen',
  templateUrl: './infopage-bewilligungen.component.html',
  styleUrl: './infopage-bewilligungen.component.scss',
  imports: [
    HeaderComponent,
    AntragsinfosHeroComponent,
    RouterLink,
    SachlicheUndOrtlicheZustaendigkeitComponent,
    AccordionComponent,
    FooterComponent,
    DisqusComponent
  ]
})
export class InfopageBewilligungenComponent {
  private meta = inject(Meta);
  private titleService = inject(Title);

  antrag: Antrag = new AntragAbschriftBewilligung();

  constructor() {
    this.meta.updateTag({
      name: 'description',
      content: 'Download eines Musterantrags auf ' + this.antrag.title + ' als .pdf oder docx.'
    });
    this.titleService.setTitle('Kostenloser Musterantrag auf ' + this.antrag.title);
  }
}
