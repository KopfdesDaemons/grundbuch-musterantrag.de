import { Upload } from 'server/models/upload.model';

export interface UploadRow {
  isChecked: boolean;
  upload: Upload;
  editMode: boolean;
}
