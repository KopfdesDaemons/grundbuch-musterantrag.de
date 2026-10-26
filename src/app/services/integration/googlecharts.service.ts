import { formatDate, isPlatformBrowser } from '@angular/common';
import { inject, Injectable, LOCALE_ID, Renderer2, DOCUMENT, computed, PLATFORM_ID, signal } from '@angular/core';
import { ScriptService } from '../utils/script.service';
import { DesignloaderService } from '../ui/designloader.service';
import { ColorHelper } from '../../helpers/color.helper';
import { StatisticService } from '../data/statistic.service';

@Injectable({
  providedIn: 'root'
})
export class GooglechartsService {
  private loadPromise: Promise<void> | null = null;
  private readonly scriptS = inject(ScriptService);
  private readonly designS = inject(DesignloaderService);
  private readonly statisticS = inject(StatisticService);
  private readonly local = inject(LOCALE_ID);
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly _useMultiColor = signal(false);
  readonly useMultiColor = this._useMultiColor.asReadonly();

  setUseMultiColor(value: boolean) {
    this._useMultiColor.set(value);
  }

  getColors(): string[] {
    if (this._useMultiColor()) {
      return ['#A52121', '#172F9C', '#B8BB09', '#228615', '#9C21A0', '#169B89'];
    } else {
      const primaryColor = this.designS.primaryColor() || '#20afdf';
      return [
        primaryColor,
        ...[20, 30, 40, 50, 60].map(v => ColorHelper.darkenHexColor(primaryColor, v))
      ];
    }
  }

  async loadGoogleCharts(renderer: Renderer2): Promise<void> {
    if (!this.loadPromise) {
      this.loadPromise = (async () => {
        await this.scriptS.addJsScript(renderer, 'https://www.gstatic.com/charts/loader.js');
        const google = (window as any)['google'];
        google.charts.load('current', { packages: ['corechart'] });

        // Waiting for Google Charts to load
        await new Promise<void>(resolve => {
          google.charts.setOnLoadCallback(resolve);
        });
      })();
    }
    await this.loadPromise;
  }

  private mapStatisticToChartRows(chartDates: { date: string; count: number }[] | undefined | null) {
    if (!chartDates || !Array.isArray(chartDates)) return [];
    const chartRows = [];
    for (const date of chartDates) {
      if (!date?.date) continue;
      const formattedDate = formatDate(date.date, 'dd.MM.yyyy', this.local) || '';
      const row = [formattedDate, date.count];
      chartRows.push(row);
    }
    return chartRows;
  }

  readonly uploadsTimeframeChartRowsLastWeek = computed<(string | number)[][]>(() => {
    return this.mapStatisticToChartRows(this.statisticS.statisticResourceLastWeek.value());
  });

  readonly uploadsTimeframeChartRowsLastMonth = computed<(string | number)[][]>(() => {
    return this.mapStatisticToChartRows(this.statisticS.statisticResourceLastMonth.value());
  });

  readonly uploadsTimeframeChartRowsSpecificTimeframe = computed<(string | number)[][]>(() => {
    return this.mapStatisticToChartRows(this.statisticS.statisticResourceSpecificTimeframe.value());
  });

  readonly uploadTypsChartRows = computed<(string | number)[][]>(() => {
    const statistic = this.statisticS.statisticByTypTotalResource.value();
    if (!statistic) return [];
    return this.getChartRowsForStatistic(statistic);
  });

  readonly uploadTypsAndTimeframeChartRows = computed<(string | number)[][]>(() => {
    const statistic = this.statisticS.statisticByTypAndTimeframeResource.value();
    if (!statistic) return [];
    return this.getChartRowsForStatistic(statistic);
  });

  private getChartRowsForStatistic(statistic: { antragsart: string; anzahl: number }[]) {
    if (!statistic) return [];
    const chartRows = [];
    for (const s of statistic) {
      const row = [s.antragsart, s.anzahl];
      chartRows.push(row);
    }
    return chartRows;
  }

  private getFontHex(): string {
    if (!isPlatformBrowser(this.platformId)) return '#000000';
    const fontColorRGB = getComputedStyle(this.document.documentElement).getPropertyValue('--font-color').trim();
    return fontColorRGB ? ColorHelper.rgbToHexFromString(fontColorRGB) : '#000000';
  }

  getPieChartOptions() {
    this.designS.darkmode();

    return {
      legend: { textStyle: { color: this.getFontHex() } },
      responsive: true,
      colors: this.getColors(),
      textStyle: {
        color: this.getFontHex()
      },
      chartArea: {
        left: 20,
        top: 20,
        right: 20,
        width: '90%',
        height: '90%'
      },
      backgroundColor: {
        fill: 'transparent'
      }
    };
  }

  getBarChartOptions() {
    this.designS.darkmode();
    const primaryColor = this.designS.primaryColor() || '#20afdf';
    return {
      legend: 'none',
      animation: {
        duration: 400,
        startup: true
      },
      colors: this._useMultiColor() ? this.getColors() : [primaryColor],
      textStyle: {
        color: this.getFontHex()
      },
      backgroundColor: {
        fill: 'transparent'
      },
      hAxis: {
        textStyle: { color: this.getFontHex() }
      },
      vAxis: {
        textStyle: { color: this.getFontHex() }
      }
    };
  }

  getLineChartOptions(chartTimeframe: 'week' | 'month' | 'year') {
    this.designS.darkmode();
    const fontHEX = this.getFontHex();
    const primaryColor = this.designS.primaryColor() || '#20afdf';
    const axisTextStyle = { color: fontHEX };
    const axisTitleStyle = { color: primaryColor };

    return {
      animation: {
        duration: 400,
        startup: true
      },
      colors: [primaryColor],
      textStyle: axisTextStyle,
      chartArea: {
        left: 20,
        top: 20,
        right: 20,
        width: '90%',
        height: '75%'
      },
      hAxis: {
        title: 'Tage',
        showTextEvery: chartTimeframe === 'week' ? 2 : chartTimeframe === 'month' ? 7 : 60,
        textStyle: axisTextStyle,
        titleTextStyle: axisTitleStyle,
        viewWindow: {
          min: new Date(2014, 11, 31, 18),
          max: new Date(2015, 0, 3, 1)
        }
      },
      vAxis: {
        gridlines: { color: 'gray' },
        title: 'Anträge',
        textStyle: axisTextStyle,
        titleTextStyle: axisTitleStyle
      },
      backgroundColor: {
        fill: 'transparent'
      },
      series: {
        0: {
          type: 'line',
          lineWidth: 5
        }
      }
    };
  }
}
