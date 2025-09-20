import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CookiesService } from 'src/app/services/utils/cookies.service';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';
import { CookiesTileComponent } from '../../components/dashboard/tiles/cookies-tile/cookies-tile.component';
import { DisqusService } from 'src/app/services/integration/disqus.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-datenschutz',
  templateUrl: './datenschutz.component.html',
  styleUrls: ['./datenschutz.component.scss'],
  imports: [HeaderComponent, FooterComponent, CookiesTileComponent]
})
export class DatenschutzComponent {
  private titleService = inject(Title);
  private disqusS = inject(DisqusService);
  cs = inject(CookiesService);

  constructor() {
    this.titleService.setTitle('Datenschutzerklärung');
  }

  deleteCookies() {
    this.cs.deleteAllCookies();
    alert('Allle Cookies gelöscht.');
  }

  revokeDisqus() {
    this.disqusS.revokeConsent();
    alert('Zustimmung zum Laden von Disqus widerrufen. Disuqs wird nun nicht mehr geladen.');
  }
}
