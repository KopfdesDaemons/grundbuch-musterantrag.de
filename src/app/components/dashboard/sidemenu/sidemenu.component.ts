import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, HostListener, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
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
export class SidemenuComponent implements OnInit {
  protected readonly sidemenuS = inject(SidemenuService);
  protected readonly authS = inject(AuthService);
  protected readonly userSettingsS = inject(UserSettingsService);
  protected readonly elementRef = inject(ElementRef);

  ngOnInit(): void {
    this.userSettingsS.reloadUsername();
    this.userSettingsS.reloadUserRole();
  }

  pages = [
    { name: 'Übersicht', route: '/dashboard' },
    { name: 'Uploads', route: '/dashboard/antragsliste' },
    { name: 'Statistik', route: '/dashboard/statistic' },
    { name: 'Users', route: '/dashboard/users' }
  ];

  @HostListener('focusout', ['$event']) onFocusOut(event: FocusEvent) {
    if (event.relatedTarget && !this.elementRef.nativeElement.contains(event.relatedTarget as Node)) {
      this.sidemenuS.toggleDashboardSidemenu();
    }
  }
}
