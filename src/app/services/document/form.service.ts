import { inject, Injectable, signal, Type } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { ViewportScroller } from '@angular/common';
import { Antrag } from '../../interfaces/antrag';
import { TimeHelper } from '../../helpers/time.helper';
import { AntragstellerComponent } from 'src/app/components/forms/antragsteller/antragsteller.component';
import { ErblasserComponent } from 'src/app/components/forms/erblasser/erblasser.component';
import { GrundstueckComponent } from 'src/app/components/forms/grundstueck/grundstueck.component';
import { RechtAbteilung2Component } from 'src/app/components/forms/recht-abteilung2/recht-abteilung2.component';
import { ErbnachweisComponent } from 'src/app/components/forms/erbnachweis/erbnachweis.component';
import { BewilligungComponent } from 'src/app/components/forms/bewilligung/bewilligung.component';
import { TeilungserklaerungComponent } from 'src/app/components/forms/teilungserklaerung/teilungserklaerung.component';
import { FarbeComponent } from 'src/app/components/forms/farbe/farbe.component';
import { WeitererGrundbesitzComponent } from 'src/app/components/forms/weiterer-grundbesitz/weiterer-grundbesitz.component';
import { FormDesAusdrucksComponent } from 'src/app/components/forms/form-des-ausdrucks/form-des-ausdrucks.component';
import { BerechtigtesInteresseComponent } from 'src/app/components/forms/berechtigtes-interesse/berechtigtes-interesse.component';
import { HinweisComponent } from 'src/app/components/forms/hinweis/hinweis.component';
import { AntragsgenerierungComponent } from 'src/app/components/forms/antragsgenerierung/antragsgenerierung.component';
import { GrundbuchamtComponent } from 'src/app/components/forms/grundbuchamt/grundbuchamt.component';

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
  constrolsAndComponents: { control: string, component: Type<any> }[] = [
    { control: 'antragsteller', component: AntragstellerComponent },
    { control: 'erblasser', component: ErblasserComponent },
    { control: 'grundstueck', component: GrundstueckComponent },
    { control: 'rechtAbteilung2', component: RechtAbteilung2Component },
    { control: 'erbnachweis', component: ErbnachweisComponent },
    { control: 'bewilligung', component: BewilligungComponent },
    { control: 'teilungserklaerung', component: TeilungserklaerungComponent },
    { control: 'farbe', component: FarbeComponent },
    { control: 'weitererGrundbesitz', component: WeitererGrundbesitzComponent },
    { control: 'formDesAusdrucks', component: FormDesAusdrucksComponent },
    { control: 'berechtigtesInteresse', component: BerechtigtesInteresseComponent },
    { control: 'grundbuchamt', component: GrundbuchamtComponent }
  ]
  requiredComponents: Type<any>[] = []
  currentComponent: Type<any> = AntragstellerComponent

  init(antrag: Antrag) {
    this.antrag = antrag;
    this.form = antrag.getFormGroup();
    this.requiredComponents = this.getRequiredComponents(this.form);
    (this.form.get('grundstueck') as FormGroup).get('plz')?.valueChanges.subscribe(plz => this.sucheGrundbuchamt(plz));
    this.nextStep(1);
  }

  private getRequiredComponents(form: FormGroup): Type<any>[] {
    const components: Type<any>[] = [];

    for (const control of this.constrolsAndComponents) {
      if (Object.prototype.hasOwnProperty.call(form.controls, control.control)) {
        components.push(control.component);
      }
    }
    if (this.antrag?.hinweise) components.push(HinweisComponent)
    return components;
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
      this.currentComponent = AntragsgenerierungComponent;
    }

    this.setProgress();
  }

  private setProgress() {
    const step: number = this.requiredComponents.indexOf(this.currentComponent);
    const progress: number = step / this.requiredComponents.length * 100;
    this.progress.set(progress);
  }

  private checkGrundbuchamtSkip(nextComponent: Type<any>): boolean {
    if (nextComponent === GrundbuchamtComponent) {
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
        const url = '/api/amtsgerichtausplz';
        const response = await lastValueFrom(this.http.get(url, { params: new HttpParams().set('plz', plz) }));
        const jsonAmtsgerichtDaten = response as { amtsgericht: string; straße: string; plz: string; ort: string };
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
}
