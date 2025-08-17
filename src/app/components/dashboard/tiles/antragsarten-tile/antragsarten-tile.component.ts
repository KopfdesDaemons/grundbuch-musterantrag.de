import { Component, inject, OnInit } from '@angular/core';
import { UploadsService } from 'src/app/services/data/uploads.service';
import { DashboardTileComponent } from '../../dashboard-tile/dashboard-tile.component';
import { ProgressSpinnerComponent } from '../../../progress-spinner/progress-spinner.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faRotateRight } from '@fortawesome/free-solid-svg-icons';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorDisplayComponent } from '../../../error-display/error-display.component';

@Component({
  selector: 'app-antragsarten-tile',
  imports: [DashboardTileComponent, ProgressSpinnerComponent, FontAwesomeModule, ErrorDisplayComponent],
  templateUrl: './antragsarten-tile.component.html',
  styleUrl: './antragsarten-tile.component.scss'
})
export class AntragsartenTileComponent implements OnInit {
  uploadsS = inject(UploadsService);

  statistic: { antragsart: string; anzahl: number }[] | undefined = undefined;

  faRotateRight = faRotateRight;
  error: HttpErrorResponse | null = null;

  async ngOnInit(): Promise<void> {
    try {
      this.error = null;
      await this.loadStatistic();
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        this.error = error;
      }
    }
  }

  async loadStatistic() {
    this.statistic = undefined;
    const json = await this.uploadsS.getStatistic();
    if (!json) return;
    const statisticArray = Object.entries(json).map(([key, value]) => ({ antragsart: key, anzahl: value }));
    const sortedStatistic = statisticArray.sort((a, b) => b.anzahl - a.anzahl);
    this.statistic = sortedStatistic;
  }
}
