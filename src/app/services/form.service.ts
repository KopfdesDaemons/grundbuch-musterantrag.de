import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { ViewportScroller } from '@angular/common';
import { Antrag } from '../interfaces/antrag';

@Injectable({
  providedIn: 'root'
})

export class FormService {

  antrag: Antrag | null = null;
  form!: FormGroup
  private Step = new BehaviorSubject<number>(1);
  constrolsAndComponents: { control: string, component: string }[] = [
    { control: 'antragsteller', component: 'antragsteller' },
    { control: 'grundstueck', component: 'grundstueck' },
    { control: 'formDesAusdrucks', component: 'form-des-ausdrucks' },
    { control: 'berechtigtesInteresse', component: 'berechtigtes-interesse' },
    { control: 'grundbuchamt', component: 'grundbuchamt' }
  ]
  requiredComponents: string[] = []
  currentComponent: string = ''

  constructor(public http: HttpClient, public scroll: ViewportScroller) { }

  init(antrag: Antrag) {
    this.antrag = antrag;
    this.form = antrag.getFormGroup();
    this.requiredComponents = this.getRequiredComponents(this.form);
    (this.form.get('grundstueck') as FormGroup).get('plz')?.valueChanges.subscribe(plz => this.sucheGrundbuchamt(plz));
    this.nextStep(1);
  }

  nextStep(step: number = this.Step.value + 1): void {
    if (step <= this.requiredComponents.length) {
      const nextComponent = this.requiredComponents[step - 1];
      if (this.checkGrundbuchamtSkip(nextComponent)) {
        return this.nextStep(step + 1);
      }
      this.currentComponent = nextComponent;
      this.Step.next(step);
      this.scroll.scrollToPosition([0, 0]);
    }

    // Wenn Ende erreicht
    if (step === this.requiredComponents.length + 1) {
      this.currentComponent = 'antragsgenerierung';
    }
  }

  private checkGrundbuchamtSkip(nextComponent: string): boolean {
    if (nextComponent === 'grundbuchamt') {
      if ((this.form.get('grundbuchamt') as FormGroup).valid) return true
    }
    return false;
  }

  getCurrentStep() {
    return this.Step.value;
  }

  stepback(step: number = this.Step.value - 1): void {
    if (step >= 0) {
      const previousComponent = this.requiredComponents[step - 1];
      this.currentComponent = previousComponent;
      this.Step.next(step);
      this.scroll.scrollToPosition([0, 0]);
    }
  }

  antragAbschließen() {
    if (!this.antrag) return;
    this.antrag.loadFormValue(this.form.value);
    this.antrag.datum = this.getFormattedDate(new Date());
  }

  async ortAusPLZ(plz: string): Promise<string | null> {
    let url = "https://api.zippopotam.us/de/" + plz;

    try {
      const json = await lastValueFrom(this.http.get<any>(url));
      if (json.places && json.places.length > 0) {
        return json.places[0]['place name'];
      } else {
        return null;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async sucheGrundbuchamt(plz: string) {
    if (plz.length === 5) {
      try {
        let jsonAmtsgerichtDaten: any = await this.AmtsgerichtAusPLZ(plz);
        const grundbuchamtForm = (this.form.get('grundbuchamt') as FormGroup);

        grundbuchamtForm.setValue({
          name: jsonAmtsgerichtDaten['amtsgericht'],
          straße: jsonAmtsgerichtDaten['straße'],
          plz: jsonAmtsgerichtDaten['plz'],
          ort: jsonAmtsgerichtDaten['ort']
        })
        console.log(grundbuchamtForm.get('name')?.value + ' wurde ermittelt.')
      } catch (err) {
        console.error('Das Amtsgericht konnte nicht ermittelt werden.');
        console.error(err);
      }
    }
  }

  AmtsgerichtAusPLZ(plz: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const url = '/api/amtsgerichtausplz';
        const res = await lastValueFrom(this.http.get(url, { params: new HttpParams().set('plz', plz) }));
        resolve(res);
      } catch (err) {
        reject(err);
      }
    });
  }

  getFormattedDate(date: Date): string {
    const tag = String(date.getDate()).padStart(2, '0');
    const monat = String(date.getMonth() + 1).padStart(2, '0');
    const jahr = date.getFullYear();
    return `${tag}.${monat}.${jahr}`;
  }

  private getRequiredComponents(form: FormGroup): string[] {
    const components: string[] = [];

    for (const control of this.constrolsAndComponents) {
      if (form.controls.hasOwnProperty(control.control)) {
        components.push(control.component);
      }
    }
    if (this.antrag?.hinweise) components.push('hinweis')
    return components;
  }
}
