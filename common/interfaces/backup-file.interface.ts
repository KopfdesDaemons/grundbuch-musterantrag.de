export interface BackupFile {
  fileName: string;
  sizeInBytes: number;
  dbVersion: number;
  currentServerDbVersion: number;
}
