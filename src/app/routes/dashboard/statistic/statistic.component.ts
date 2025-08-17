import { Component, inject, OnInit } from '@angular/core';
import { GoogleChartComponent } from '../../../components/google-chart/google-chart.component';
import { GooglechartsService } from 'src/app/services/integration/googlecharts.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorDisplayComponent } from '../../../components/error-display/error-display.component';
import { ProgressSpinnerComponent } from '../../../components/progress-spinner/progress-spinner.component';

@Component({
  selector: 'app-statistic',
  imports: [GoogleChartComponent, ErrorDisplayComponent, ProgressSpinnerComponent],
  templateUrl: './statistic.component.html',
  styleUrl: './statistic.component.scss'
})
export class StatisticComponent implements OnInit {
  gChartsS = inject(GooglechartsService);

  chartDataAntragsArten: (string | number)[][] = [];
  chartDataTimeFrameMonth: (string | number)[][] = [];
  chartDataTimeFrameWeek: (string | number)[][] = [];
  pieChartOptions = this.gChartsS.getPieChartOptions();
  barChartOptions = this.gChartsS.getBarChartOptions();
  lineChartOptionsMonth = this.gChartsS.getLineChartOptions('month');
  lineChartOptionsWeek = this.gChartsS.getLineChartOptions('week');

  error: HttpErrorResponse | null = null;
  isLoading = true;

  async ngOnInit(): Promise<void> {
    try {
      this.error = null;
      this.chartDataAntragsArten = await this.gChartsS.getAntragsartenChartRows();
      this.chartDataTimeFrameMonth = await this.gChartsS.getAntragTimeframeChartRows('month');
      this.chartDataTimeFrameWeek = await this.gChartsS.getAntragTimeframeChartRows('week');
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        this.error = error;
      }
    }
    this.isLoading = false;
  }
}
