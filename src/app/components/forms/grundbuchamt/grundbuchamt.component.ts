import { Component, inject } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormService } from 'src/app/services/document/form.service';

@Component({
  selector: 'app-grundbuchamt',
  templateUrl: './grundbuchamt.component.html',
  styleUrls: ['./grundbuchamt.component.scss'],
  imports: [FormsModule, ReactiveFormsModule]
})
export class GrundbuchamtComponent {
  fs = inject(FormService);
  form: FormGroup;

  constructor() {
    this.form = this.fs.form.get("grundbuchamt") as FormGroup;
  }

  async suchePlz(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    if (value.length === 5) {
      const ort: string = await this.fs.ortAusPLZ(value) || '';
      this.form.controls['ort'].setValue(ort);
    }
  }

  onlineSuchen() {
    window.open(
      "https://www.justizadressen.nrw.de/de/justiz/gericht?ang=grundbuch&plz=" +
      (this.fs.form.get('grundstueck') as FormGroup).get("plz")?.value +
      "&ort="
    );
  }
}
