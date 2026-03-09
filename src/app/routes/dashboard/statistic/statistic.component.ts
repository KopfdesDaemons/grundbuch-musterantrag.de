import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { GoogleChartComponent } from '../../../components/google-chart/google-chart.component';
import { GooglechartsService } from 'src/app/services/integration/googlecharts.service';
import { ErrorDisplayComponent } from '../../../components/error-display/error-display.component';
import { ProgressSpinnerComponent } from '../../../components/progress-spinner/progress-spinner.component';
import { StatisticService } from 'src/app/services/data/statistic.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-statistic',
  imports: [GoogleChartComponent, ErrorDisplayComponent, ProgressSpinnerComponent],
  templateUrl: './statistic.component.html',
  styleUrl: './statistic.component.scss'
})
export class StatisticComponent {
  protected readonly gChartsS = inject(GooglechartsService);
  protected readonly statisticS = inject(StatisticService);

  protected readonly monthNames = [
    'Januar',
    'Februar',
    'März',
    'April',
    'Mai',
    'Juni',
    'Juli',
    'August',
    'September',
    'Oktober',
    'November',
    'Dezember'
  ];
  protected readonly years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
  protected selectedMonth = signal<number | undefined>(new Date().getMonth());
  protected selectedYear = signal<number>(new Date().getFullYear());

  protected readonly timeframe = computed(() => {
    return this.selectedMonth() === undefined ? 'year' : 'month';
  });

  protected readonly totalUploadsByFilterOption = computed(() => {
    const resource = this.statisticS.statisticResourceSpecificTimeframe;
    if (resource.isLoading() || resource.error()) {
      return 0;
    }
    return (resource.value() ?? []).reduce((total, day) => total + (day.count || 0), 0);
  });

  constructor() {
    effect(() => {
      const month = this.selectedMonth();
      const year = this.selectedYear();
      this.statisticS.setStatisticSpecificTimeframe(month === undefined ? undefined : month + 1, year);
    });
  }

  monthChanged(month: string) {
    this.selectedMonth.set(month === 'all' ? undefined : this.monthNames.indexOf(month));
  }

  yearChanged(year: string) {
    this.selectedYear.set(Number(year));
  }

  reload() {
    this.statisticS.reloadStatisticSpecificTimeframe();
    this.statisticS.reloadStatisticByTypAndTimeframe();
  }
}
