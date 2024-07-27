import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-bewilligung',
  templateUrl: './bewilligung.component.html',
  styleUrl: './bewilligung.component.scss'
})
export class BewilligungComponent {
  form: FormGroup

  constructor(public fs: FormService) {
    this.form = fs.form.get("bewilligung") as FormGroup;
  }
}
