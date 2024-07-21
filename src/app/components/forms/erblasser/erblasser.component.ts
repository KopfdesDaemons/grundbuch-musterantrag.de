import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-erblasser',
  templateUrl: './erblasser.component.html',
  styleUrl: './erblasser.component.scss'
})
export class ErblasserComponent {
  form: FormGroup

  constructor(public fs: FormService) {
    this.form = fs.form.get("erblasser") as FormGroup;
  }
}
