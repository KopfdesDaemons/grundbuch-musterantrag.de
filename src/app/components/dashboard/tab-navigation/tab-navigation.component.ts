import { ChangeDetectionStrategy, Component, contentChildren, effect, inject, input, model, untracked } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TabComponent } from './tab.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  selector: 'app-tab-navigation',
  styleUrl: './tab-navigation.component.scss',
  templateUrl: './tab-navigation.component.html'
})
export class TabNavigationComponent {
  protected readonly router = inject(Router, { optional: true });

  readonly tabs = input<{ name: string; route: string }[]>();
  readonly tabsAlign = input<'left' | 'center' | 'right'>('center');
  readonly activeIndex = model<number>(0);

  readonly tabPanels = contentChildren(TabComponent);

  constructor() {
    let initialCheckDone = false;

    effect(() => {
      const panels = this.tabPanels();
      if (panels.length === 0) return;

      if (!initialCheckDone) {
        initialCheckDone = true;
        const initialActiveIdx = panels.findIndex(p => p.initiallyActive());
        if (initialActiveIdx !== -1) {
          this.activeIndex.set(initialActiveIdx);
          return;
        }
      }

      const currentIdx = this.activeIndex();
      untracked(() => {
        panels.forEach((panel, idx) => {
          panel.active.set(idx === currentIdx);
        });
      });
    });
  }

  selectTab(index: number): void {
    if (index >= 0 && index < this.tabPanels().length) {
      this.activeIndex.set(index);
    }
  }
}
