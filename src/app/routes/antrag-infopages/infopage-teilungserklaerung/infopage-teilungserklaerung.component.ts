import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Antrag } from 'src/app/interfaces/antrag';
import { AntragTeilungserklaerung } from 'src/app/models/antragTeilungserklaerung';
import { FooterComponent } from '../../../components/footer/footer.component';
import { AccordionComponent } from '../../../components/accordion/accordion.component';
import { SachlicheUndOrtlicheZustaendigkeitComponent } from '../../../components/sachliche-und-ortliche-zustaendigkeit/sachliche-und-ortliche-zustaendigkeit.component';
import { AntragsinfosHeroComponent } from '../../../components/antragsinfos-hero/antragsinfos-hero.component';
import { HeaderComponent } from '../../../components/header/header.component';

@Component({
    selector: 'app-infopage-teilungserklaerung',
    templateUrl: './infopage-teilungserklaerung.component.html',
    styleUrl: './infopage-teilungserklaerung.component.scss',
    imports: [HeaderComponent, AntragsinfosHeroComponent, SachlicheUndOrtlicheZustaendigkeitComponent, AccordionComponent, FooterComponent]
})
export class InfopageTeilungserklaerungComponent {
  antrag: Antrag = new AntragTeilungserklaerung();

  constructor(private meta: Meta, private titleService: Title) {
    this.meta.updateTag({
      name: 'description',
      content: 'Download eines Musterantrags auf ' + this.antrag.title + ' als .pdf oder docx.'
    });
    this.titleService.setTitle('Kostenloser Musterantrag auf ' + this.antrag.title);
  }
}
