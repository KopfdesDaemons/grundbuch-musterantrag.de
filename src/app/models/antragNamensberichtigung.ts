import { FormBuilder, FormGroup } from "@angular/forms";
import { Antrag } from "../interfaces/antrag";
import { Antragsteller } from "./antragsteller";
import { Grundbuchamt } from "./grundbuchamt";
import { Grundstueck } from "./grundstueck";

export class AntragNamensberichtigung implements Antrag {
    antragsteller: Antragsteller = new Antragsteller();
    grundstueck: Grundstueck = new Grundstueck();
    grundbuchamt: Grundbuchamt = new Grundbuchamt();
    hinweise?: string[] | undefined = [
        `Dem Antrag ist zwingend ein Nachweis über die Namensänderung beizufügen. Als Nachweis dient z.B. eine Eheurkunde. 
        Der Nachweis muss als Original oder als beglaubigte Kopie vorliegen, eine einfache Kopie ist nicht ausreichend. 
        Wenn Sie keine beglaubigte Kopie erstellen lassen wollen, können Sie das Original mitschicken oder vor Ort vorzeigen.`,
    ];

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