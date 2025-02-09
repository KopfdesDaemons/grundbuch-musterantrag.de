export class Upload {
    uploadID: string;
    docxFile: boolean = false;
    pdfFile: boolean = false;
    filesDeleted: boolean = false;
    uploadDate: Date = new Date();
    antragsart: string = '';
    grundbuchamt: string = '';

    constructor(uploadID: string) {
        this.uploadID = uploadID;
    }
}