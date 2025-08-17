import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NachlassAktenzeichenValidator } from '../validators/nachlassAktenzeichen.validator';

export class Erbnachweis {
  erbnachweis: 'Erbschein' | 'notarielles Testament' = 'Erbschein';
  erbnachweisGerichtbekannt: boolean = false;
  aktenzeichenNachlassgericht: string = '';

  getFormGroup(): FormGroup {
    const formBuilder = new FormBuilder();
    const formGroup = formBuilder.group(
      {
        erbnachweis: [this.erbnachweis],
        erbnachweisGerichtbekannt: [this.erbnachweisGerichtbekannt],
        aktenzeichenNachlassgericht: [this.aktenzeichenNachlassgericht]
      },
      { updateOn: 'submit' }
    );

    /* 
            Prüft ob "Erbnachweis ist vom gleichen Amtsgericht" angehakt ist,
            wenn ja, ist die Angabe des Nachlassaktenzeichens erforderlich
        */
    formGroup.get('erbnachweisGerichtbekannt')?.valueChanges.subscribe(value => {
      const aktenzeichenControl = formGroup.get('aktenzeichenNachlassgericht');
      if (value) {
        aktenzeichenControl?.setValidators([Validators.required, NachlassAktenzeichenValidator()]);
      } else {
        formGroup.get('aktenzeichenNachlassgericht')?.setValue('');
        aktenzeichenControl?.setValidators([NachlassAktenzeichenValidator()]);
      }
      aktenzeichenControl?.updateValueAndValidity();
    });

    return formGroup;
  }
}
