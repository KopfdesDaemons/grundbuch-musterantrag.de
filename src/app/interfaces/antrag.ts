import { FormGroup } from '@angular/forms';
import { Antragsteller } from '../models/antragsteller.model';
import { Grundbuchamt } from '../models/grundbuchamt.model';
import { Image } from '../models/image.model';

export interface Antrag {
  title: string;
  description: string;
  antragsRoute: string;
  mehrInfosRoute?: string;
  image?: Image;
  templateFileName: string;
  erforderlicheUnterlagen: string[];
  gebuehr: string;

  antragsteller: Antragsteller;
  grundbuchamt: Grundbuchamt;

  datum: string;
  hinweise?: string[];
  getFormGroup(): FormGroup;
  loadFormValue(formValue: object): void;
}
