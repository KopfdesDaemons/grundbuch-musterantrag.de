import { Component, inject, OnInit } from '@angular/core';
import { DashboardTileComponent } from "../../dashboard-tile/dashboard-tile.component";
import { RouterLink } from '@angular/router';
import { UploadsService } from 'src/app/services/uploads.service';
import { ProgressSpinnerComponent } from "../../../progress-spinner/progress-spinner.component";
import { AntragsData } from 'server/models/antragsData';

@Component({
  selector: 'app-antragsliste-tile',
  standalone: true,
  imports: [DashboardTileComponent, RouterLink, ProgressSpinnerComponent],
  templateUrl: './antragsliste-tile.component.html',
  styleUrl: './antragsliste-tile.component.scss'
})
export class AntragslisteTileComponent implements OnInit {
  uploadsS = inject(UploadsService);
  totalFiles: number | undefined;
  latestFile: AntragsData | null | undefined;

  async ngOnInit(): Promise<void> {
    this.totalFiles = await this.uploadsS.getTotalFiles();
    this.latestFile = await this.getLatestFile();
  }

  async getLatestFile(): Promise<AntragsData | null> {
    if (this.uploadsS.uploadsData['totalFiles'] === 0) return null;
    const { files } = await this.uploadsS.getFiles();
    const latestFile: AntragsData = files[0];
    return latestFile;
  }
}
