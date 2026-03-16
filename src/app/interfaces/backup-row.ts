import { WritableSignal } from '@angular/core';

export interface BackupRow {
  isChecked: WritableSignal<boolean>;
  sizeInBytes: number;
  backupFileName: string;
}
