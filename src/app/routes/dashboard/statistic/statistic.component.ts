import { Component, inject, OnInit } from '@angular/core';
import { GoogleChartComponent } from "../../../components/google-chart/google-chart.component";
import { GooglechartsService } from 'src/app/services/googlecharts.service';

@Component({
  selector: 'app-statistic',
  imports: [GoogleChartComponent],
  templateUrl: './statistic.component.html',
  styleUrl: './statistic.component.scss'
})
export class StatisticComponent implements OnInit {
  gChartsS = inject(GooglechartsService)

  chartDataAntragsArten: (string | number)[][] = [];
  chartDataTimeFrameMonth: (string | number)[][] = [];
  chartDataTimeFrameWeek: (string | number)[][] = [];
  pieChartOptions = this.gChartsS.getPieChartOptions();
  barChartOptions = this.gChartsS.getBarChartOptions();
  lineChartOptionsMonth = this.gChartsS.getLineChartOptions('month');
  lineChartOptionsWeek = this.gChartsS.getLineChartOptions('week');


  async ngOnInit(): Promise<void> {
    this.chartDataAntragsArten = await this.gChartsS.getAntragsartenChartRows();
    this.chartDataTimeFrameMonth = await this.gChartsS.getAntragTimeframeChartRows('month');
    this.chartDataTimeFrameWeek = await this.gChartsS.getAntragTimeframeChartRows('week');
  }
}
