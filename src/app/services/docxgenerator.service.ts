import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Antrag } from '../interfaces/antrag';

@Injectable({
  providedIn: 'root'
})
export class DocxgeneratorService {
  // Injections
  private platformId = inject(PLATFORM_ID);

  progress = 0;
  fehler = signal(false);
  statusmeldung = signal('');
  docx: any;

  async generate(antrag: Antrag) {
    this.reset();

    if (!isPlatformBrowser(this.platformId)) return;

    let Docxtemplater: any;
    let expressionParser: any;
    let PizZip: any;
    let PizZipUtils: any;

    return new Promise(async (resolve) => {
      try {
        // importiere die notwendigen Skripte
        this.statusmeldung.set('Die benötigten Libraries werden heruntergeladen.');
        Docxtemplater = (await import('docxtemplater')).default;
        expressionParser = (await import('docxtemplater/expressions.js')).default;
        PizZip = (await import('pizzip')).default;
        PizZipUtils = (await import('pizzip/utils/index.js')).default;
      } catch (error: any) {
        this.statusmeldung.set('Fehler beim Laden der benötigten Libraries.');
        this.fehler.set(true)
        throw error;
      }

      this.progress = 10;
      this.statusmeldung.set('Die Templatedatei wird heruntergeladen.');

      PizZipUtils.getBinaryContent('assets/antrag-templates/' + antrag.templateFileName + '.docx',
        (error: Error | null, content: string) => {
          if (error) {
            this.fehler.set(true);
            this.statusmeldung.set('Fehler beim Laden der Templatedatei.');
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
            this.fehler.set(true);
            this.statusmeldung.set('Fehler beim Setzen der Variablen in die Templatedatei.');
            throw error;
          }

          this.progress = 40;
          this.statusmeldung.set('Das Template wird mit den eingesetzten Variablen gerendert.');

          try {
            doc.render();
          } catch (error) {
            this.fehler.set(true);
            this.statusmeldung.set('Fehler beim Rendern der Templatedatei.');
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
            this.fehler.set(true);
            this.statusmeldung.set('Fehler beim Zippen der docx Datei.');
            throw error;
          }
        }
      );
    });
  }

  reset() {
    this.fehler.set(false);
    this.statusmeldung.set('Die Antragsgenerierung wird gestartet.');
    this.progress = 0;
    this.docx = null;
  }
}
