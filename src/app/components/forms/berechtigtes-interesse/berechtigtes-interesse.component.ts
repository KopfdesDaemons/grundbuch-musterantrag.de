import { Component, inject } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormService } from 'src/app/services/document/form.service';

@Component({
  selector: 'app-berechtigtes-interesse',
  templateUrl: './berechtigtes-interesse.component.html',
  styleUrls: ['./berechtigtes-interesse.component.scss'],
  imports: [FormsModule, ReactiveFormsModule]
})
export class BerechtigtesInteresseComponent {
  form: FormGroup
  fs = inject(FormService);

  constructor() {
    this.form = this.fs.form.get("berechtigtesInteresse") as FormGroup;
  }
}
