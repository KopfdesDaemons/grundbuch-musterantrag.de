import { formatDate } from '@angular/common';
import { inject, Injectable, LOCALE_ID, Renderer2, DOCUMENT } from '@angular/core';
import { ScriptService } from '../utils/script.service';
import { DesignloaderService } from '../ui/designloader.service';
import { UploadsService } from '../data/uploads.service';
import { ColorHelper } from '../../helpers/color.helper';

@Injectable({
  providedIn: 'root'
})
export class GooglechartsService {
  private loadPromise: Promise<void> | null = null;
  private scriptS = inject(ScriptService);
  private designS = inject(DesignloaderService);
  private uploadsS = inject(UploadsService);
  private local = inject(LOCALE_ID);
  private document = inject(DOCUMENT);


  async loadGoogleCharts(renderer: Renderer2): Promise<void> {
    if (!this.loadPromise) {
      this.loadPromise = (async () => {
        await this.scriptS.addJsScript(renderer, 'https://www.gstatic.com/charts/loader.js');
        const google = (window as any)['google'];
        google.charts.load('current', { packages: ['corechart'] });

        // Waiting for Google Charts to load
        await new Promise<void>((resolve) => {
          google.charts.setOnLoadCallback(resolve);
        });
      })();
    }
    await this.loadPromise;
  }

  async getAntragTimeframeChartRows(timeframe: 'week' | 'month'): Promise<(string | number)[][]> {
    const chartDates = await this.uploadsS.getUploadDatesAndCounts(timeframe);
    const chartRows = [];
    for (const date of chartDates) {
      const formattedDate = formatDate(date.date, 'dd.MM.yyyy', this.local) || '';
      const row = [formattedDate, date.count];
      chartRows.push(row);
    }
    return chartRows;
  }

  async getAntragsartenChartRows(): Promise<(string | number)[][]> {
    const statistic = await this.uploadsS.getStatistic();
    const chartRows = [];
    for (const [antragsart, anzahl] of Object.entries(statistic)) {
      const row = [antragsart, anzahl];
      chartRows.push(row);
    }
    return chartRows;
  }

  getPieChartOptions() {
    const schriftColorRGB = getComputedStyle(document.documentElement).getPropertyValue('--schrift').trim();
    const schriftHEX = ColorHelper.rgbToHexFromString(schriftColorRGB);
    const primaryColor = this.designS.primaryColor || '#20afdf';
    const colors = [primaryColor, ...[20, 30, 40, 50, 60].map(v => ColorHelper.darkenHexColor(primaryColor, v))];
    return {
      legend: { textStyle: { color: schriftHEX } },
      responsive: true,
      colors,
      textStyle: {
        color: schriftHEX,
      },
      chartArea: {
        left: 20,
        top: 20,
        right: 20,
        width: '90%',
        height: '90%'
      },
      backgroundColor: {
        fill: 'transparent',
      },
    };
  }

  getBarChartOptions() {
    const schriftColorRGB = getComputedStyle(document.documentElement).getPropertyValue('--schrift').trim();
    const schriftHEX = ColorHelper.rgbToHexFromString(schriftColorRGB);
    const primaryColor = this.designS.primaryColor || '#20afdf';
    return {
      legend: 'none',
      animation: {
        duration: 400,
        startup: true
      },
      colors: [primaryColor],
      textStyle: {
        color: schriftHEX,
      },
      backgroundColor: {
        fill: 'transparent',
      },
      hAxis: {
        textStyle: { color: schriftHEX }
      },
      vAxis: {
        textStyle: { color: schriftHEX }
      },
    };
  }

  getLineChartOptions(chartTimeframe: 'week' | 'month') {
    const schriftColorRGB = getComputedStyle(this.document.documentElement).getPropertyValue('--schrift').trim();
    const schriftHEX = ColorHelper.rgbToHexFromString(schriftColorRGB);
    const primaryColor = this.designS.primaryColor;
    const axisTextStyle = { color: schriftHEX };
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
        },
      },
      vAxis: {
        gridlines: { color: 'gray' },
        title: 'Anträge',
        textStyle: axisTextStyle,
        titleTextStyle: axisTitleStyle,
      },
      backgroundColor: {
        fill: 'transparent',
      },
      series: {
        0: {
          type: 'line',
          lineWidth: 5,
        }
      },
    };
  }
}