import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, inject, OnInit, viewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SidemenuService } from 'src/app/services/ui/sidemenu.service';
import { ProgressSpinnerComponent } from '../../progress-spinner/progress-spinner.component';
import { UserSettingsService } from 'src/app/services/user/user-settings.service';
import { AuthService } from 'src/app/services/user/auth.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-sidemenu',
  imports: [RouterLink, NgClass, ProgressSpinnerComponent],
  templateUrl: './sidemenu.component.html',
  styleUrl: './sidemenu.component.scss'
})
export class SidemenuComponent implements OnInit {
  sidemenuS = inject(SidemenuService);
  authS = inject(AuthService);
  userSettingsS = inject(UserSettingsService);
  router = inject(Router);
  component = viewChild.required<ElementRef>('sidemenu');

  ngOnInit(): void {
    if (!this.userSettingsS.usernameResource.isLoading()) {
      this.userSettingsS.usernameResource.reload();
    }
    if (!this.userSettingsS.userRoleResource.isLoading()) {
      this.userSettingsS.userRoleResource.reload();
    }
  }

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
