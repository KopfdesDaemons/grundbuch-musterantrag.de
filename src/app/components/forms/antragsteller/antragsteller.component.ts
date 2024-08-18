import { Component } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormService } from 'src/app/services/form.service';
import { faCircleUser } from '@fortawesome/free-regular-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
    selector: 'app-antragsteller',
    templateUrl: './antragsteller.component.html',
    styleUrls: ['./antragsteller.component.scss'],
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, FaIconComponent]
})
export class AntragstellerComponent {

  form: FormGroup
  faCircleUser = faCircleUser;

  constructor(public fs: FormService) {
    this.form = fs.form.get('antragsteller') as FormGroup;

    this.form.get('plz')?.valueChanges.subscribe(async plz => {
      if ((plz as string).length === 5) {
        let ort = await this.fs.ortAusPLZ(plz)
        this.form.controls['ort'].setValue(ort);
      }
    })
  }
}
