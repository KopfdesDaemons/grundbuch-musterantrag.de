import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DashboardTileComponent } from '../../dashboard-tile/dashboard-tile.component';
import { ProgressSpinnerComponent } from '../../../progress-spinner/progress-spinner.component';
import { ErrorDisplayComponent } from '../../../error-display/error-display.component';
import { StatisticService } from 'src/app/services/data/statistic.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-antragsarten-tile',
  imports: [DashboardTileComponent, ProgressSpinnerComponent, ErrorDisplayComponent],
  templateUrl: './antragsarten-tile.component.html',
  styleUrl: './antragsarten-tile.component.scss'
})
export class AntragsartenTileComponent {
  protected readonly statisticS = inject(StatisticService);
}
