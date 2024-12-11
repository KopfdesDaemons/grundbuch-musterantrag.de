import { Component, inject } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormService } from 'src/app/services/form.service';

@Component({
    selector: 'app-erblasser',
    templateUrl: './erblasser.component.html',
    styleUrl: './erblasser.component.scss',
    imports: [FormsModule, ReactiveFormsModule]
})
export class ErblasserComponent {
  form: FormGroup;
  fs = inject(FormService);

  constructor() {
    this.form = this.fs.form.get("erblasser") as FormGroup;
  }
}
