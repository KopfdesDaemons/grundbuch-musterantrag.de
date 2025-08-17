import { FormBuilder, FormGroup } from '@angular/forms';
import { Antrag } from '../../interfaces/antrag';
import { Antragsteller } from '../antragsteller.model';
import { Grundbuchamt } from '../grundbuchamt.model';
import { Grundstueck } from '../grundstueck.model';
import { BerechtigtesInteresse } from '../berechtigtes-interesse.model';
import { Bewilligung } from '../bewilligung.model';
import { Image } from '../image.model';

export class AntragAbschriftBewilligung implements Antrag {
  title: string = 'Erteilung von Abschriften einer Bewilligung';
  description: string = 'Kopien der Eintragungen im Grundbuch zugrundeliegenden Urkunden.';
  image?: Image | undefined = new Image('/images/kaufvertrag.avif', 'Musterkaufvertrag', 564, 802);
  antragsRoute: string = '/antrag/abschrift-bewilligung';
  mehrInfosRoute?: string | undefined = '/antragsinfos/bewilligungen';
  templateFileName: string = 'abschriftBewilligung';
  erforderlicheUnterlagen: string[] = ['Vollmacht, sofern Antragsteller nicht berechtigt ist'];

  gebuehr: string = '0,50 € je Seite, ab der 51. Seite 0,15 €';
  antragsteller: Antragsteller = new Antragsteller();
  grundstueck: Grundstueck = new Grundstueck();
  berechtigtesInteresse: BerechtigtesInteresse = new BerechtigtesInteresse();
  bewilligung: Bewilligung = new Bewilligung();
  farbe: 'farbig' | 'schwarz/weiß' = 'schwarz/weiß';
  grundbuchamt: Grundbuchamt = new Grundbuchamt();
  datum: string = '';
  hinweise?: string[] | undefined;

  getFormGroup(): FormGroup {
    const formBuilder = new FormBuilder();
    return formBuilder.group({
      antragsteller: this.antragsteller.getFormGroup(),
      grundstueck: this.grundstueck.getFormGroup(),
      berechtigtesInteresse: this.berechtigtesInteresse.getFormGroup(),
      bewilligung: this.bewilligung.getFormGroup(),
      farbe: [this.farbe],
      grundbuchamt: this.grundbuchamt.getFormGroup()
    });
  }

  loadFormValue(formValue: object): void {
    if (formValue) Object.assign(this, formValue);
    const antrag = formValue as AntragAbschriftBewilligung;
    if (antrag) {
      this.antragsteller = new Antragsteller();
      Object.assign(this.antragsteller, antrag.antragsteller);

      this.bewilligung = new Bewilligung();
      Object.assign(this.bewilligung, antrag.bewilligung);
    }
  }
}
