import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, HostListener, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { SidemenuService } from 'src/app/services/ui/sidemenu.service';
import { ProgressSpinnerComponent } from '../../progress-spinner/progress-spinner.component';
import { UserSettingsService } from 'src/app/services/user/user-settings.service';
import { AuthService } from 'src/app/services/user/auth.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-sidemenu',
  imports: [RouterLink, NgClass, ProgressSpinnerComponent, RouterLinkActive],
  templateUrl: './sidemenu.component.html',
  styleUrl: './sidemenu.component.scss'
})
export class SidemenuComponent {
  protected readonly sidemenuS = inject(SidemenuService);
  protected readonly authS = inject(AuthService);
  protected readonly userSettingsS = inject(UserSettingsService);
  protected readonly elementRef = inject(ElementRef);
  private readonly router = inject(Router);

  pages = [
    { name: 'Übersicht', route: '/dashboard' },
    { name: 'Anträge', route: '/dashboard/antragsliste' },
    { name: 'Feedback', route: '/dashboard/feedback' },
    { name: 'Statistik', route: '/dashboard/statistic' },
    { name: 'Users', route: '/dashboard/users' },
    { name: 'Logs', route: '/dashboard/logs' },
    { name: 'DB Backup', route: '/dashboard/backup' }
  ];

  @HostListener('focusout', ['$event']) onFocusOut(event: FocusEvent) {
    if (event.relatedTarget && !this.elementRef.nativeElement.contains(event.relatedTarget)) {
      this.sidemenuS.closeDashboardSidemenu();
    }
  }

  async logout() {
    await this.authS.logout();
    this.sidemenuS.closeDashboardSidemenu();
    await this.router.navigate(['/login']);
  }
}
