import { Component, ElementRef, inject, input, OnChanges, Renderer2, viewChild } from '@angular/core';
import { GooglechartsService } from 'src/app/services/integration/googlecharts.service';
import { ProgressSpinnerComponent } from "../progress-spinner/progress-spinner.component";

@Component({
  selector: 'app-google-chart',
  imports: [ProgressSpinnerComponent],
  templateUrl: './google-chart.component.html',
  styleUrl: './google-chart.component.scss'
})
export class GoogleChartComponent implements OnChanges {
  renderer = inject(Renderer2);
  gCharts = inject(GooglechartsService);
  chartContainer = viewChild.required<ElementRef>('chartContainer');

  chartType = input.required<'LineChart' | 'PieChart' | 'BarChart' | 'ColumnChart'>();
  chartData = input.required<(string | number)[][]>();
  chartOptions = input.required<any>({});
  chart: any = undefined

  private resizeObserver!: ResizeObserver;
  private resizeTimeout!: number;

  async ngOnChanges(): Promise<void> {
    if (this.chartData().length === 0) return
    await this.gCharts.loadGoogleCharts(this.renderer);
    this.drawChart();
    this.observeResize();
  }

  ngOnDestroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    if (this.chart) this.chart.clearChart();
  }

  private drawChart() {
    const google = (window as any)['google'];

    const data = new google.visualization.DataTable();
    data.addColumn('string');
    data.addColumn('number');
    data.addRows(this.chartData());

    const container = this.chartContainer()?.nativeElement;
    this.chart = new google.visualization[this.chartType()](container);
    this.chart.draw(data, this.chartOptions());
  };

  private observeResize() {
    if (this.resizeObserver) return;
    const entriesSeen = new Set<Element>();

    this.resizeObserver = new ResizeObserver((entries) => {
      let timeoutTriggered = false;

      for (const entry of entries) {
        if (!entriesSeen.has(entry.target)) {
          // Das Element wurde noch nicht gesehen, Initialisierung überspringen
          entriesSeen.add(entry.target);
        } else {
          if (!timeoutTriggered) {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = window.setTimeout(() => {
              this.drawChart();
            }, 200);
            timeoutTriggered = true;
          }
        }
      }
    });
    this.resizeObserver?.observe(this.chartContainer()?.nativeElement);
  }
}
