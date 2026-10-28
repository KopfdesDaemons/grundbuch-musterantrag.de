export interface UploadSectionTime {
  section: string;
  stepOrder: number;
  loadedAt: Date | null;
  completedAt: Date | null;
  durationMs: number;
}

export const FORM_SECTION_LABELS: Record<string, string> = {
  antragsteller: 'Antragsteller',
  erblasser: 'Erblasser',
  grundstueck: 'Grundstücksangaben',
  rechtAbteilung2: 'Recht Abteilung II',
  erbnachweis: 'Erbnachweis',
  bewilligung: 'Bewilligung',
  teilungserklaerung: 'Teilungserklärung',
  farbe: 'Farbe der Kopien',
  weitererGrundbesitz: 'Weiterer Grundbesitz',
  formDesAusdrucks: 'Form des Ausdrucks',
  berechtigtesInteresse: 'Berechtigtes Interesse',
  grundbuchamt: 'Grundbuchamt',
  hinweis: 'Hinweis'
};

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
  finished: boolean = false;
  rating?: number | null = null;
  sectionTimes: UploadSectionTime[] = [];
  totalDurationMs: number = 0;

  constructor(uploadID: string) {
    this.uploadID = uploadID;
  }
}
