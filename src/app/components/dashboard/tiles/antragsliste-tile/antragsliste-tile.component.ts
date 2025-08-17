import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { DashboardTileComponent } from '../../dashboard-tile/dashboard-tile.component';
import { RouterLink } from '@angular/router';
import { UploadsService } from 'src/app/services/data/uploads.service';
import { ProgressSpinnerComponent } from '../../../progress-spinner/progress-spinner.component';
import { Upload } from 'server/models/upload.model';
import { faArrowUpRightFromSquare, faRotateRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorDisplayComponent } from '../../../error-display/error-display.component';
import { GooglechartsService } from 'src/app/services/integration/googlecharts.service';
import { GoogleChartComponent } from '../../../google-chart/google-chart.component';

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
  errorLatestFile: HttpErrorResponse | null = null;
  isLoadinglatestFile: boolean = true;
  errorChart: HttpErrorResponse | null = null;
  isLoadingChart: boolean = false;
  gChartS = inject(GooglechartsService);
  lineChartOptions = this.gChartS.getLineChartOptions('month');
  chartData: (string | number)[][] = [];
  chartTimeframe = signal<'week' | 'month'>('month');
  toggleTextMapping = { week: 'Woche', month: 'Monat' };

  // FontAwesome Icons
  faArrowUpRightFromSquare = faArrowUpRightFromSquare;
  faRotateRight = faRotateRight;

  async ngOnInit(): Promise<void> {
    await this.loadData();
  }

  async loadData(): Promise<void> {
    await Promise.all([this.loadLatestFile(), this.loadChart()]);
  }

  async loadLatestFile(): Promise<void> {
    try {
      this.totalFiles = await this.uploadsS.getTotalFiles();
      this.latestFile = await this.getLatestFile();
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        this.errorLatestFile = error;
      }
    }
    this.isLoadinglatestFile = false;
  }

  async loadChart(): Promise<void> {
    try {
      this.errorChart = null;
      this.isLoadingChart = true;
      this.chartData = await this.gChartS.getAntragTimeframeChartRows('month');
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        this.errorChart = error;
      }
    }
    this.isLoadingChart = false;
  }

  async getLatestFile(): Promise<Upload | null> {
    try {
      this.errorLatestFile = null;
      this.isLoadinglatestFile = true;
      if (!isPlatformBrowser(this.platformId)) return null;
      if (this.uploadsS.uploadsData['totalFiles'] === 0) return null;
      const { files } = await this.uploadsS.getFiles();
      const latestFile: Upload = files[0];
      this.isLoadinglatestFile = false;
      return latestFile;
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        this.errorLatestFile = error;
      }
      this.isLoadinglatestFile = false;
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
