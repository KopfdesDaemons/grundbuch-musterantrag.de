import { Component } from '@angular/core';
import { DashboardTileComponent } from "../../dashboard-tile/dashboard-tile.component";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-antragsliste-tile',
  standalone: true,
  imports: [DashboardTileComponent, RouterLink],
  templateUrl: './antragsliste-tile.component.html',
  styleUrl: './antragsliste-tile.component.scss'
})
export class AntragslisteTileComponent {

}
