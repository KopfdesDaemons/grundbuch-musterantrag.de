import { NgClass } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, inject, OnInit, viewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/services/auth.service';
import { SidemenuService } from 'src/app/services/sidemenu.service';
import { ProgressSpinnerComponent } from "../../progress-spinner/progress-spinner.component";

@Component({
  selector: 'app-sidemenu',
  imports: [RouterLink, NgClass, FontAwesomeModule, ProgressSpinnerComponent],
  templateUrl: './sidemenu.component.html',
  styleUrl: './sidemenu.component.scss'
})
export class SidemenuComponent implements OnInit {
  sidemenuS = inject(SidemenuService);
  authS = inject(AuthService);
  router = inject(Router);

  username: string = '';
  userRoleName: string = '';
  error: HttpErrorResponse | null = null;
  isLoading: boolean = false;

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

  async ngOnInit(): Promise<void> {
    try {
      this.isLoading = true;
      this.username = await this.authS.getUsername();
      this.userRoleName = await this.authS.getUserRoleName();
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        this.error = error;
      }
    }
    this.isLoading = false;
  }
}