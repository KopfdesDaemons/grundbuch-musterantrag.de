import { Component, ElementRef, Renderer2, OnChanges, PLATFORM_ID, inject, input } from '@angular/core';
import { DisqusService } from 'src/app/services/disqus.service';
import { faComment } from '@fortawesome/free-regular-svg-icons';
import { isPlatformBrowser } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-disqus',
  templateUrl: './disqus.component.html',
  styleUrls: ['./disqus.component.scss'],
  imports: [FaIconComponent, RouterLink]
})
export class DisqusComponent implements OnChanges {
  disqusS = inject(DisqusService);
  renderer = inject(Renderer2);
  private elementRef = inject(ElementRef);
  private platformId = inject<object>(PLATFORM_ID);

  identifier = input<string | undefined>();
  private observer: IntersectionObserver | undefined;
  faComment = faComment;

  ngOnChanges(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.observer) this.observer.disconnect();
    if (!this.identifier()) return;
    if (!this.disqusS.consent) return;
    this.observer = new IntersectionObserver(entries => {
      entries.forEach(async entry => {
        if (entry.isIntersecting) await this.isVisible();
      });
    });
    this.observer.observe(this.elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  async isVisible() {
    if (this.disqusS.consent() && this.identifier) {
      await this.disqusS.loadDisqus(this.renderer, this.identifier()!);
      this.observer?.disconnect();
    }
  }

  async giveConsent() {
    if (!this.identifier()) return;
    this.disqusS.giveConsent();
    this.observer?.disconnect();
    await this.disqusS.loadDisqus(this.renderer, this.identifier()!);
  }
}
