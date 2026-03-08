import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { GoogleChartComponent } from '../../../components/google-chart/google-chart.component';
import { GooglechartsService } from 'src/app/services/integration/googlecharts.service';
import { ErrorDisplayComponent } from '../../../components/error-display/error-display.component';
import { ProgressSpinnerComponent } from '../../../components/progress-spinner/progress-spinner.component';
import { UploadsService } from 'src/app/services/data/uploads.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-statistic',
  imports: [GoogleChartComponent, ErrorDisplayComponent, ProgressSpinnerComponent],
  templateUrl: './statistic.component.html',
  styleUrl: './statistic.component.scss'
})
export class StatisticComponent {
  protected readonly gChartsS = inject(GooglechartsService);
  protected readonly uploadsS = inject(UploadsService);
  protected readonly lineChartOptionsMonth = this.gChartsS.getLineChartOptions('month');
  protected readonly lineChartOptionsWeek = this.gChartsS.getLineChartOptions('week');

  protected readonly monthNames = [
    'Januar',
    'Februar',
    'März',
    'April',
    'Mai',
    'Juni',
    'Juli',
    'August',
    'September',
    'Oktober',
    'November',
    'Dezember'
  ];
  protected readonly years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
  protected selectedMonth = new Date().getMonth();
  protected selectedYear = new Date().getFullYear();

  constructor() {
    this.setStatisticForSpecificTimeframe(this.selectedMonth + 1, this.selectedYear);
  }

  setStatisticForSpecificTimeframe(month: number, year: number) {
    this.uploadsS.setStatisticSpecificTimeframe(month, year);
  }

  monthChanged(month: string) {
    this.selectedMonth = this.monthNames.indexOf(month);
    this.setStatisticForSpecificTimeframe(this.selectedMonth + 1, this.selectedYear);
  }

  yearChanged(year: string) {
    this.selectedYear = Number(year);
    this.setStatisticForSpecificTimeframe(this.selectedMonth + 1, this.selectedYear);
  }
}
