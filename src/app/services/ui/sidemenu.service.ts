import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidemenuService {
  private readonly _dashboardSidemenuIsOpen = signal(false);
  readonly dashboardSidemenuIsOpen = this._dashboardSidemenuIsOpen.asReadonly();

  public toggleDashboardSidemenu() {
    this._dashboardSidemenuIsOpen.update(value => !value);
  }
}
