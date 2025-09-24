import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DashboardTileComponent } from '../../dashboard-tile/dashboard-tile.component';
import { ProgressSpinnerComponent } from '../../../progress-spinner/progress-spinner.component';
import { MigrationService } from 'src/app/services/data/migration.service';
import { Migration } from 'src/app/models/migration.model';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorDisplayComponent } from 'src/app/components/error-display/error-display.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-migration-tile',
  imports: [DashboardTileComponent, ProgressSpinnerComponent, FormsModule, ErrorDisplayComponent],
  templateUrl: './migration-tile.component.html',
  styleUrl: './migration-tile.component.scss'
})
export class MigrationTileComponent {
  migrationS = inject(MigrationService);

  selectedMigration: Migration = this.migrationS.migrations[0];

  responseText = signal('');
  isLoading = signal(false);
  error = signal<Error | HttpErrorResponse | null>(null);

  async migrate() {
    if (!confirm('Migration ' + this.selectedMigration.name + ' wirklich durchführen?')) return;
    try {
      this.isLoading.set(true);
      const { message } = await this.selectedMigration.migrate();
      this.responseText.set(message);
    } catch (error) {
      if (error instanceof Error || error instanceof HttpErrorResponse) {
        this.error.set(error);
      }
    }
    this.isLoading.set(false);
  }
}
