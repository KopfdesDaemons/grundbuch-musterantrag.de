import { formatDate, isPlatformBrowser } from '@angular/common';
import { inject, Injectable, LOCALE_ID, PLATFORM_ID, Renderer2 } from '@angular/core';
import { ScriptService } from './script.service';
import { FarbconverterService } from './farbconverter.service';
import { DesignloaderService } from './designloader.service';
import { UploadsService } from './uploads.service';

@Injectable({
  providedIn: 'root'
})
export class GooglechartsService {
  isLoaded: boolean = false;
  platformId = inject(PLATFORM_ID);
  scriptS = inject(ScriptService);
  farbS = inject(FarbconverterService);
  designS = inject(DesignloaderService);
  uploadsS = inject(UploadsService);
  local = inject(LOCALE_ID);
  chartRows: (string | number)[][] = [];

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

  async loadAntragsanzahlTimeframeChart(renderer: Renderer2, document: Document, chartDiv: HTMLElement, chartTimeframe: 'week' | 'month'): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;
    await this.scriptS.addJsScript(renderer, 'https://www.gstatic.com/charts/loader.js');
    if (this.chartRows.length === 0) this.chartRows = await this.getAntragTimeframeChartRows(chartTimeframe);
    const google = (window as any)['google'];
    const schriftColorRGB = getComputedStyle(document.documentElement).getPropertyValue('--schrift').trim();
    const rgbNumbers = schriftColorRGB.match(/\d+/g);
    const rgbArray = rgbNumbers!.map(Number);
    const schriftHEX = this.farbS.rgbToHex(rgbArray[0], rgbArray[1], rgbArray[2]);
    const primaryColor = this.designS.primaryColor;

    const drawBasic = () => {
      this.isLoaded = true;
      const data = new google.visualization.DataTable();
      data.addColumn('string', 'X');
      data.addColumn('number', 'Anträge');
      data.addRows(this.chartRows);

      const options = {
        legend: 'none',
        responsive: true,
        animation: {
          duration: 400,
          startup: true
        },
        colors: [primaryColor],
        textStyle: {
          color: schriftHEX,
        },
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
          textStyle: {
            color: schriftHEX,
          },
          titleTextStyle: {
            color: primaryColor,
          },
          viewWindow: {
            min: new Date(2014, 11, 31, 18),
            max: new Date(2015, 0, 3, 1)
          },
        },
        vAxis: {
          title: 'Anträge',
          textStyle: {
            color: schriftHEX,
          },
          titleTextStyle: {
            color: primaryColor,
          },
        },
        backgroundColor: {
          fill: 'transparent',
        },
        series: {
          0: {
            type: 'line',
            color: primaryColor,
            lineWidth: 5,
          }
        },

      };

      const chart = new google.visualization.LineChart(chartDiv);

      chart.draw(data, options);
    }

    if (!google || !google.charts) return;
    google.charts.load('current', { packages: ['corechart', 'line'] });

    if (this.isLoaded) drawBasic();
    else google.charts.setOnLoadCallback(drawBasic);
  }
}