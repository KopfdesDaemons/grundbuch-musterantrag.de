import { Injectable, Renderer2, inject, signal } from '@angular/core';
import { ConsentService } from './consent.service';
import { ScriptService } from './script.service';

@Injectable({
  providedIn: 'root'
})
export class DisqusService {
  scriptS = inject(ScriptService);
  consentS = inject(ConsentService);


  consent = signal<boolean>(false);
  disqus: any;
  shortname: string = 'grundbuch-musterantrag';

  constructor() {
    this.consent.set(this.consentS.checkConsent('Disqus'));
  }

  giveConsent() {
    this.consentS.giveConsent('Disqus');
    this.consent.set(true);
  }

  loadDisqus(renderer: Renderer2, title: string): void {
    this.consent.set(this.consentS.checkConsent('Disqus'));
    this.disqus = (window as any)['DISQUS'];
    if (!this.disqus) {
      (window as any).disqus_config = function () {
        this.page.identifier = title;
      };
      this.scriptS.addJsScript(renderer, 'https://' + this.shortname + '.disqus.com/embed.js');
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
    this.consent.set(false);
    this.scriptS.removeJsScript('https://' + this.shortname + '.disqus.com/embed.js');
    (window as any)['DISQUS'] = undefined;
  }
}
