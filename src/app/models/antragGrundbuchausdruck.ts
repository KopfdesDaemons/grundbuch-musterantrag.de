import { FormBuilder, FormGroup } from "@angular/forms";
import { Antrag } from "../interfaces/antrag";
import { Antragsteller } from "./antragsteller";
import { BerechtigtesInteresse } from "./berechtigtesInteresse";
import { Grundbuchamt } from "./grundbuchamt";
import { Grundstueck } from "./grundstueck";

export class AntragGrundbuchausdruck implements Antrag {
    antragsteller: Antragsteller = new Antragsteller();
    grundstueck: Grundstueck = new Grundstueck;
    _formDesAusdrucks: 'beglaubigt' | 'einfach' = 'einfach';
    formDesAusdrucksAdjektiv: 'beglaubigten' | 'einfachen' = 'einfachen'
    berechtigtesInteresse: BerechtigtesInteresse = new BerechtigtesInteresse;
    grundbuchamt: Grundbuchamt = new Grundbuchamt;
    datum: string = ''
    kosten: '10,00 €' | '20,00 €' = '10,00 €'
    betreff: string = 'Grundbuchsache'

    constructor(formValue: object | null = null) {
        if (formValue) Object.assign(this, formValue);
        const antrag = formValue as AntragGrundbuchausdruck;
        if (antrag) {
            this.antragsteller = new Antragsteller();
            Object.assign(this.antragsteller, antrag.antragsteller)

            this.betreff = `${antrag.grundstueck.gemarkung} ${antrag.grundstueck.blattnummer}`;
        }
    }

    getFormGroup(): FormGroup {
        const formBuilder = new FormBuilder();
        return formBuilder.group({
            antragsteller: this.antragsteller.getFormGroup(),
            grundstueck: this.grundstueck.getFormGroup(),
            formDesAusdrucks: [this.formDesAusdrucks],
            berechtigtesInteresse: this.berechtigtesInteresse.getFormGroup(),
            grundbuchamt: this.grundbuchamt.getFormGroup(),
        });
    }

    set formDesAusdrucks(value: 'beglaubigt' | 'einfach') {
        this._formDesAusdrucks = value;
        this.kosten = value === 'beglaubigt' ? '20,00 €' : '10,00 €';
        this.formDesAusdrucksAdjektiv = value === 'beglaubigt' ? 'beglaubigten' : 'einfachen';
    }

    get formDesAusdrucks(): 'beglaubigt' | 'einfach' {
        return this._formDesAusdrucks;
    }
}