import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { faFilePdf, faEnvelope, faUser } from '@fortawesome/free-regular-svg-icons';
import {
  faPrint,
  faDownload,
  faHome,
  faFax,
  faPhone,
  faAt,
  faGlobe,
  faUniversity,
  faMapMarkedAlt,
} from '@fortawesome/free-solid-svg-icons';
import { DesignloaderService } from 'src/app/services/designloader.service';



@Component({
  selector: 'app-home',
  templateUrl: './infopage-grundbuchausdruck.component.html',
  styleUrls: ['./infopage-grundbuchausdruck.component.scss']
})

export class InfopageGrundbuchausdruckComponent {
  title = 'grundbuch';
  faFilePdf = faFilePdf;
  faPrint = faPrint;
  faDownload = faDownload;
  faHome = faHome;
  faEnvelope = faEnvelope;
  faFax = faFax;
  faUser = faUser;
  faPhone = faPhone;
  faAt = faAt;
  faGlobe = faGlobe;
  faUniversity = faUniversity;
  faMapMarkedAlt = faMapMarkedAlt;

  constructor(public dl: DesignloaderService, public router: Router, private meta: Meta, private titleService: Title) {
    this.meta.updateTag({
      name: 'description',
      content: 'Download eines Musterantrags auf Erteilung eines Grundbuchausdrucks als pdf oder docx.'
    });
    this.titleService.setTitle('Kostenloser Musterantrag auf Erteilung eines Grundbuchausdrucks');
  }
}