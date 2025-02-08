import { NgClass } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, inject, OnInit, viewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowRightFromBracket, faGear } from '@fortawesome/free-solid-svg-icons';
import { SidemenuService } from 'src/app/services/sidemenu.service';
import { ProgressSpinnerComponent } from "../../progress-spinner/progress-spinner.component";
import { UserSettingsService } from 'src/app/services/user-settings.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidemenu',
  imports: [RouterLink, NgClass, FontAwesomeModule, ProgressSpinnerComponent],
  templateUrl: './sidemenu.component.html',
  styleUrl: './sidemenu.component.scss'
})
export class SidemenuComponent implements OnInit {
  sidemenuS = inject(SidemenuService);
  authS = inject(AuthService);
  userSettingsS = inject(UserSettingsService);
  router = inject(Router);

  error: HttpErrorResponse | null = null;
  isLoading: boolean = false;

  component = viewChild.required<ElementRef>('sidemenu');

  faArrowRightFromBracket = faArrowRightFromBracket;
  faGear = faGear;

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

  ngOnInit() {
    try {
      this.isLoading = true;
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        this.error = error;
      }
    }
    this.isLoading = false;
  }
}