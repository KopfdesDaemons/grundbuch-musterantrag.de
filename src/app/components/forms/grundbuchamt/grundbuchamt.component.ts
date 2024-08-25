import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-grundbuchamt',
  templateUrl: './grundbuchamt.component.html',
  styleUrls: ['./grundbuchamt.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule]
})
export class GrundbuchamtComponent {
  form: FormGroup;

  fs = inject(FormService);
  http = inject(HttpClient);

  constructor() {
    this.form = this.fs.form.get("grundbuchamt") as FormGroup;

    this.form.get('plz')?.valueChanges.subscribe(async plz => {

      if ((plz as string).length === 5) {
        let ort = await this.fs.ortAusPLZ(plz)
        this.form.controls['ort'].setValue(ort);
      }
    });
  }

  onlineSuchen() {
    window.open(
      "https://www.justizadressen.nrw.de/de/justiz/gericht?ang=grundbuch&plz=" +
      (this.fs.form.get('grundstueck') as FormGroup).get("plz")?.value +
      "&ort="
    );
  }
}
