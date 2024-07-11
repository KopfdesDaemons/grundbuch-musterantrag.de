import { FormGroup } from "@angular/forms";
import { Antragsteller } from "../models/antragsteller";
import { Grundbuchamt } from "../models/grundbuchamt";

export interface Antrag {
    antragsteller: Antragsteller
    grundbuchamt: Grundbuchamt
    betreff: string
    getFormGroup(): FormGroup
}