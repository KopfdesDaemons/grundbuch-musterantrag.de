import { Component, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Antrag } from 'src/app/interfaces/antrag';
import { AntragLoesschungAbt2 } from 'src/app/models/antragLoeschungAbt2';
import { FooterComponent } from '../../../components/footer/footer.component';
import { AccordionComponent } from '../../../components/accordion/accordion.component';
import { SachlicheUndOrtlicheZustaendigkeitComponent } from '../../../components/sachliche-und-ortliche-zustaendigkeit/sachliche-und-ortliche-zustaendigkeit.component';
import { RouterLink } from '@angular/router';
import { AntragsinfosHeroComponent } from '../../../components/antragsinfos-hero/antragsinfos-hero.component';
import { HeaderComponent } from '../../../components/header/header.component';

@Component({
    selector: 'app-infopage-loeschung-abteilung2',
    templateUrl: './infopage-loeschung-abteilung2.component.html',
    styleUrl: './infopage-loeschung-abteilung2.component.scss',
    imports: [HeaderComponent, AntragsinfosHeroComponent, RouterLink, SachlicheUndOrtlicheZustaendigkeitComponent, AccordionComponent, FooterComponent]
})
export class InfopageLoeschungAbteilung2Component {
  private meta = inject(Meta);
  private titleService = inject(Title);

  antrag: Antrag = new AntragLoesschungAbt2()

  constructor() {
    this.meta.updateTag({
      name: 'description',
      content: 'Download eines Musterantrags auf ' + this.antrag.title + ' als .pdf oder docx.'
    });
    this.titleService.setTitle('Kostenloser Musterantrag auf ' + this.antrag.title);
  }
}
