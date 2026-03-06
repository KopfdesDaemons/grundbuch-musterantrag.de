import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DashboardTileComponent } from '../../dashboard-tile/dashboard-tile.component';
import { ProgressSpinnerComponent } from '../../../progress-spinner/progress-spinner.component';
import { MigrationService } from 'src/app/services/data/migration.service';
import { Migration } from 'src/app/models/migration.model';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorDisplayComponent } from 'src/app/components/error-display/error-display.component';
import { UserSettingsService } from 'src/app/services/user/user-settings.service';
import { Feature, MigrationAction } from 'common/interfaces/user-permission.interface';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-migration-tile',
  imports: [DashboardTileComponent, ProgressSpinnerComponent, FormsModule, ErrorDisplayComponent],
  templateUrl: './migration-tile.component.html',
  styleUrl: './migration-tile.component.scss'
})
export class MigrationTileComponent {
  private readonly userSettingsS = inject(UserSettingsService);
  protected migrationS = inject(MigrationService);

  protected readonly _selectedMigration = signal<Migration>(this.migrationS.migrations[0]);

  protected get selectedMigration(): Migration {
    return this._selectedMigration();
  }

  protected set selectedMigration(value: Migration) {
    this._selectedMigration.set(value);
  }

  protected responseText = signal('');
  protected isLoading = signal(false);
  protected error = signal<Error | HttpErrorResponse | null>(null);

  protected userHasPermissionsMigrate = computed(() => {
    const userPermissions = this.userSettingsS.userRoleResource.hasValue() ? this.userSettingsS.userRoleResource.value().userRolePermissions : [];
    const migrationPermissions = userPermissions.find(permission => permission.feature === Feature.Migration);
    if (!migrationPermissions) return false;
    let migrationAction;
    switch (this.selectedMigration.name) {
      case 'Von Antrag zu Uploadinfo':
        migrationAction = MigrationAction.AntragToUploadinfoMigration;
        break;
      case 'Von JSON zur Datenbank':
        migrationAction = MigrationAction.JSONToDatabaseMigration;
        break;
      case 'Von .docx zu .odt':
        migrationAction = MigrationAction.DocxToOdtMigration;
        break;
      default:
        return false;
    }
    return migrationPermissions.allowedActions.includes(migrationAction);
  });

  async migrate() {
    if (!confirm('Migration ' + this.selectedMigration.name + ' wirklich durchführen?')) return;
    try {
      this.reset();
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

  reset() {
    this.responseText.set('');
    this.error.set(null);
  }
}
