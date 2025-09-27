import { WritableSignal } from '@angular/core';
import { Upload } from 'common/models/upload.model';

export interface UploadRow {
  isChecked: WritableSignal<boolean>;
  upload: Upload;
  editMode: boolean;
}
