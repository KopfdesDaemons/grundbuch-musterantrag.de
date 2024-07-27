import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-teilungserklaerung',
  templateUrl: './teilungserklaerung.component.html',
  styleUrl: './teilungserklaerung.component.scss'
})
export class TeilungserklaerungComponent {
  form: FormGroup

  constructor(public fs: FormService) {
    this.form = fs.form.get("teilungserklaerung") as FormGroup;
  }
}
