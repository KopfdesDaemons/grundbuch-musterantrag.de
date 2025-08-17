import { FormGroup, FormBuilder } from '@angular/forms';

export class Grundstueck {
  gemarkung: string = '';
  blattnummer: string = '';
  straße: string = '';
  plz: string = '';
  ort: string = '';
  flur: string = '';
  flurstück: string = '';

  getFormGroup(): FormGroup {
    const formBuilder = new FormBuilder();
    return formBuilder.group({
      gemarkung: [this.gemarkung],
      blattnummer: [this.blattnummer],
      straße: [this.straße],
      plz: [this.plz],
      ort: [this.ort],
      flur: [this.flur],
      flurstück: [this.flurstück]
    });
  }
}
