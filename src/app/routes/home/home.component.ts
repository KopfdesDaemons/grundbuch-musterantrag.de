import { Component } from '@angular/core';
import { Router } from '@angular/router';
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
import { DesignloaderService } from 'src/app/services/designloader.service';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent {
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

  constructor(public dl: DesignloaderService, public router: Router) { }

  grundbuchausdruckBeantragen(){
    this.router.navigate([ '/grundbuchausdruck-beantragen' ])
  }
}