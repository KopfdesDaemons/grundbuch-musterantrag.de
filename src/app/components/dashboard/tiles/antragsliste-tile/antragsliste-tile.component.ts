import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { DashboardTileComponent } from "../../dashboard-tile/dashboard-tile.component";
import { RouterLink } from '@angular/router';
import { UploadsService } from 'src/app/services/uploads.service';
import { ProgressSpinnerComponent } from "../../../progress-spinner/progress-spinner.component";
import { Upload } from 'server/models/upload';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { AntragsanzahltimeframeComponent } from "../../../charts/antragsanzahltimeframe/antragsanzahltimeframe.component";

@Component({
  selector: 'app-antragsliste-tile',
  imports: [DashboardTileComponent, RouterLink, ProgressSpinnerComponent, FontAwesomeModule, DatePipe, AntragsanzahltimeframeComponent],
  templateUrl: './antragsliste-tile.component.html',
  styleUrl: './antragsliste-tile.component.scss'
})
export class AntragslisteTileComponent implements OnInit {
  uploadsS = inject(UploadsService);
  totalFiles: number | undefined;
  latestFile: Upload | null | undefined;
  platformId = inject(PLATFORM_ID);
  error: boolean = false;

  // FontAwesome Icons
  faArrowUpRightFromSquare = faArrowUpRightFromSquare;

  async ngOnInit(): Promise<void> {
    try {
      this.error = false;
      this.totalFiles = await this.uploadsS.getTotalFiles();
      this.latestFile = await this.getLatestFile();
    } catch {
      this.error = true;
    }
  }

  async getLatestFile(): Promise<Upload | null> {
    if (!isPlatformBrowser(this.platformId)) return null;
    if (this.uploadsS.uploadsData['totalFiles'] === 0) return null;
    const { files } = await this.uploadsS.getFiles();
    const latestFile: Upload = files[0];
    return latestFile;
  }
}
