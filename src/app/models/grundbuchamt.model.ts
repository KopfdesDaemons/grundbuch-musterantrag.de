import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AmtsgerichtValidator } from '../validators/amtsgericht.validator';

export class Grundbuchamt {
  name: string = '';
  straße: string = '';
  plz: string = '';
  ort: string = '';

  getFormGroup(): FormGroup {
    const formBuilder = new FormBuilder();
    return formBuilder.group({
      name: [this.name, { validators: [Validators.required, AmtsgerichtValidator()], updateOn: 'blur' }],
      straße: [this.straße, Validators.required],
      plz: [this.plz, Validators.required],
      ort: [this.ort, Validators.required]
    });
  }
}
