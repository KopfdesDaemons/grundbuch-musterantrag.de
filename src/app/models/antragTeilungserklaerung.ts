import { FormBuilder, FormGroup } from "@angular/forms";
import { Antrag } from "../interfaces/antrag";
import { Antragsteller } from "./antragsteller";
import { Grundbuchamt } from "./grundbuchamt";
import { Grundstueck } from "./grundstueck";
import { BerechtigtesInteresse } from "./berechtigtesInteresse";
import { Image } from "./image";

export class AntragTeilungserklaerung implements Antrag {
    title: string = 'Teilungserklärung, Abgeschlossenheitsbescheinigung, Aufteilungsplan';
    description: string = 'Diese Unterlagen gibt es nur bei Wohnungseigentum.';
    image?: Image | undefined = new Image('/images/aufteilungsplan-bunt.avif', 'Aufteilungsplan einer Wohnung', 800, 800);
    antragsRoute: string = '/antrag/teilungserklaerung';
    mehrInfosRoute?: string | undefined = '/antragsinfos/teilungserklaerung';
    templateFileName: string = "teilungserklaerung";
    erforderlicheUnterlagen = ['Vollmacht, sofern Antragsteller nicht berechtigt ist'];
    gebuehr: string = '0,50 € je Seite, ab der 51. Seite 0,15 €';

    antragsteller: Antragsteller = new Antragsteller();
    grundstueck: Grundstueck = new Grundstueck();
    farbe: 'farbig' | 'schwarz/weiß' = 'schwarz/weiß';
    berechtigtesInteresse: BerechtigtesInteresse = new BerechtigtesInteresse();
    grundbuchamt: Grundbuchamt = new Grundbuchamt();
    datum: string = '';
    hinweise?: string[] | undefined;

    teilungserklaerung: boolean = true;
    abgeschlossenheitsbescheinigung: boolean = true;
    aufteilungsplan: boolean = true;

    loadFormValue(formValue: object): void {
        if (formValue) Object.assign(this, formValue);
        const antrag = formValue as AntragTeilungserklaerung;
        if (antrag) {
            this.antragsteller = new Antragsteller();
            Object.assign(this.antragsteller, antrag.antragsteller)
        }
    }

    getFormGroup(): FormGroup {
        const formBuilder = new FormBuilder();
        return formBuilder.group({
            antragsteller: this.antragsteller.getFormGroup(),
            grundstueck: this.grundstueck.getFormGroup(),
            teilungserklaerung: this.getFormGroupUnterlagen(),
            farbe: [this.farbe],
            berechtigtesInteresse: this.berechtigtesInteresse.getFormGroup(),
            grundbuchamt: this.grundbuchamt.getFormGroup(),
        });
    }

    getFormGroupUnterlagen(): FormGroup {
        const formBuilder = new FormBuilder();
        return formBuilder.group({
            teilungserklaerung: [this.teilungserklaerung],
            abgeschlossenheitsbescheinigung: [this.abgeschlossenheitsbescheinigung],
            aufteilungsplan: [this.aufteilungsplan]
        })
    }
}