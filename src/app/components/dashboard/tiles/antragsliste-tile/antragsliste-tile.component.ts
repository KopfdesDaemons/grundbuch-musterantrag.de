import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DashboardTileComponent } from '../../dashboard-tile/dashboard-tile.component';
import { RouterLink } from '@angular/router';
import { UploadsService } from 'src/app/services/data/uploads.service';
import { ProgressSpinnerComponent } from '../../../progress-spinner/progress-spinner.component';
import { DatePipe } from '@angular/common';
import { ErrorDisplayComponent } from '../../../error-display/error-display.component';
import { GooglechartsService } from 'src/app/services/integration/googlecharts.service';
import { GoogleChartComponent } from '../../../google-chart/google-chart.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-antragsliste-tile',
  imports: [DashboardTileComponent, RouterLink, ProgressSpinnerComponent, DatePipe, ErrorDisplayComponent, GoogleChartComponent],
  templateUrl: './antragsliste-tile.component.html',
  styleUrl: './antragsliste-tile.component.scss'
})
export class AntragslisteTileComponent {
  uploadsS = inject(UploadsService);
  gChartS = inject(GooglechartsService);

  statisticTimeframe = signal<'week' | 'month'>('month');
  toggleTextMapping = { week: 'Woche', month: 'Monat' };

  lineChartOptions = computed(() => this.gChartS.getLineChartOptions(this.statisticTimeframe()));

  reload() {
    this.uploadsS.uploadsResource.reload();
    this.uploadsS.statisticResourceMonth.reload();
    this.uploadsS.statisticResourceWeek.reload();
  }

  chartData = computed(() => {
    if (this.statisticTimeframe() === 'week') {
      return this.gChartS.uploadsTimeframeChartRowsWeek();
    }
    return this.gChartS.uploadsTimeframeChartRowsMonth();
  });

  statisticResource = computed(() => {
    return this.statisticTimeframe() === 'week' ? this.uploadsS.statisticResourceWeek : this.uploadsS.statisticResourceMonth;
  });

  toggleChartTimeframe() {
    this.statisticTimeframe.update(timeframe => (timeframe === 'week' ? 'month' : 'week'));
  }
}
