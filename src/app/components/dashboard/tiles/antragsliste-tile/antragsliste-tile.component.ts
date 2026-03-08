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
  protected readonly uploadsS = inject(UploadsService);
  protected readonly gChartS = inject(GooglechartsService);

  protected readonly statisticTimeframe = signal<'week' | 'month'>('month');
  protected readonly toggleTextMapping = { week: 'Woche', month: 'Monat' };

  reload() {
    this.uploadsS.setPageToLoad(1);
    this.uploadsS.loadUploads();
    this.uploadsS.reloadStatisticLastMonth();
    this.uploadsS.reloadStatisticLastWeek();
  }

  chartData = computed(() => {
    if (this.statisticTimeframe() === 'week') {
      return this.gChartS.uploadsTimeframeChartRowsLastWeek();
    }
    return this.gChartS.uploadsTimeframeChartRowsLastMonth();
  });

  statisticResource = computed(() => {
    return this.statisticTimeframe() === 'week' ? this.uploadsS.statisticResourceLastWeek : this.uploadsS.statisticResourceLastMonth;
  });

  toggleChartTimeframe() {
    this.statisticTimeframe.update(timeframe => (timeframe === 'week' ? 'month' : 'week'));
  }
}
