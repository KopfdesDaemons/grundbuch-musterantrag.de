import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { DashboardTileComponent } from "../../dashboard-tile/dashboard-tile.component";
import { RouterLink } from '@angular/router';
import { UploadsService } from 'src/app/services/uploads.service';
import { ProgressSpinnerComponent } from "../../../progress-spinner/progress-spinner.component";
import { Upload } from 'server/models/upload';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorDisplayComponent } from "../../../error-display/error-display.component";
import { GooglechartsService } from 'src/app/services/googlecharts.service';
import { GoogleChartComponent } from "../../../google-chart/google-chart.component";

@Component({
  selector: 'app-antragsliste-tile',
  imports: [DashboardTileComponent, RouterLink, ProgressSpinnerComponent, FontAwesomeModule, DatePipe, ErrorDisplayComponent, GoogleChartComponent],
  templateUrl: './antragsliste-tile.component.html',
  styleUrl: './antragsliste-tile.component.scss'
})
export class AntragslisteTileComponent implements OnInit {
  uploadsS = inject(UploadsService);
  totalFiles: number | undefined;
  latestFile: Upload | null | undefined;
  platformId = inject(PLATFORM_ID);
  error: HttpErrorResponse | null = null;
  isLoading: boolean = false;
  gChartS = inject(GooglechartsService);
  lineChartOptions = this.gChartS.getLineChartOptions('month');
  chartData: (string | number)[][] = [];
  chartTimeframe = signal<'week' | 'month'>('month');
  toggleTextMapping = { week: 'Monat', month: 'Woche' };

  // FontAwesome Icons
  faArrowUpRightFromSquare = faArrowUpRightFromSquare;

  async ngOnInit(): Promise<void> {
    try {
      this.totalFiles = await this.uploadsS.getTotalFiles();
      this.latestFile = await this.getLatestFile();
      this.chartData = await this.gChartS.getAntragTimeframeChartRows('month');
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        this.error = error;
      }
    }
    this.isLoading = false;
  }

  async getLatestFile(): Promise<Upload | null> {
    try {
      this.error = null;
      this.isLoading = true;
      if (!isPlatformBrowser(this.platformId)) return null;
      if (this.uploadsS.uploadsData['totalFiles'] === 0) return null;
      const { files } = await this.uploadsS.getFiles();
      const latestFile: Upload = files[0];
      this.isLoading = false;
      return latestFile;
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        this.error = error;
      }
      this.isLoading = false;
      throw error;
    }
  }

  async toggleChartTimeframe() {
    if (this.chartTimeframe() === 'month') {
      this.chartData = await this.gChartS.getAntragTimeframeChartRows('week');
      this.chartTimeframe.set('week');
    } else {
      this.chartData = await this.gChartS.getAntragTimeframeChartRows('month');
      this.chartTimeframe.set('month');
    }
  }
}
