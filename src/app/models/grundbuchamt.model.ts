import { FormGroup, FormBuilder, Validators } from '@angular/forms';

export class Grundbuchamt {
  name: string = '';
  straße: string = '';
  plz: string = '';
  ort: string = '';

  getFormGroup(): FormGroup {
    const formBuilder = new FormBuilder();
    return formBuilder.group({
      name: [this.name, Validators.required],
      straße: [this.straße, Validators.required],
      plz: [this.plz, Validators.required],
      ort: [this.ort, Validators.required]
    });
  }
}
