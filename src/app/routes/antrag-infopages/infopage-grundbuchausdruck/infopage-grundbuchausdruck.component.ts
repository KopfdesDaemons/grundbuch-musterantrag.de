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



@Component({
  selector: 'app-home',
  templateUrl: './infopage-grundbuchausdruck.component.html',
  styleUrls: ['./infopage-grundbuchausdruck.component.scss']
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