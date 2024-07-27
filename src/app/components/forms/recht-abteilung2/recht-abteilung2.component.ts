import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-recht-abteilung2',
  templateUrl: './recht-abteilung2.component.html',
  styleUrl: './recht-abteilung2.component.scss'
})
export class RechtAbteilung2Component {
  form: FormGroup

  constructor(public fs: FormService) {
    this.form = fs.form.get("rechtAbteilung2") as FormGroup;
  }
}
