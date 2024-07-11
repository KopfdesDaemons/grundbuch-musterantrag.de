import { Inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Antrag } from '../interfaces/antrag';

@Injectable({
  providedIn: 'root'
})
export class DocxgeneratorService {
  progress = 0;
  fehler = false;
  statusmeldung = signal('Die Antragsgenerierung wird gestartet.');
  docx: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  async generateDocx(antrag: Antrag) {
    this.fehler = false;
    this.progress = 0;
    this.docx = null;

    if (!isPlatformBrowser(this.platformId)) return;

    // importiere die notwendigen Skripte
    this.statusmeldung.set('Die benötigten Libraries werden heruntergeladen.');
    const { default: Docxtemplater } = await import('docxtemplater');
    const { default: expressionParser } = await import('docxtemplater/expressions.js');
    const { default: PizZip } = await import('pizzip');
    const { default: PizZipUtils } = await import('pizzip/utils/index.js');

    return new Promise((resolve, reject) => {
      this.progress = 10;
      this.statusmeldung.set('Die Templatedatei wird heruntergeladen.');

      PizZipUtils.getBinaryContent('assets/antragtemplate.docx',
        (error: Error | null, content: string) => {
          if (error) {
            reject(new Error('Fehler beim Laden der Templatedatei.'));
            throw error;
          }

          this.progress = 30;
          this.statusmeldung.set('Die Templatedatei wird verarbeitet.');

          let doc;
          try {
            const zip = new PizZip(content);
            doc = new Docxtemplater(zip, {
              paragraphLoop: true,
              linebreaks: true,
              parser: expressionParser,
            });
            doc.setData(antrag);
          } catch (error) {
            reject(new Error('Fehler beim Setzen der Variablen in die Templatedatei.'));
            throw error;
          }

          this.progress = 40;
          this.statusmeldung.set('Das Template wird mit den eingesetzten Variablen gerendert.');

          try {
            doc.render();
          } catch (error) {
            reject(new Error('Fehler beim Rendern der Templatedatei.'));
            throw error;
          }

          this.progress = 60;
          this.statusmeldung.set('Die Datei wird zu einer .docx gezippt.');

          try {
            const blobDocx = doc.getZip().generate({
              type: 'blob',
              mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            });
            this.progress = 100;
            resolve(blobDocx);
          } catch (error) {
            reject(new Error('Fehler beim Zippen der docx Datei.'));
            throw error;
          }
        }
      );
    });
  }
}
