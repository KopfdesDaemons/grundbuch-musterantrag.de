import { Component, inject } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Antrag } from 'src/app/interfaces/antrag';
import { FormService } from 'src/app/services/document/form.service';

@Component({
  selector: 'app-grundstueck',
  templateUrl: './grundstueck.component.html',
  styleUrls: ['./grundstueck.component.scss'],
  imports: [FormsModule, ReactiveFormsModule]
})
export class GrundstueckComponent {
  fs = inject(FormService);
  form: FormGroup;

  constructor() {
    this.form = this.fs.form.get("grundstueck") as FormGroup;
  }

  async suchePlz(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    if (value.length === 5) {
      const ort: string = await this.fs.ortAusPLZ(value) || '';
      this.form.controls['ort'].setValue(ort);
    }
  }

  anschriftuebernehmen() {
    const antragsteller = (this.fs.form.value as Antrag).antragsteller;
    this.form.controls['plz'].setValue(antragsteller.plz);
    this.form.controls['straße'].setValue(antragsteller.straße);
    this.form.controls['ort'].setValue(antragsteller.ort);
  }
}
