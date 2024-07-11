import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-berechtigtes-interesse',
  templateUrl: './berechtigtes-interesse.component.html',
  styleUrls: ['./berechtigtes-interesse.component.scss']
})
export class BerechtigtesInteresseComponent {
  form: FormGroup

  constructor(public fs: FormService) {
    this.form = fs.form.get("berechtigtesInteresse") as FormGroup;
  }

  next() {
    if (this.form.valid) this.fs.nextStep();
  }
}
