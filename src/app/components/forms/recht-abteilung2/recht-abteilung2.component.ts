import { Component, inject } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-recht-abteilung2',
  templateUrl: './recht-abteilung2.component.html',
  styleUrl: './recht-abteilung2.component.scss',
  imports: [FormsModule, ReactiveFormsModule]
})
export class RechtAbteilung2Component {
  form: FormGroup;
  fs = inject(FormService);

  constructor() {
    this.form = this.fs.form.get("rechtAbteilung2") as FormGroup;
  }
}
