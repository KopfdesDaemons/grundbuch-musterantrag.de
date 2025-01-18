import { DOCUMENT } from '@angular/common';
import { Component, effect, ElementRef, inject, Renderer2, viewChild } from '@angular/core';
import { GooglechartsService } from 'src/app/services/googlecharts.service';

@Component({
  selector: 'app-antragsanzahltimeframe',
  imports: [],
  templateUrl: './antragsanzahltimeframe.component.html',
  styleUrl: './antragsanzahltimeframe.component.scss'
})
export class AntragsanzahltimeframeComponent {
  private resizeObserver: ResizeObserver | undefined;
  chartDates: { date: string, count: number }[] = [];
  chartRows: (string | number)[][] = [];
  chartTimeframe: 'Woche' | 'Monat' = 'Monat';
  readonly contentDiv = viewChild.required<ElementRef>('content');
  readonly chartDiv = viewChild<ElementRef>('chart_div');
  gCharts = inject(GooglechartsService);
  renderer = inject(Renderer2);
  document = inject(DOCUMENT);

  ngOnDestroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  constructor() {
    effect(async () => {
      const timeframe = this.chartTimeframe === 'Woche' ? 'week' : 'month';
      if (!this.chartDiv()) return;
      await this.gCharts.loadAntragsanzahlTimeframeChart(this.renderer, this.document, this.chartDiv()?.nativeElement, timeframe);

      const entriesSeen = new Set();
      this.resizeObserver = new ResizeObserver(async (entries) => {
        for (const entry of entries) {
          if (!entriesSeen.has(entry.target)) {
            // mache nichts bei Initialisierung
            entriesSeen.add(entry.target);
          } else {
            await this.gCharts.loadAntragsanzahlTimeframeChart(this.renderer, this.document, this.chartDiv()?.nativeElement, timeframe);
          }
        }
      });
      // timeout zur Vermeidung der Auslösung aufgrund der Animation
      setTimeout(() => this.resizeObserver?.observe(this.contentDiv()?.nativeElement), 1000);
    })
  }

  async changeChartTimeframe() {
    this.chartTimeframe = this.chartTimeframe === 'Woche' ? 'Monat' : 'Woche';
    const timeframe = this.chartTimeframe === 'Monat' ? 'month' : 'week';
    this.gCharts.chartRows = await this.gCharts.getAntragTimeframeChartRows(timeframe);

    await this.gCharts.loadAntragsanzahlTimeframeChart(this.renderer, this.document, this.chartDiv()?.nativeElement, timeframe);
  }
}
