import { WritableSignal } from '@angular/core';

export interface BackupRow {
  isChecked: WritableSignal<boolean>;
  backupFileName: string;
}
