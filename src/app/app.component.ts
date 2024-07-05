import { Component } from '@angular/core';
import {
  faFilePdf,
  faEnvelope,
  faUser,
} from '@fortawesome/free-regular-svg-icons';
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
import { DesignloaderService } from './services/designloader.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
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

  constructor(private titleService: Title, public dl: DesignloaderService) {
    this.titleService.setTitle('Grundbuch-Musterantrag.de');
  }
}
