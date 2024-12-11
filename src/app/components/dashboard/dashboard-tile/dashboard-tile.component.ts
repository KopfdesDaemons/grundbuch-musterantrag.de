import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-dashboard-tile',
    imports: [],
    templateUrl: './dashboard-tile.component.html',
    styleUrl: './dashboard-tile.component.scss'
})
export class DashboardTileComponent {
  @Input() tileTitle: string = '';
}
