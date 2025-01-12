import { AfterViewInit, Component, inject } from '@angular/core';
import { UploadsService } from 'src/app/services/uploads.service';
import { DashboardTileComponent } from "../../dashboard-tile/dashboard-tile.component";
import { ProgressSpinnerComponent } from "../../../progress-spinner/progress-spinner.component";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faRotateRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-antragsarten-tile',
  imports: [DashboardTileComponent, ProgressSpinnerComponent, FontAwesomeModule],
  templateUrl: './antragsarten-tile.component.html',
  styleUrl: './antragsarten-tile.component.scss'
})
export class AntragsartenTileComponent implements AfterViewInit {
  uploadsS = inject(UploadsService);

  statistic: { antragsart: string; anzahl: number }[] | undefined = undefined;

  faRotateRight = faRotateRight;
  error: boolean = false;

  async ngAfterViewInit(): Promise<void> {
    try {
      this.error = false;
      await this.loadStatistic();
    } catch (error) {
      this.error = true;
    }
  }

  async loadStatistic() {
    this.statistic = undefined;
    const json = await this.uploadsS.getStatistic();
    if (!json) return;
    this.statistic = Object.entries(json).map(([key, value]) => ({ antragsart: key, anzahl: value as number }));
  }
}
