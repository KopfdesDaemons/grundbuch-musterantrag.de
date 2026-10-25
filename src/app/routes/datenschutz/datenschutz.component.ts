import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CookiesService } from 'src/app/services/utils/cookies.service';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';
import { CookiesTileComponent } from '../../components/dashboard/tiles/cookies-tile/cookies-tile.component';
import { DisqusService } from 'src/app/services/integration/disqus.service';
import { SettingsService } from 'src/app/services/server/settings.service';
import { ProgressSpinnerComponent } from 'src/app/components/progress-spinner/progress-spinner.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-datenschutz',
  templateUrl: './datenschutz.component.html',
  styleUrls: ['./datenschutz.component.scss'],
  imports: [HeaderComponent, FooterComponent, CookiesTileComponent, ProgressSpinnerComponent]
})
export class DatenschutzComponent {
  private readonly titleService = inject(Title);
  private readonly disqusS = inject(DisqusService);
  private readonly cs = inject(CookiesService);
  private readonly settingS = inject(SettingsService);
  protected readonly primaryColorString = signal<string | null>(null);

  async ngOnInit() {
    this.titleService.setTitle('Datenschutzerklärung');
    const primaryColorFromSettings = await this.settingS.getPrimaryColorFromSettings();
    this.primaryColorString.set(primaryColorFromSettings);
  }

  deleteCookies() {
    this.cs.deleteAllCookies();
    alert('Alle Cookies gelöscht.');
  }

  revokeDisqus() {
    this.disqusS.revokeConsent();
    alert('Zustimmung zum Laden von Disqus widerrufen. Disqus wird nun nicht mehr geladen.');
  }
}
