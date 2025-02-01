import { NgClass } from '@angular/common';
import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/services/auth.service';
import { SidemenuService } from 'src/app/services/sidemenu.service';

@Component({
  selector: 'app-sidemenu',
  imports: [RouterLink, NgClass, FontAwesomeModule],
  templateUrl: './sidemenu.component.html',
  styleUrl: './sidemenu.component.scss'
})
export class SidemenuComponent {
  sidemenuS = inject(SidemenuService);
  authS = inject(AuthService);
  router = inject(Router);

  component = viewChild.required<ElementRef>('sidemenu');

  faArrowRightFromBracket = faArrowRightFromBracket;

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
}
