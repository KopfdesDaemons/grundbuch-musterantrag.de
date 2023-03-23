import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-grundstueck',
  templateUrl: './grundstueck.component.html',
  styleUrls: ['./grundstueck.component.scss']
})
export class GrundstueckComponent {

  form: FormGroup

  constructor(public fs: FormService){
    this.form = fs.form.get("grundstück") as FormGroup;

    this.form.get('plz')?.valueChanges.subscribe(async plz => {
      if((plz as string).length === 5){
        let ort = await this.fs.ortAusPLZ(plz)
        this.form.controls['ort'].setValue(ort);
      }
    })


  }

  anschriftuebernehmen(){
    let antragstellerForm = this.fs.form.get('antragsteller') as FormGroup;
    this.form.controls['plz'].setValue(antragstellerForm?.get('plz')?.value);
    this.form.controls['straße'].setValue(antragstellerForm?.get('straße')?.value);
    this.form.controls['ort'].setValue(antragstellerForm?.get('ort')?.value);
  }

  next(){
    if(this.form.valid) this.fs.nextStep();
  }
}
