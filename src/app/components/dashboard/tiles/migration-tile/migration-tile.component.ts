import { Component, inject } from '@angular/core';
import { DashboardTileComponent } from "../../dashboard-tile/dashboard-tile.component";
import { UploadsService } from 'src/app/services/uploads.service';
import { ProgressSpinnerComponent } from "../../../progress-spinner/progress-spinner.component";

@Component({
  selector: 'app-migration-tile',
  standalone: true,
  imports: [DashboardTileComponent, ProgressSpinnerComponent],
  templateUrl: './migration-tile.component.html',
  styleUrl: './migration-tile.component.scss'
})
export class MigrationTileComponent {
  private uploadS = inject(UploadsService);
  responseText: string = '';
  isLoading = false;

  async migrateFromAntragToUploadinfo() {
    if (!confirm('Soll die Migration von Antrag zu Uploadinfo durchgeführt werden?')) return;

    try {
      this.isLoading = true;
      this.responseText = await this.uploadS.migrateFromAntragToUploadinfo();
      this.isLoading = false;
    } catch (error: any) {
      this.isLoading = false;
      console.error('Error beim Migration von Antrag zu Uploadinfo:', error);
      this.responseText = error.message;
    }
  }
}
