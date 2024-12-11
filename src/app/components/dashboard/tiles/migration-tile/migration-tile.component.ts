import { Component, inject } from '@angular/core';
import { DashboardTileComponent } from "../../dashboard-tile/dashboard-tile.component";
import { ProgressSpinnerComponent } from "../../../progress-spinner/progress-spinner.component";
import { MigrationService } from 'src/app/services/migration.service';
import { Migration } from 'src/app/models/migration';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-migration-tile',
    imports: [DashboardTileComponent, ProgressSpinnerComponent, FormsModule],
    templateUrl: './migration-tile.component.html',
    styleUrl: './migration-tile.component.scss'
})
export class MigrationTileComponent {
  migrationS = inject(MigrationService);

  selectedMigration: Migration = this.migrationS.migrations[0];

  responseText: string = '';
  isLoading = false;

  async migrate() {
    if (!confirm('Migration ' + this.selectedMigration.name + ' wirklich durchführen?')) return;
    try {
      this.isLoading = true;
      this.responseText = await this.selectedMigration.migrate();
      this.isLoading = false;
    } catch (error: any) {
      this.isLoading = false;
      console.error('Error beim Migration:', error);
      this.responseText = error.message;
    }
  }
}
