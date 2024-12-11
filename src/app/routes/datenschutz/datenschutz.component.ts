import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CookiesService } from 'src/app/services/cookies.service';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';
import { CookiesTileComponent } from "../../components/dashboard/tiles/cookies-tile/cookies-tile.component";

@Component({
    selector: 'app-datenschutz',
    templateUrl: './datenschutz.component.html',
    styleUrls: ['./datenschutz.component.scss'],
    imports: [HeaderComponent, FooterComponent, CookiesTileComponent]
})
export class DatenschutzComponent {

  constructor(private titleService: Title, public cs: CookiesService) {
    this.titleService.setTitle('Datenschutzerklärung');
  }

  deleteCookies() {
    this.cs.deleteAllCookies();
    alert('Allle Cookies gelöscht.');
  }
}
