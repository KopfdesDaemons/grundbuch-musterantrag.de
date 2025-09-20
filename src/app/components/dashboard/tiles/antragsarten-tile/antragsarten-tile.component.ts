import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { UploadsService } from 'src/app/services/data/uploads.service';
import { DashboardTileComponent } from '../../dashboard-tile/dashboard-tile.component';
import { ProgressSpinnerComponent } from '../../../progress-spinner/progress-spinner.component';
import { ErrorDisplayComponent } from '../../../error-display/error-display.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-antragsarten-tile',
  imports: [DashboardTileComponent, ProgressSpinnerComponent, ErrorDisplayComponent],
  templateUrl: './antragsarten-tile.component.html',
  styleUrl: './antragsarten-tile.component.scss'
})
export class AntragsartenTileComponent {
  uploadsS = inject(UploadsService);
}
