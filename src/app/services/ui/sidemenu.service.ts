import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidemenuService {
  public DashboaardSidemenuIsOpen = false;

  public toggleDashboardSidemenu() {
    this.DashboaardSidemenuIsOpen = !this.DashboaardSidemenuIsOpen;
  }
}
