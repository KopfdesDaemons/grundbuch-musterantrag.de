import { FormGroup, FormBuilder, Validators } from '@angular/forms';

export class Antragsteller {
  private _geschlecht: 'Herr' | 'Frau' = 'Herr';
  anredeAdressfeld: 'Herrn' | 'Frau' = 'Herrn';
  grußformel: string = 'Sehr geehrter Herr';
  vorname: string = '';
  nachname: string = '';
  straße: string = '';
  plz: string = '';
  ort: string = '';
  telefonnummer: string = '';
  email: string = '';

  set geschlecht(value: 'Herr' | 'Frau') {
    this._geschlecht = value;
    this.updateAnredeUndGrußformel();
  }

  get geschlecht(): 'Herr' | 'Frau' {
    return this._geschlecht;
  }

  private updateAnredeUndGrußformel() {
    if (this._geschlecht === 'Herr') {
      this.anredeAdressfeld = 'Herrn';
      this.grußformel = 'Sehr geehrter Herr';
    } else {
      this.anredeAdressfeld = 'Frau';
      this.grußformel = 'Sehr geehrte Frau';
    }
  }

  getFormGroup(): FormGroup {
    const formBuilder = new FormBuilder();
    return formBuilder.group({
      geschlecht: [this.geschlecht, Validators.required],
      vorname: [this.vorname, Validators.required],
      nachname: [this.nachname, Validators.required],
      straße: [this.straße, Validators.required],
      plz: [this.plz, Validators.required],
      ort: [this.ort, Validators.required],
      telefonnummer: [this.telefonnummer],
      email: [this.email]
    });
  }
}
