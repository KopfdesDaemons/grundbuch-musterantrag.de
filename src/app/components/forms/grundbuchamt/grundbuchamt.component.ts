import { HttpClient, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { lastValueFrom, Observable } from 'rxjs';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-grundbuchamt',
  templateUrl: './grundbuchamt.component.html',
  styleUrls: ['./grundbuchamt.component.scss']
})
export class GrundbuchamtComponent {
  form: FormGroup

  constructor(public fs: FormService, public http: HttpClient) {
    this.form = fs.form.get("grundbuchamt") as FormGroup;

    this.form.get('plz')?.valueChanges.subscribe(async plz => {

      if ((plz as string).length === 5) {
        let ort = await this.fs.ortAusPLZ(plz)
        this.form.controls['ort'].setValue(ort);
      }
    });

    // if(this.form.valid) this.fs.nextStep();
  }

  next() {
    if (this.form.valid) this.fs.nextStep();
  }

  onlineSuchen() {
    window.open(
      "https://www.justizadressen.nrw.de/de/justiz/gericht?ang=grundbuch&plz=" +
      (this.fs.form.get('grundstück') as FormGroup).get("plz")?.value +
      "&ort="
    );
  }
}
