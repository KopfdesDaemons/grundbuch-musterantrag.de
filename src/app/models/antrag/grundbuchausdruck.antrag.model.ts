import { FormBuilder, FormGroup } from "@angular/forms";
import { Antrag } from "../../interfaces/antrag";
import { Antragsteller } from "../antragsteller.model";
import { BerechtigtesInteresse } from "../berechtigtes-interesse.model";
import { Grundbuchamt } from "../grundbuchamt.model";
import { Grundstueck } from "../grundstueck.model";
import { Image } from "../image.model";

export class AntragGrundbuchausdruck implements Antrag {
    title: string = 'Erteilung eines Grundbuchausdrucks';
    antragsRoute = "/antrag/grundbuchausdruck";
    mehrInfosRoute = "/antragsinfos/grundbuchausdruck";
    description = "Ihnen wird ein Ausdruck des kompletten Grundbuchs zugeschickt. Ein einfacher Grundbuchausdruck kostet 10,00 €.";
    image?: Image | undefined = new Image('/images/bestandsverzeichnis.avif', 'Bestandsverzeichnis', 729, 545);
    gebuehr = "mindestens 10,00 €";
    erforderlicheUnterlagen = ['Vollmacht, sofern Antragsteller nicht berechtigt ist'];

    antragsteller: Antragsteller = new Antragsteller();
    grundstueck: Grundstueck = new Grundstueck();
    _formDesAusdrucks: 'beglaubigt' | 'einfach' = 'einfach';
    formDesAusdrucksAdjektiv: 'beglaubigten' | 'einfachen' = 'einfachen';
    berechtigtesInteresse: BerechtigtesInteresse = new BerechtigtesInteresse;
    grundbuchamt: Grundbuchamt = new Grundbuchamt();

    datum: string = '';
    kosten: '10,00 €' | '20,00 €' = '10,00 €';
    betreff: string = '';
    templateFileName: string = 'grundbuchausdruck';

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

    loadFormValue(formValue: object): void {
        if (formValue) Object.assign(this, formValue);
        const antrag = formValue as AntragGrundbuchausdruck;
        if (antrag) {
            this.antragsteller = new Antragsteller();
            Object.assign(this.antragsteller, antrag.antragsteller)

            if (!antrag.grundstueck.blattnummer) antrag.grundstueck.blattnummer = '';
            this.betreff = `${antrag.grundstueck.gemarkung} ${antrag.grundstueck.blattnummer}`;
        }
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