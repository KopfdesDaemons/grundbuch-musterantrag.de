import { Injectable, signal } from '@angular/core';
import { Antrag } from '../../interfaces/antrag';

@Injectable({
  providedIn: 'root'
})
export class DocxgeneratorService {
  progress = 0;
  fehler = signal(false);
  statusmeldung = signal('');
  docx: any;

  async generate(antrag: Antrag): Promise<Blob> {
    this.reset();

    // importiere die notwendigen Skripte
    let Docxtemplater: any, expressionParser: any, PizZip: any, PizZipUtils: any;
    this.statusmeldung.set('Die benötigten Libraries werden heruntergeladen.');
    try {
      Docxtemplater = (await import('docxtemplater')).default;
      expressionParser = (await import('docxtemplater/expressions.js')).default;
      PizZip = (await import('pizzip')).default;
      PizZipUtils = (await import('pizzip/utils/index.js')).default;
    } catch (error: any) {
      this.statusmeldung.set('Fehler beim Laden der benötigten Libraries.');
      this.fehler.set(true)
      throw error;
    }


    // Lade die Templatedatei
    this.progress = 10;
    this.statusmeldung.set('Die Templatedatei wird heruntergeladen.');
    const content = await new Promise<string>((resolve, reject) => {
      PizZipUtils.getBinaryContent('templates/' + antrag.templateFileName + '.docx',
        (error: Error | null, content: string) => {
          if (error) {
            this.fehler.set(true);
            this.statusmeldung.set('Fehler beim Laden der Templatedatei.');
            reject(error);
          } else {
            resolve(content);
          }
        }
      );
    });


    // Setze Variablen und rendere die Templatedatei
    this.progress = 30;
    this.statusmeldung.set('Die Templatedatei wird verarbeitet.');
    let doc;
    try {
      const zip = new PizZip(content);
      doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        parser: expressionParser,
        nullGetter() { return ''; }
      });
      doc.render(antrag);
    } catch (error) {
      this.fehler.set(true);
      this.statusmeldung.set('Fehler beim Rendern der Templatedatei.');
      throw error;
    }


    // Zippe die docx Datei
    this.progress = 60;
    this.statusmeldung.set('Die Datei wird zu einer .docx gezippt.');
    try {
      const blobDocx = doc.getZip().generate({
        type: 'blob',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
      this.progress = 100;
      return blobDocx as Blob;
    } catch (error) {
      this.fehler.set(true);
      this.statusmeldung.set('Fehler beim Zippen der docx Datei.');
      throw error;
    }
  }

  reset() {
    this.fehler.set(false);
    this.statusmeldung.set('Die Antragsgenerierung wird gestartet.');
    this.progress = 0;
    this.docx = null;
  }
}
