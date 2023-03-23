import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { ViewportScroller } from '@angular/common';

@Injectable({
  providedIn: 'root'
})

export class FormService {

  form!: FormGroup
  private Step = new BehaviorSubject<number>(1);

  constructor(public http: HttpClient, public scroll: ViewportScroller) {}
  
  init(form: FormGroup){
    this.form = form;
    (this.form.get('grundstück') as FormGroup).get('plz')?.valueChanges.subscribe(plz => this.sucheGrundbuchamt(plz))
  }

  nextStep(step: number = this.Step.value + 1) {
    this.Step.next(step);
    this.scroll.scrollToPosition([0,0]);
  }

  getCurrentStepBehaviorSubject() {
    return this.Step.asObservable();
  }

  getCurrentStep(){
    return this.Step.value;
  }

  back(){
    this.Step.next(this.Step.value - 1);
  }

  restart(){
    this.Step.next(1);
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

  async sucheGrundbuchamt(plz: string){
    if(plz.length === 5){
      try{
        let jsonAmtsgerichtDaten: any = await this.AmtsgerichtAusPLZ(plz);
        const grundbuchamtForm = (this.form.get('grundbuchamt') as FormGroup);
  
        grundbuchamtForm.setValue({
          name: jsonAmtsgerichtDaten['amtsgericht'],
          straße: jsonAmtsgerichtDaten['straße'],
          plz: jsonAmtsgerichtDaten['plz'],
          ort: jsonAmtsgerichtDaten['ort']
        })
        console.log(grundbuchamtForm.get('name')?.value + ' wurde ermittelt.')
      }catch(err){
        console.error('Das Amtsgericht konnte nicht ermittelt werden.')
      }
    }
  }

  AmtsgerichtAusPLZ(plz: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const url = '/api/amtsgerichtausplz';
        const res = await lastValueFrom(this.http.get(url, {params: new HttpParams().set('plz', plz)}));
        resolve(res);
      } catch (err) {
        reject(err);
      }
    });
  }
}
