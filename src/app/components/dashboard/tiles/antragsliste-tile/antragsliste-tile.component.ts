import { AfterViewInit, Component, ElementRef, inject, OnInit, PLATFORM_ID, Renderer2, viewChild } from '@angular/core';
import { DashboardTileComponent } from "../../dashboard-tile/dashboard-tile.component";
import { RouterLink } from '@angular/router';
import { UploadsService } from 'src/app/services/uploads.service';
import { ProgressSpinnerComponent } from "../../../progress-spinner/progress-spinner.component";
import { Upload } from 'server/models/upload';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { ScriptService } from 'src/app/services/script.service';
import { FarbconverterService } from 'src/app/services/farbconverter.service';
import { DesignloaderService } from 'src/app/services/designloader.service';

@Component({
  selector: 'app-antragsliste-tile',
  imports: [DashboardTileComponent, RouterLink, ProgressSpinnerComponent, FontAwesomeModule, DatePipe],
  templateUrl: './antragsliste-tile.component.html',
  styleUrl: './antragsliste-tile.component.scss'
})
export class AntragslisteTileComponent implements OnInit, AfterViewInit {
  uploadsS = inject(UploadsService);
  scriptS = inject(ScriptService)
  renderer = inject(Renderer2);
  farbS = inject(FarbconverterService);
  designS = inject(DesignloaderService);
  private resizeObserver!: ResizeObserver;
  totalFiles: number | undefined;
  latestFile: Upload | null | undefined;
  platformId = inject(PLATFORM_ID);
  error: boolean = false;
  chartDates: { date: string, count: number }[] = [];
  chartRows: (string | number)[][] = [];
  readonly contentDiv = viewChild.required<ElementRef>('content');

  // FontAwesome Icons
  faArrowUpRightFromSquare = faArrowUpRightFromSquare;

  async ngOnInit(): Promise<void> {
    try {
      this.error = false;
      this.totalFiles = await this.uploadsS.getTotalFiles();
      this.latestFile = await this.getLatestFile();
    } catch (error) {
      this.error = true;
    }
  }

  ngOnDestroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  async ngAfterViewInit(): Promise<void> {
    this.resizeObserver = new ResizeObserver(async () => {
      await this.loadChart();
    });
    this.resizeObserver.observe(this.contentDiv().nativeElement);
    this.getChartDates();
    await this.loadChart();
  }

  async getChartDates() {
    this.chartDates = await this.uploadsS.getUploadDatesAndCounts('week');
    for (const date of this.chartDates) {
      const row = [date.date, date.count];
      this.chartRows.push(row);
    }
  }

  async getLatestFile(): Promise<Upload | null> {
    if (!isPlatformBrowser(this.platformId)) return null;
    if (this.uploadsS.uploadsData['totalFiles'] === 0) return null;
    const { files } = await this.uploadsS.getFiles();
    const latestFile: Upload = files[0];
    return latestFile;
  }

  async loadChart(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;
    await this.scriptS.reloadJsScript(this.renderer, 'https://www.gstatic.com/charts/loader.js')
    const schriftColorRGB = getComputedStyle(document.documentElement).getPropertyValue('--schrift').trim();
    const rgbNumbers = schriftColorRGB.match(/\d+/g);
    const rgbArray = rgbNumbers!.map(Number);
    const schriftHEX = this.farbS.rgbToHex(rgbArray[0], rgbArray[1], rgbArray[2]);
    const primaryColor = this.designS.primaryColor;

    const drawBasic = () => {
      const data = new google.visualization.DataTable();
      data.addColumn('string', 'X');
      data.addColumn('number', 'Anträge');
      data.addRows(this.chartRows);

      const options = {
        legend: 'none',
        responsive: true,
        colors: [primaryColor],
        textStyle: {
          color: schriftHEX,
        },
        hAxis: {
          title: 'Tage',
          textStyle: {
            color: schriftHEX,
          },
          titleTextStyle: {
            color: primaryColor,
          },
        },
        vAxis: {
          title: 'Anträge',
          textStyle: {
            color: schriftHEX,
          },
          titleTextStyle: {
            color: primaryColor,
          },
        },
        backgroundColor: {
          fill: 'transparent',
        }
      };

      const chart = new google.visualization.LineChart(document.getElementById('chart_div'));

      chart.draw(data, options);
    }
    const google = (window as any)['google'];

    google.charts.load('current', { packages: ['corechart', 'line'] });
    google.charts.setOnLoadCallback(drawBasic);
  }
}
