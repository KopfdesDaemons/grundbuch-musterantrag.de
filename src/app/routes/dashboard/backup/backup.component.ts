import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, linkedSignal, signal } from '@angular/core';
import { BackupService } from 'src/app/services/data/backup.service';
import { ProgressSpinnerComponent } from 'src/app/components/progress-spinner/progress-spinner.component';
import { ErrorDisplayComponent } from 'src/app/components/error-display/error-display.component';
import { UserSettingsService } from 'src/app/services/user/user-settings.service';
import { BackupAction, Feature } from 'common/interfaces/user-permission.interface';
import { BackupRow } from 'src/app/interfaces/backup-row';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-backup',
  imports: [ProgressSpinnerComponent, ErrorDisplayComponent, FormsModule],
  templateUrl: './backup.component.html',
  styleUrl: './backup.component.scss'
})
export class BackupComponent {
  protected readonly backupS = inject(BackupService);
  protected readonly restoreBackupIsLoading = signal(false);
  protected readonly restoreBackupResponseMessage = signal('');
  protected readonly restoreBackupError = signal<Error | HttpErrorResponse | null>(null);
  protected readonly selectedFile = signal<File | null>(null);
  private readonly userSettingsS = inject(UserSettingsService);

  protected readonly userHasPermissionsCreateBackup = this.userSettingsS.getPermissionsSignal({
    feature: Feature.Backup,
    allowedActions: [BackupAction.CreateBackup]
  });

  protected readonly userHasPermissionsRestoreBackup = this.userSettingsS.getPermissionsSignal({
    feature: Feature.Backup,
    allowedActions: [BackupAction.RestoreBackup]
  });

  protected readonly userHasPermissionsDeleteBackup = this.userSettingsS.getPermissionsSignal({
    feature: Feature.Backup,
    allowedActions: [BackupAction.DeleteBackup]
  });

  protected readonly userHasPermissionsDownloadBackup = this.userSettingsS.getPermissionsSignal({
    feature: Feature.Backup,
    allowedActions: [BackupAction.DownloadBackup]
  });

  private rowsMap = new Map<string, BackupRow>();
  rows = linkedSignal<string[], BackupRow[]>({
    source: () => this.backupS.backupList(),
    computation: (backups, previous) => {
      if (!backups) {
        return previous?.value ?? [];
      }
      return backups.map(backup => {
        if (this.rowsMap.has(backup)) {
          return this.rowsMap.get(backup)!;
        }
        const newRow: BackupRow = { backupFileName: backup, isChecked: signal(false) };
        this.rowsMap.set(backup, newRow);
        return newRow;
      });
    }
  });

  selectedRows = computed<BackupRow[]>(() => this.rows().filter(row => row.isChecked()));

  async createNewBackup() {
    this.restoreBackupIsLoading.set(true);
    this.restoreBackupResponseMessage.set('');
    this.restoreBackupError.set(null);
    this.selectedFile.set(null);
    try {
      const { message } = await this.backupS.createNewBackup();
      this.restoreBackupResponseMessage.set(message);
    } catch (error) {
      if (error instanceof Error || error instanceof HttpErrorResponse) {
        this.restoreBackupError.set(error);
      }
    }
    this.restoreBackupIsLoading.set(false);
    this.reloadBackupList();
  }

  onFileSelected(event: Event) {
    this.restoreBackupResponseMessage.set('');
    this.restoreBackupError.set(null);
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile.set(input.files[0]);
    }
  }

  async restoreBackupByFileUpload() {
    const file = this.selectedFile();
    if (!file) return;

    if (!confirm('Möchten Sie das Backup wirklich einspielen? Alle aktuellen Daten werden überschrieben!')) {
      return;
    }

    this.restoreBackupIsLoading.set(true);
    this.restoreBackupResponseMessage.set('');
    this.restoreBackupError.set(null);
    try {
      const { message } = await this.backupS.restoreBackupByFileUpload(file);
      this.restoreBackupResponseMessage.set(message);
      this.selectedFile.set(null);
    } catch (error) {
      if (error instanceof Error || error instanceof HttpErrorResponse) {
        this.restoreBackupError.set(error);
      }
    }
    this.restoreBackupIsLoading.set(false);
  }

  async restoreBackupByFileName(fileName: string) {
    if (!fileName) return;

    if (!confirm('Möchten Sie das Backup wirklich einspielen? Alle aktuellen Daten werden überschrieben!')) {
      return;
    }

    this.restoreBackupIsLoading.set(true);
    this.restoreBackupResponseMessage.set('');
    this.restoreBackupError.set(null);
    try {
      const { message } = await this.backupS.restoreBackupByFileName(fileName);
      this.restoreBackupResponseMessage.set(message);
      this.selectedFile.set(null);
    } catch (error) {
      if (error instanceof Error || error instanceof HttpErrorResponse) {
        this.restoreBackupError.set(error);
      }
    }
    this.restoreBackupIsLoading.set(false);
  }

  scroll(element: HTMLElement) {
    if (element.scrollTop > element.scrollHeight - element.clientHeight - 150) {
      if (!this.backupS.backupListData.isLoading()) this.loadPage(this.backupS.loadedPages() + 1);
    }
  }

  private loadPage(pageNumber: number) {
    if (!this.backupS.totalPages()) return;
    if (pageNumber > this.backupS.totalPages()!) return;
    this.backupS.setPageToLoad(pageNumber);
    this.backupS.loadBackupList();
  }

  reloadBackupList() {
    this.backupS.resetBackupList();
    this.backupS.setPageToLoad(1);
    this.backupS.loadBackupList();
  }

  selectAll(value: boolean) {
    this.rows().forEach(row => row.isChecked.set(value));
  }

  async deleteSelectedBackups() {
    const selectedBackupFileNames = this.selectedRows().map(row => row.backupFileName);
    if (selectedBackupFileNames.length === 0) return;
    if (!confirm(`Soll wirklich ${selectedBackupFileNames.length} ausgewählte Backups gelöscht werden?`)) return;
    await this.backupS.deleteBackups(selectedBackupFileNames);
    this.reloadBackupList();
  }

  async deleteBackup(fileName: string) {
    await this.backupS.deleteBackups([fileName]);
    this.reloadBackupList();
  }

  async downloadBackup(fileName: string) {
    const blob = await this.backupS.downloadBackup(fileName);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
}
