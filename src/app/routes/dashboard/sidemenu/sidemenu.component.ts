import { isPlatformBrowser, NgClass } from '@angular/common';
import { Component, ElementRef, inject, PLATFORM_ID, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SidemenuService } from 'src/app/services/sidemenu.service';

@Component({
  selector: 'app-sidemenu',
  imports: [RouterLink, NgClass],
  templateUrl: './sidemenu.component.html',
  styleUrl: './sidemenu.component.scss'
})
export class SidemenuComponent {
  sidemenuS = inject(SidemenuService);
  private platformId = inject(PLATFORM_ID);

  component = viewChild.required<ElementRef>('sidemenu');

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const links = this.component().nativeElement.querySelectorAll('a');

      for (const link of links) {
        link.addEventListener('click', () => {
          if (this.sidemenuS.DashboaardSidemenuIsOpen) this.sidemenuS.toggleDashboardSidemenu();
        });
      }
    }
  }
}
