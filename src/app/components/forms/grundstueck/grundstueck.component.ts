import { Component, inject } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Antrag } from 'src/app/interfaces/antrag';
import { FormService } from 'src/app/services/form.service';

@Component({
    selector: 'app-grundstueck',
    templateUrl: './grundstueck.component.html',
    styleUrls: ['./grundstueck.component.scss'],
    imports: [FormsModule, ReactiveFormsModule]
})
export class GrundstueckComponent {
  form: FormGroup;
  fs = inject(FormService);

  constructor() {
    this.form = this.fs.form.get("grundstueck") as FormGroup;

    this.form.get('plz')?.valueChanges.subscribe(async plz => {
      if ((plz as string).length === 5) {
        let ort = await this.fs.ortAusPLZ(plz)
        this.form.controls['ort'].setValue(ort);
      }
    })
  }

  anschriftuebernehmen() {
    let antragsteller = (this.fs.form.value as Antrag).antragsteller;
    this.form.controls['plz'].setValue(antragsteller.plz);
    this.form.controls['straße'].setValue(antragsteller.straße);
    this.form.controls['ort'].setValue(antragsteller.ort);
  }
}
