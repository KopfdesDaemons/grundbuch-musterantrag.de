import { FormGroup } from "@angular/forms";
import { Antragsteller } from "../models/antragsteller";
import { Grundbuchamt } from "../models/grundbuchamt";

export interface Antrag {
    title: string
    description: string
    antragsRoute: string
    mehrInfosRoute?: string
    templateFileName: string
    erforderlicheUnterlagen: string[]
    gebuehr: string

    antragsteller: Antragsteller
    grundbuchamt: Grundbuchamt

    datum: string
    hinweise?: string[]
    getFormGroup(): FormGroup
    loadFormValue(formValue: object): void
}