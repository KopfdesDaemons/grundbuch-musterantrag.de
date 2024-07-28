import { Component } from '@angular/core';
import { faUniversity, faMapMarkedAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-sachliche-und-ortliche-zustaendigkeit',
  templateUrl: './sachliche-und-ortliche-zustaendigkeit.component.html',
  styleUrl: './sachliche-und-ortliche-zustaendigkeit.component.scss'
})
export class SachlicheUndOrtlicheZustaendigkeitComponent {
  faUniversity = faUniversity;
  faMapMarkedAlt = faMapMarkedAlt;
}
