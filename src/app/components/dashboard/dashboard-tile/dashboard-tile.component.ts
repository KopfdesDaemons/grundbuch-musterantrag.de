import { Component, input } from '@angular/core';

@Component({
    selector: 'app-dashboard-tile',
    imports: [],
    templateUrl: './dashboard-tile.component.html',
    styleUrl: './dashboard-tile.component.scss'
})
export class DashboardTileComponent {
  readonly tileTitle = input<string>('');
}
