import { Component, inject } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormService } from 'src/app/services/document/form.service';
import { faCircleUser } from '@fortawesome/free-regular-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-antragsteller',
  templateUrl: './antragsteller.component.html',
  styleUrls: ['./antragsteller.component.scss'],
  imports: [FormsModule, ReactiveFormsModule, FaIconComponent]
})
export class AntragstellerComponent {
  fs = inject(FormService);
  form: FormGroup;

  faCircleUser = faCircleUser;

  constructor() {
    this.form = this.fs.form.get('antragsteller') as FormGroup;
  }

  async suchePlz(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    if (value.length === 5) {
      const ort: string = (await this.fs.ortAusPLZ(value)) || '';
      this.form.controls['ort'].setValue(ort);
    }
  }
}
