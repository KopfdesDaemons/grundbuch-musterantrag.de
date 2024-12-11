import { Component, inject } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormService } from 'src/app/services/form.service';

@Component({
    selector: 'app-bewilligung',
    templateUrl: './bewilligung.component.html',
    styleUrl: './bewilligung.component.scss',
    imports: [FormsModule, ReactiveFormsModule]
})
export class BewilligungComponent {
  form: FormGroup
  fs = inject(FormService);

  constructor() {
    this.form = this.fs.form.get("bewilligung") as FormGroup;
  }
}
