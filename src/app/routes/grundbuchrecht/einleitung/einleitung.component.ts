import { Component } from '@angular/core';

import {
  faUniversity,
  faMapMarkedAlt,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-einleitung',
  templateUrl: './einleitung.component.html',
  styleUrls: ['./einleitung.component.scss']
})
export class EinleitungComponent {
  faUniversity = faUniversity;
  faMapMarkedAlt = faMapMarkedAlt;
}
