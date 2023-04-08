import { Component, OnDestroy, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DesignloaderService } from 'src/app/services/designloader.service';
import { FormService } from 'src/app/services/form.service';
import { HttpClient, HttpEventType } from '@angular/common/http';
import Docxtemplater from 'docxtemplater';
import * as PizZip from 'pizzip';
import PizZipUtils from 'pizzip/utils/index.js';
import {faFileWord, faFilePdf} from '@fortawesome/free-regular-svg-icons';
import { saveAs } from 'file-saver';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-grundbuchausdruck-beantragen',
  templateUrl: './grundbuchausdruck-beantragen.component.html',
  styleUrls: ['./grundbuchausdruck-beantragen.component.scss']
})

export class GrundbuchausdruckBeantragenComponent implements OnDestroy {
  form: FormGroup;
  faFileWord = faFileWord;
  faFilePdf = faFilePdf;
  prozentProgressSpinnerWord = 0;
  prozentPdfUpload = 0;
  prozentPdfDownload = 0;
  fehler = false;
  statusmeldung = 'Der Antrag wird generiert.';
  docx: any;
  pdf:any;
  step = 1;
  CurrentStepSubscribtion: Subscription;

  constructor(private formBuilder: FormBuilder, public fs: FormService, public dl: DesignloaderService, public http: HttpClient, public rd: Renderer2) {

    this.form = this.formBuilder.group({
      antragsteller: this.formBuilder.group({
        anrede: ['Herr', Validators.required],
        vorname: ['', Validators.required],
        nachname: ['', Validators.required],
        straße: ['', Validators.required],
        plz: ['', Validators.required],
        ort: ['', Validators.required],
        telefonnummer: [''],
        email: [''],
      }),
      grundstück: this.formBuilder.group({
        gemarkung: [''],
        blattnummer: [''],
        straße: [''],
        plz: [''],
        ort: [''],
        flur: [''],
        flurstück: [''],
      }),
      form: ['einfach'],
      berechtigtesInteresse: this.formBuilder.group({
        berechtigtesInteresse: ['Ich bin Eigentümer', Validators.required],
        bemerkung: ['']
      }),
      grundbuchamt: this.formBuilder.group({
        name: ['', Validators.required],
        straße: ['', Validators.required],
        plz: ['', Validators.required],
        ort: ['', Validators.required],
      }),
    })
    fs.init(this.form);
    this.fs.restart();

    this.CurrentStepSubscribtion = this.fs.getCurrentStepBehaviorSubject().subscribe(step => {
      this.step = step;
      if(step == 5 && (this.form.get('grundbuchamt') as FormGroup).valid){
        this.fs.nextStep(6);
      }
      if(step == 6) this.submitForm();
    })
    // this.fs.nextStep(6); //debug
  }
  ngOnDestroy(): void {
    this.CurrentStepSubscribtion.unsubscribe();
  }

  next() { 
    this.fs.nextStep(); 
  }

  async submitForm() {
    this.fehler = false;
    this.prozentProgressSpinnerWord = 0;
    this.prozentPdfUpload = 0;
    this.prozentPdfDownload = 0;
    this.docx, this.pdf = null;


    try {
      this.docx = await this.generate();
    } catch (error: any) {
      this.statusmeldung = error.message;
      this.fehler = true;
      console.error(error)
      return;
    }
    
    
    this.statusmeldung = 'Die docx Datei wird zur Konvertierung an den Server gesendet.';
    const form = new FormData();
    form.append('docx', this.docx);
    const url = '/api/antraggrundbuchausdruck';

    this.http.post(url, form, { responseType: 'blob', reportProgress: true, observe: 'events' })
    .subscribe({
      next: res => {

        if (res.type === HttpEventType.Response) {
          this.pdf = res.body;
          this.statusmeldung = 'Es wurden alle Dateien erfolgreich erstellt.'
        }

        if (res.type === HttpEventType.UploadProgress) {
          const uploadProzent = Math.round(100 * res.loaded / res.total!);
          this.prozentPdfUpload = uploadProzent;
          if(uploadProzent == 100){
            this.statusmeldung = 'Die docx Datei wurde zur Konvertierung an den Server gesendet. Der Server muss die Datei noch in eine pdf Datei konvertieren.';
          }
        } 

        if (res.type === HttpEventType.DownloadProgress) {
          const downloadProzent = Math.round(100 * res.loaded / res.total!);
          this.prozentPdfDownload = downloadProzent;
          this.statusmeldung = 'Die docx Datei wurde vom Server in eine pdf Datei konvertiert und muss nun heruntergeladen werden.';
        } 
      },
      error: err => {
        this.fehler = true;
        if (err.status >= 500 && err.status < 600) {
          // Server-Fehler
          this.statusmeldung = 'Es gab einen Serverfehler. Die pdf Datei konnte nicht generiert werden. Sie können die docx Datei herunterladen.';
        } else {
          this.statusmeldung = 'Es gab einen Netzwerkfehler. Die pdf Datei konnte nicht generiert werden. Sie können die docx Datei herunterladen.';
        }
        throw err;
      }
    });
  }

  downloadDocx() {
    saveAs(this.docx, 'AntragGrundbuchausdruck.docx');
  }

  openPdf() {
    // saveAs(this.pdf, 'AntragGrundbuchausdruck.pdf');
    window.open(URL.createObjectURL(this.pdf));
  }

  generate() {
    return new Promise((resolve, reject) => {
      this.statusmeldung = 'Die Formulare werden geladen.'

      const ast = this.fs.form.get("antragsteller") as FormGroup;
      const gst = this.fs.form.get("grundstück") as FormGroup;
      const ber = this.fs.form.get("berechtigtesInteresse") as FormGroup;
      const gba = this.fs.form.get("grundbuchamt") as FormGroup;

      this.prozentProgressSpinnerWord = 10;
      this.statusmeldung = 'Die Variablen werden aus den Formularen gelesen und angepasste Variablen werden zugewiesen.'

      let form = this.fs.form.get("form")?.value;
      const kosten = form === 'beglaubigt' ? '20,00 €' : '10,00 €';
      form = form === 'beglaubigt' ? ' beglaubigten' : '';
      const anrede = ast.get("anrede")?.value === 'Herr' ? 'Herrn' : 'Frau';
      const anredeformel = ast.get("anrede")?.value === 'Herr' ? 'geehrter Herr' : 'geehrte Frau';
      const betreff = `${gst.get('gemarkung')?.value} ${gst.get('blattnummer')?.value}`;
      const straßegrundstück = gst.get('straße')?.value != '' ? gst.get('straße')?.value + ',': '';

      this.prozentProgressSpinnerWord = 20;
      this.statusmeldung = 'Das Template wird geladen und die Varaiblen eingesetzt.'


      PizZipUtils.getBinaryContent('assets/antragtemplate.docx', (error: Error | null, content: string) => {
        if (error) {
          reject(new Error('Fehler beim Laden der Templatedatei.'));
          throw error;
        }

        let doc: Docxtemplater<PizZip>;
        try {
          const zip = new PizZip(content);
          doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
          });

          doc.setData({
            datum: new Date().toLocaleDateString('de-DE'),

            vorname: ast.get('vorname')?.value,
            nachname: ast.get('nachname')?.value,
            straße: ast.get('straße')?.value,
            plz: ast.get('plz')?.value,
            ort: ast.get('ort')?.value,
            telefonnummer: ast.get('telefonnummer')?.value,
            email: ast.get('email')?.value,

            gemarkung: gst.get('gemarkung')?.value,
            blattnummer: gst.get('blattnummer')?.value,
            straßegrundstück: straßegrundstück,
            plzgrundstück: gst.get('plz')?.value,
            ortgrundstück: gst.get('ort')?.value,
            flur: gst.get('flur')?.value,
            flurstück: gst.get('flurstück')?.value,
            berechtigtesinteresse: ber.get('berechtigtesInteresse')?.value,
            bemerkung: ber.get('bemerkung')?.value,

            form: form,
            kosten: kosten,
            anredeformel: anredeformel,
            anrede: anrede,
            betreff: betreff,

            nameag: gba.get('name')?.value,
            straßeag: gba.get('straße')?.value,
            plzag: gba.get('plz')?.value,
            ortag: gba.get('ort')?.value,
          });
        }
        catch (error) {
          reject(new Error('Fehler beim Setzen der Variablen in die Templatedatei.'))
          throw error;
        }

        this.prozentProgressSpinnerWord = 40;
        this.statusmeldung = 'Das Template wird mit den eingesetzten Variablen gerendert.';

        try {doc!.render();
        } catch (error) {
          reject(new Error('Fehler beim Rendern der Templatedatei.'))
          throw error;
        }

        this.prozentProgressSpinnerWord = 60;
        this.statusmeldung = 'Die Datei wird zu einer .docx gezippt.';

        try {
          const blobDocx = doc!.getZip().generate({
            type: 'blob',
            mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          });
          this.prozentProgressSpinnerWord = 100;
          resolve(blobDocx);
        } catch (error) {
          reject(new Error('Fehler beim Zippen der docx Datei.'))
          throw error;
        }
      });
    })
  }
}
