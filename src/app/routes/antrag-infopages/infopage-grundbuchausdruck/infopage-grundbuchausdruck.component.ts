import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { faEnvelope, faUser } from '@fortawesome/free-regular-svg-icons';
import {
  faFax,
  faPhone,
  faAt,
  faGlobe,
  faUniversity,
  faMapMarkedAlt,
} from '@fortawesome/free-solid-svg-icons';
import { Antrag } from 'src/app/interfaces/antrag';
import { AntragGrundbuchausdruck } from 'src/app/models/antragGrundbuchausdruck';
import { FooterComponent } from '../../../components/footer/footer.component';
import { AccordionComponent } from '../../../components/accordion/accordion.component';
import { SachlicheUndOrtlicheZustaendigkeitComponent } from '../../../components/sachliche-und-ortliche-zustaendigkeit/sachliche-und-ortliche-zustaendigkeit.component';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { AntragsinfosHeroComponent } from '../../../components/antragsinfos-hero/antragsinfos-hero.component';
import { HeaderComponent } from '../../../components/header/header.component';



@Component({
    selector: 'app-home',
    templateUrl: './infopage-grundbuchausdruck.component.html',
    styleUrls: ['./infopage-grundbuchausdruck.component.scss'],
    imports: [HeaderComponent, AntragsinfosHeroComponent, FaIconComponent, RouterLink, SachlicheUndOrtlicheZustaendigkeitComponent, AccordionComponent, FooterComponent]
})

export class InfopageGrundbuchausdruckComponent {
  title = 'grundbuch';
  faEnvelope = faEnvelope;
  faFax = faFax;
  faUser = faUser;
  faPhone = faPhone;
  faAt = faAt;
  faGlobe = faGlobe;
  faUniversity = faUniversity;
  faMapMarkedAlt = faMapMarkedAlt;
  antrag: Antrag = new AntragGrundbuchausdruck();

  constructor(private meta: Meta, private titleService: Title) {
    this.meta.updateTag({
      name: 'description',
      content: 'Download eines Musterantrags auf ' + this.antrag.title + ' als .pdf oder docx.'
    });
    this.titleService.setTitle('Kostenloser Musterantrag auf ' + this.antrag.title);
  }
}