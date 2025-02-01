import { DOCUMENT } from '@angular/common';
import { Component, effect, ElementRef, inject, Renderer2, viewChild } from '@angular/core';
import { GooglechartsService } from 'src/app/services/googlecharts.service';

@Component({
  selector: 'app-antragsarten',
  imports: [],
  templateUrl: './antragsarten.component.html',
  styleUrl: './antragsarten.component.scss'
})
export class AntragsartenComponent {
  private resizeObserver: ResizeObserver | undefined;
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
      if (!this.chartDiv()) return;

      await this.drawChart(true);

      const entriesSeen = new Set();
      this.resizeObserver = new ResizeObserver(async (entries) => {
        for (const entry of entries) {
          if (!entriesSeen.has(entry.target)) {
            // mache nichts bei Initialisierung
            entriesSeen.add(entry.target);
          } else {
            await this.drawChart();
          }
        }
      });
      // timeout zur Vermeidung der Auslösung aufgrund der Animation
      setTimeout(() => this.resizeObserver?.observe(this.contentDiv()?.nativeElement), 2500);
    })
  }

  async drawChart(refreshData: boolean = false) {
    if (refreshData) this.gCharts.chartRowsAntragsarten = await this.gCharts.getAntragsartenChartRows();
    await this.gCharts.loadAntragsartenChart(this.renderer, this.document, this.chartDiv()?.nativeElement);
  }
}
