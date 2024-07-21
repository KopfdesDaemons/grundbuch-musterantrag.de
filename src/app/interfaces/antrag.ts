import { FormGroup } from "@angular/forms";
import { Antragsteller } from "../models/antragsteller";
import { Grundbuchamt } from "../models/grundbuchamt";

export interface Antrag {
    title: string
    antragsteller: Antragsteller
    grundbuchamt: Grundbuchamt
    getFormGroup(): FormGroup
    datum: string
    templateFileName: string
    loadFormValue(formValue: object): void
    hinweise?: string[]
    antragsRoute: string
    mehrInfosRoute?: string
    description: string
    gebuehr: string
    erforderlicheUnterlagen: string[]
}