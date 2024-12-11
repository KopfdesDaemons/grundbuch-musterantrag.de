import { Component } from '@angular/core';
import { faUniversity, faMapMarkedAlt } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
    selector: 'app-sachliche-und-ortliche-zustaendigkeit',
    templateUrl: './sachliche-und-ortliche-zustaendigkeit.component.html',
    styleUrl: './sachliche-und-ortliche-zustaendigkeit.component.scss',
    imports: [FaIconComponent]
})
export class SachlicheUndOrtlicheZustaendigkeitComponent {
  faUniversity = faUniversity;
  faMapMarkedAlt = faMapMarkedAlt;
}
