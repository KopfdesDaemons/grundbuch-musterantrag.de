import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { DashboardTileComponent } from '../../dashboard-tile/dashboard-tile.component';
import { Router, RouterLink } from '@angular/router';
import { ProgressSpinnerComponent } from '../../../progress-spinner/progress-spinner.component';
import { DatePipe } from '@angular/common';
import { ErrorDisplayComponent } from '../../../error-display/error-display.component';
import { GooglechartsService } from 'src/app/services/integration/googlecharts.service';
import { GoogleChartComponent } from '../../../google-chart/google-chart.component';
import { StatisticService } from 'src/app/services/data/statistic.service';
import { UploadsService } from 'src/app/services/data/uploads.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-antragsliste-tile',
  imports: [DashboardTileComponent, RouterLink, ProgressSpinnerComponent, DatePipe, ErrorDisplayComponent, GoogleChartComponent],
  templateUrl: './antragsliste-tile.component.html',
  styleUrl: './antragsliste-tile.component.scss'
})
export class AntragslisteTileComponent implements OnInit {
  private readonly router = inject(Router);
  protected readonly statisticS = inject(StatisticService);
  protected readonly uploadsS = inject(UploadsService);
  protected readonly gChartS = inject(GooglechartsService);

  protected readonly statisticTimeframe = signal<'week' | 'month'>('month');
  protected readonly toggleTextMapping = { week: 'Woche', month: 'Monat' };

  ngOnInit(): void {
    if (this.router.navigated) {
      this.reload();
    }
  }

  reload() {
    this.uploadsS.setPageToLoad(1);
    this.uploadsS.loadUploads();
    this.statisticS.reloadStatisticLastMonth();
    this.statisticS.reloadStatisticLastWeek();
  }

  chartData = computed(() => {
    if (this.statisticTimeframe() === 'week') {
      return this.gChartS.uploadsTimeframeChartRowsLastWeek();
    }
    return this.gChartS.uploadsTimeframeChartRowsLastMonth();
  });

  statisticResource = computed(() => {
    return this.statisticTimeframe() === 'week' ? this.statisticS.statisticResourceLastWeek : this.statisticS.statisticResourceLastMonth;
  });

  toggleChartTimeframe() {
    this.statisticTimeframe.update(timeframe => (timeframe === 'week' ? 'month' : 'week'));
  }
}
