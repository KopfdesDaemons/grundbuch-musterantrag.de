import { Component } from '@angular/core';
import { FormService } from 'src/app/services/form.service';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NachlassAktenzeichenValidator } from 'src/app/validators/nachlassAktenzeichen.validator';

@Component({
  selector: 'app-erbnachweis',
  templateUrl: './erbnachweis.component.html',
  styleUrl: './erbnachweis.component.scss',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule]
})

export class ErbnachweisComponent {

  constructor(public fs: FormService) { }

  /* 
    Prüft ob "Erbnachweis ist vom gleichen Amtsgericht" angehakt ist,
    wenn ja, ist die Angabe des Nachlassaktenzeichens erforderlich
  */
  onCheckboxChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const control = this.fs.form.get('aktenzeichenNachlassgericht');
    if (inputElement.checked) {
      control?.setValidators([Validators.required, NachlassAktenzeichenValidator()]);
    } else {
      control?.clearValidators();
      control?.setValue('');
    }
    control?.updateValueAndValidity();
  }
}
