import { isPlatformBrowser, NgClass } from '@angular/common';
import { Component, ElementRef, inject, PLATFORM_ID, viewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
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
  router = inject(Router);

  component = viewChild.required<ElementRef>('sidemenu');

  pages = [
    { name: 'Übersicht', route: '/dashboard' },
    { name: 'Uploads', route: '/dashboard/antragsliste' },
    { name: 'Statistik', route: '/dashboard/statistic' },
    { name: 'Users', route: '/dashboard/users' }
  ];

  isActive(route: string): boolean {
    if (!(route === '/dashboard')) {
      return this.router.url.startsWith(route);
    } else return this.router.url === route;
  }

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
