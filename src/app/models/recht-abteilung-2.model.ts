import { FormBuilder, FormGroup } from '@angular/forms';
import { BezeichnungRechtAbteilung2Validator } from '../validators/bezeichnungRechtAbteilung2.validator';
import { RechtIstLoeschbarValidator } from '../validators/rechtIstLoeschbar.validator';

export class RechtAbteilung2 {
  bezeichnung: string = '';
  laufendeNummer: number | '' = '';
  _datumDerBewilligung: string = '';

  getFormGroup(): FormGroup {
    const formBuilder = new FormBuilder();
    const formGroup = formBuilder.group({
      bezeichnung: [this.bezeichnung, [BezeichnungRechtAbteilung2Validator(), RechtIstLoeschbarValidator()]],
      laufendeNummer: [this.laufendeNummer],
      datumDerBewilligung: [this.datumDerBewilligung]
    });

    return formGroup;
  }

  get datumDerBewilligung(): string {
    return this._datumDerBewilligung;
  }

  set datumDerBewilligung(value: string) {
    this._datumDerBewilligung = value ? this.formatDate(value) : '';
  }

  formatDate(dateString: string) {
    const [year, month, day] = dateString.split('-');
    const formattedDate = `${day}.${month}.${year}`;
    return formattedDate;
  }
}
