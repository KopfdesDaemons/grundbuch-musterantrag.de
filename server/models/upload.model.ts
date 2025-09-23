export class Upload {
  uploadID: string;
  odtFile: boolean = false;
  pdfFile: boolean = false;
  filesDeleted: boolean = false;
  uploadDate: Date = new Date();
  antragsart: string = '';
  grundbuchamt: string = '';
  pdfFileDownloadedByUser: boolean | undefined = false;
  odtFileDownloadedByUser: boolean | undefined = false;

  constructor(uploadID: string) {
    this.uploadID = uploadID;
  }
}
