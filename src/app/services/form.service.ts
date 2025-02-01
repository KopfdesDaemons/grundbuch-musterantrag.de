import { inject, Injectable, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { ViewportScroller } from '@angular/common';
import { Antrag } from '../interfaces/antrag';
import { TimeHelper } from '../helpers/time.helper';

@Injectable({
  providedIn: 'root'
})

export class FormService {
  http = inject(HttpClient);
  scroll = inject(ViewportScroller);

  antrag: Antrag | null = null;
  form!: FormGroup;
  progress = signal(0);
  private Step = new BehaviorSubject<number>(1);
  constrolsAndComponents: { control: string, component: string }[] = [
    { control: 'antragsteller', component: 'antragsteller' },
    { control: 'erblasser', component: 'erblasser' },
    { control: 'grundstueck', component: 'grundstueck' },
    { control: 'rechtAbteilung2', component: 'rechtAbteilung2' },
    { control: 'erbnachweis', component: 'erbnachweis' },
    { control: 'bewilligung', component: 'bewilligung' },
    { control: 'teilungserklaerung', component: 'teilungserklaerung' },
    { control: 'farbe', component: 'farbe' },
    { control: 'weitererGrundbesitz', component: 'weitererGrundbesitz' },
    { control: 'formDesAusdrucks', component: 'form-des-ausdrucks' },
    { control: 'berechtigtesInteresse', component: 'berechtigtes-interesse' },
    { control: 'grundbuchamt', component: 'grundbuchamt' }
  ]
  requiredComponents: string[] = []
  currentComponent: string = ''

  init(antrag: Antrag) {
    this.antrag = antrag;
    this.form = antrag.getFormGroup();
    this.requiredComponents = this.getRequiredComponents(this.form);
    (this.form.get('grundstueck') as FormGroup).get('plz')?.valueChanges.subscribe(plz => this.sucheGrundbuchamt(plz));
    this.nextStep(1);

    // For Development:
    // this.currentComponent = 'teilungserklaerung';
  }

  nextStep(step: number = this.Step.value + 1): void {
    // Wenn step möglich ist
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

    this.setProgress();
  }

  private setProgress() {
    const step: number = this.requiredComponents.indexOf(this.currentComponent);
    const progress: number = step / this.requiredComponents.length * 100;
    this.progress.set(progress);
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
      this.setProgress();
    }
  }

  antragAbschließen() {
    if (!this.antrag) return;
    this.progress.set(100);
    this.antrag.loadFormValue(this.form.value);
    this.antrag.datum = TimeHelper.formatDate(new Date());
  }

  async ortAusPLZ(plz: string): Promise<string | null> {
    const url = "https://api.zippopotam.us/de/" + plz;
    try {
      const response = await lastValueFrom(this.http.get(url));
      const json = response as { places: { 'place name': string }[] };
      if (json.places && json.places.length > 0) {
        const ort = json.places[0]['place name'];
        return ort
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
        const jsonAmtsgerichtDaten: any = await this.AmtsgerichtAusPLZ(plz);
        const grundbuchamtForm = (this.form.get('grundbuchamt') as FormGroup);

        grundbuchamtForm.setValue({
          name: jsonAmtsgerichtDaten['amtsgericht'],
          straße: jsonAmtsgerichtDaten['straße'],
          plz: jsonAmtsgerichtDaten['plz'],
          ort: jsonAmtsgerichtDaten['ort']
        })
        console.log(grundbuchamtForm.get('name')?.value + ' wurde ermittelt.')
      } catch {
        console.error('Das Amtsgericht konnte nicht ermittelt werden.');
      }
    }
  }

  async AmtsgerichtAusPLZ(plz: string) {
    const url = '/api/amtsgerichtausplz';
    return await lastValueFrom(this.http.get(url, { params: new HttpParams().set('plz', plz) }));
  }

  private getRequiredComponents(form: FormGroup): string[] {
    const components: string[] = [];

    for (const control of this.constrolsAndComponents) {
      if (Object.prototype.hasOwnProperty.call(form.controls, control.control)) {
        components.push(control.component);
      }
    }
    if (this.antrag?.hinweise) components.push('hinweis')
    return components;
  }
}
