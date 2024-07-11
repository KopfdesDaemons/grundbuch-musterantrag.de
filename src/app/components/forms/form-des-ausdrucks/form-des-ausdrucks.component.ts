import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-form-des-ausdrucks',
  templateUrl: './form-des-ausdrucks.component.html',
  styleUrl: './form-des-ausdrucks.component.scss'
})
export class FormDesAusdrucksComponent {
  form: FormGroup

  constructor(public fs: FormService) {
    this.form = fs.form.get("formDesAusdrucks") as FormGroup;
  }

  next() {
    if (this.form.valid) this.fs.nextStep();
  }
}
