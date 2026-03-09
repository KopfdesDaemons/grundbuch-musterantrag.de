import { formatDate } from '@angular/common';
import { inject, Injectable, LOCALE_ID, Renderer2, DOCUMENT, computed } from '@angular/core';
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

  getPieChartOptions() {
    this.designS.darkmode();
    const fontColorRGB = getComputedStyle(document.documentElement).getPropertyValue('--font-color').trim();
    const fontHEX = ColorHelper.rgbToHexFromString(fontColorRGB);
    const primaryColor = this.designS.primaryColor() || '#20afdf';
    const colors = [primaryColor, ...[20, 30, 40, 50, 60].map(v => ColorHelper.darkenHexColor(primaryColor, v))];
    return {
      legend: { textStyle: { color: fontHEX } },
      responsive: true,
      colors,
      textStyle: {
        color: fontHEX
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
    const fontColorRGB = getComputedStyle(document.documentElement).getPropertyValue('--font-color').trim();
    const fontHEX = ColorHelper.rgbToHexFromString(fontColorRGB);
    const primaryColor = this.designS.primaryColor() || '#20afdf';
    return {
      legend: 'none',
      animation: {
        duration: 400,
        startup: true
      },
      colors: [primaryColor],
      textStyle: {
        color: fontHEX
      },
      backgroundColor: {
        fill: 'transparent'
      },
      hAxis: {
        textStyle: { color: fontHEX }
      },
      vAxis: {
        textStyle: { color: fontHEX }
      }
    };
  }

  getLineChartOptions(chartTimeframe: 'week' | 'month') {
    this.designS.darkmode();
    const fontColorRGB = getComputedStyle(this.document.documentElement).getPropertyValue('--font-color').trim();
    const fontHEX = ColorHelper.rgbToHexFromString(fontColorRGB);
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
        showTextEvery: chartTimeframe === 'week' ? 2 : 7,
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
