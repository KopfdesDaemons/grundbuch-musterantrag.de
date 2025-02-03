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

  chartData: (string | number)[][] = [];
  chartData2: (string | number)[][] = [];
  pieChartOptions = this.gChartsS.getPieChartOptions();
  lineChartOptions = this.gChartsS.getLineChartOptions('month');


  async ngOnInit(): Promise<void> {
    this.chartData = await this.gChartsS.getAntragsartenChartRows();
    this.chartData2 = await this.gChartsS.getAntragTimeframeChartRows('month');
  }
}
