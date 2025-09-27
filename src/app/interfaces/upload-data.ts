import { Upload } from 'common/models/upload.model';

export interface UploadData {
  page: number;
  totalPages: number;
  totalFiles: number;
  files: Upload[];
}
