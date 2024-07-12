import { FormBuilder, FormGroup } from "@angular/forms";
import { Antrag } from "../interfaces/antrag";
import { Antragsteller } from "./antragsteller";
import { Grundbuchamt } from "./grundbuchamt";
import { Grundstueck } from "./grundstueck";

export class AntragNamensberichtigung implements Antrag {
    antragsteller: Antragsteller = new Antragsteller();
    grundstueck: Grundstueck = new Grundstueck();
    grundbuchamt: Grundbuchamt = new Grundbuchamt();

    templateFileName: string = 'namensberichtigung';
    datum: string = ''

    getFormGroup(): FormGroup {
        const formBuilder = new FormBuilder();
        return formBuilder.group({
            antragsteller: this.antragsteller.getFormGroup(),
            grundstueck: this.grundstueck.getFormGroup(),
            grundbuchamt: this.grundbuchamt.getFormGroup(),
        });
    }

    loadFormValue(formValue: object): void {
        if (formValue) Object.assign(this, formValue);
        const antrag = formValue as AntragNamensberichtigung;
        if (antrag) {
            this.antragsteller = new Antragsteller();
            Object.assign(this.antragsteller, antrag.antragsteller)
        }
    }
}