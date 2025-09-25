import { Injectable, Renderer2, inject, signal } from '@angular/core';
import { ConsentService } from '../utils/consent.service';
import { ScriptService } from '../utils/script.service';

@Injectable({
  providedIn: 'root'
})
export class DisqusService {
  private readonly scriptS = inject(ScriptService);
  private readonly consentS = inject(ConsentService);

  private readonly _consent = signal<boolean>(false);
  readonly consent = this._consent.asReadonly();

  private disqus: any;
  private readonly shortname: string = 'grundbuch-musterantrag';

  constructor() {
    this._consent.set(this.consentS.checkConsent('Disqus'));
  }

  giveConsent() {
    this.consentS.giveConsent('Disqus');
    this._consent.set(true);
  }

  async loadDisqus(renderer: Renderer2, title: string): Promise<void> {
    this._consent.set(this.consentS.checkConsent('Disqus'));
    this.disqus = (window as any)['DISQUS'];
    if (!this.disqus) {
      (window as any).disqus_config = function () {
        this.page.identifier = title;
      };
      await this.scriptS.addJsScript(renderer, 'https://' + this.shortname + '.disqus.com/embed.js');
    } else {
      (window as any)['DISQUS'].reset({
        reload: true,
        config: function () {
          this.page.identifier = title;
        }
      });
    }
  }

  revokeConsent() {
    this.consentS.revokeConsent('Disqus');
    this._consent.set(false);
    this.scriptS.removeJsScript('https://' + this.shortname + '.disqus.com/embed.js');
    (window as any)['DISQUS'] = undefined;
  }
}
