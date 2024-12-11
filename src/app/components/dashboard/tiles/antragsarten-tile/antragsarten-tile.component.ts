import { Component, inject, OnInit } from '@angular/core';
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
export class AntragsartenTileComponent implements OnInit {
  uploadsS = inject(UploadsService);

  statistic: { antragsart: string; anzahl: number }[] | undefined = undefined;

  faRotateRight = faRotateRight;

  ngOnInit(): void {
    this.loadStatistic();
  }

  async loadStatistic() {
    this.statistic = undefined;
    const json = await this.uploadsS.getStatistic();
    if (!json) return;
    this.statistic = Object.entries(json).map(([key, value]) => ({ antragsart: key, anzahl: value as number }));
  }

  async genereateStatistic() {
    await this.uploadsS.generateStatistic();
    await this.loadStatistic();
  }
}
