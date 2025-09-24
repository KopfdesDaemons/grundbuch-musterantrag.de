import { Signal } from '@angular/core';
import { Upload } from 'server/models/upload.model';

export interface UploadRow {
  isChecked: Signal<boolean>;
  upload: Upload;
  editMode: boolean;
}
