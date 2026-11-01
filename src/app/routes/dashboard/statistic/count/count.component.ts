import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, PLATFORM_ID, signal } from '@angular/core';
import { GoogleChartComponent } from '../../../../components/google-chart/google-chart.component';
import { GooglechartsService } from 'src/app/services/integration/googlecharts.service';
import { ErrorDisplayComponent } from '../../../../components/error-display/error-display.component';
import { ProgressSpinnerComponent } from '../../../../components/progress-spinner/progress-spinner.component';
import { StatisticService } from 'src/app/services/data/statistic.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-count',
  imports: [GoogleChartComponent, ErrorDisplayComponent, ProgressSpinnerComponent],
  templateUrl: './count.component.html',
  styleUrl: './count.component.scss'
})
export class CountComponent {
  private readonly platformId = inject(PLATFORM_ID);
  protected readonly gChartsS = inject(GooglechartsService);
  protected readonly statisticS = inject(StatisticService);

  private readonly STORAGE_KEYS = {
    multiColor: 'statistic_count_multiColor',
    timeframeViewMode: 'statistic_count_timeframeViewMode',
    antragsartenChartType: 'statistic_count_antragsartenChartType'
  } as const;

  protected readonly multiColor = this.gChartsS.useMultiColor;

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const savedMultiColor = localStorage.getItem(this.STORAGE_KEYS.multiColor);
      this.gChartsS.setUseMultiColor(savedMultiColor === 'true');

      const savedTimeframeMode = localStorage.getItem(this.STORAGE_KEYS.timeframeViewMode);
      if (savedTimeframeMode === 'LineChart' || savedTimeframeMode === 'Grid') {
        this.timeframeViewMode.set(savedTimeframeMode);
      }

      const savedChartType = localStorage.getItem(this.STORAGE_KEYS.antragsartenChartType);
      if (savedChartType === 'PieChart' || savedChartType === 'ColumnChart') {
        this.antragsartenChartType.set(savedChartType);
      }
    } else {
      this.gChartsS.setUseMultiColor(false);
    }
  }

  toggleMultiColor(enabled?: boolean) {
    const next = enabled !== undefined ? enabled : !this.multiColor();
    this.gChartsS.setUseMultiColor(next);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.STORAGE_KEYS.multiColor, String(next));
    }
  }

  protected readonly pieChartOptions = computed(() => {
    return this.gChartsS.getPieChartOptions();
  });

  protected readonly barChartOptions = computed(() => {
    return this.gChartsS.getBarChartOptions();
  });

  protected readonly timeframeViewMode = signal<'LineChart' | 'Grid'>('LineChart');
  protected readonly timeframeToggleTextMapping: Record<'LineChart' | 'Grid', string> = {
    LineChart: 'Linie',
    Grid: 'Grid'
  };

  toggleTimeframeViewMode() {
    const next = this.timeframeViewMode() === 'LineChart' ? 'Grid' : 'LineChart';
    this.timeframeViewMode.set(next);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.STORAGE_KEYS.timeframeViewMode, next);
    }
  }

  protected readonly weekdayLabels = ['Mo', '', 'Mi', '', 'Fr', '', 'So'];
  private readonly shortMonthNames = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];

  protected readonly contributionGridWeeks = computed(() => {
    const resource = this.statisticS.statisticResourceSpecificTimeframe;
    if (resource.isLoading() || resource.error()) {
      return [];
    }
    const rawDays = resource.value() ?? [];
    if (rawDays.length === 0) {
      return [];
    }

    const maxCount = rawDays.reduce((max, day) => Math.max(max, day.count || 0), 0);
    const weeks: {
      monthLabel: string;
      days: ({ count: number; level: 0 | 1 | 2 | 3 | 4; tooltip: string } | null)[];
    }[] = [];

    let lastLabeledMonthKey = '';
    const showYearInLabel = this.selectedYear() === undefined;

    for (const item of rawDays) {
      if (!item?.date) continue;
      const dateObj = new Date(item.date);
      const dayOfWeek = (dateObj.getDay() + 6) % 7; // 0 = Montag, 6 = Sonntag

      if (weeks.length === 0 || dayOfWeek === 0) {
        weeks.push({
          monthLabel: '',
          days: [null, null, null, null, null, null, null]
        });
      }

      const currentWeek = weeks[weeks.length - 1];
      const month = dateObj.getMonth();
      const year = dateObj.getFullYear();
      const monthKey = `${year}-${month}`;

      if (monthKey !== lastLabeledMonthKey) {
        const label = showYearInLabel ? `${this.shortMonthNames[month]} '${String(year).slice(-2)}` : this.shortMonthNames[month];
        if (weeks.length === 2 && weeks[0].monthLabel !== '') {
          weeks[0].monthLabel = '';
        }
        currentWeek.monthLabel = label;
        lastLabeledMonthKey = monthKey;
      }

      const count = item.count || 0;
      let level: 0 | 1 | 2 | 3 | 4 = 0;
      if (count > 0 && maxCount > 0) {
        const ratio = count / maxCount;
        level = ratio <= 0.25 ? 1 : ratio <= 0.5 ? 2 : ratio <= 0.75 ? 3 : 4;
      }

      const dd = String(dateObj.getDate()).padStart(2, '0');
      const mm = String(month + 1).padStart(2, '0');
      const tooltip = `${dd}.${mm}.${year}: ${count} ${count === 1 ? 'Antrag' : 'Anträge'}`;

      currentWeek.days[dayOfWeek] = { count, level, tooltip };
    }

    return weeks;
  });

  protected readonly antragsartenChartType = signal<'PieChart' | 'ColumnChart'>('PieChart');
  protected readonly toggleTextMapping: Record<'PieChart' | 'ColumnChart', string> = {
    PieChart: 'Kreis',
    ColumnChart: 'Säulen'
  };

  protected readonly antragsartenChartOptions = computed(() => {
    return this.antragsartenChartType() === 'PieChart' ? this.pieChartOptions() : this.barChartOptions();
  });

  toggleChartType() {
    const next = this.antragsartenChartType() === 'PieChart' ? 'ColumnChart' : 'PieChart';
    this.antragsartenChartType.set(next);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.STORAGE_KEYS.antragsartenChartType, next);
    }
  }

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
  protected selectedYear = signal<number | undefined>(new Date().getFullYear());

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

  monthChanged(month: string) {
    const newMonth = month === 'all' ? undefined : this.monthNames.indexOf(month);
    this.selectedMonth.set(newMonth);
    const year = this.selectedYear();
    this.statisticS.setStatisticSpecificTimeframe(newMonth === undefined || year === undefined ? undefined : newMonth + 1, year);
  }

  yearChanged(year: string) {
    const newYear = year === 'all' ? undefined : Number(year);
    this.selectedYear.set(newYear);
    if (newYear === undefined) {
      this.selectedMonth.set(undefined);
      this.statisticS.setStatisticSpecificTimeframe(undefined, undefined);
    } else {
      const month = this.selectedMonth();
      this.statisticS.setStatisticSpecificTimeframe(month === undefined ? undefined : month + 1, newYear);
    }
  }

  reload() {
    this.statisticS.reloadStatisticSpecificTimeframe();
    this.statisticS.reloadStatisticByTypAndTimeframe();
  }
}
