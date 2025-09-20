import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidemenuService {
  public DashboaardSidemenuIsOpen = signal(false);

  public toggleDashboardSidemenu() {
    this.DashboaardSidemenuIsOpen.update(value => !value);
  }
}
