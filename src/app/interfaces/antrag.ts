import { FormGroup } from "@angular/forms";
import { Antragsteller } from "../models/antragsteller";
import { Grundbuchamt } from "../models/grundbuchamt";

export interface Antrag {
    antragsteller: Antragsteller
    grundbuchamt: Grundbuchamt
    getFormGroup(): FormGroup
    datum: string
    templateFileName: string
    loadFormValue(formValue: object): void
}