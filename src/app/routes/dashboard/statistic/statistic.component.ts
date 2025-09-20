import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { GoogleChartComponent } from '../../../components/google-chart/google-chart.component';
import { GooglechartsService } from 'src/app/services/integration/googlecharts.service';
import { ErrorDisplayComponent } from '../../../components/error-display/error-display.component';
import { ProgressSpinnerComponent } from '../../../components/progress-spinner/progress-spinner.component';
import { UploadsService } from 'src/app/services/data/uploads.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-statistic',
  imports: [GoogleChartComponent, ErrorDisplayComponent, ProgressSpinnerComponent],
  templateUrl: './statistic.component.html',
  styleUrl: './statistic.component.scss'
})
export class StatisticComponent {
  gChartsS = inject(GooglechartsService);
  uploadsS = inject(UploadsService);
  lineChartOptionsMonth = this.gChartsS.getLineChartOptions('month');
  lineChartOptionsWeek = this.gChartsS.getLineChartOptions('week');
}
