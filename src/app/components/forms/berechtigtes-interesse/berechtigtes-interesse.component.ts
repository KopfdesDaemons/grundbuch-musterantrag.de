import { Component } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormService } from 'src/app/services/form.service';

@Component({
    selector: 'app-berechtigtes-interesse',
    templateUrl: './berechtigtes-interesse.component.html',
    styleUrls: ['./berechtigtes-interesse.component.scss'],
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule]
})
export class BerechtigtesInteresseComponent {
  form: FormGroup

  constructor(public fs: FormService) {
    this.form = fs.form.get("berechtigtesInteresse") as FormGroup;
  }
}
