import { FormBuilder, FormGroup, Validators } from "@angular/forms";

export class Bewilligung {
    bezeichnung: string = '';
    abteilung: 'I' | 'II' | 'III' = 'II';
    laufendeNummer: number | '' = '';
    _datum: string = '';

    getFormGroup(): FormGroup {
        const formBuilder = new FormBuilder();
        return formBuilder.group({
            bezeichnung: [this.bezeichnung, Validators.required],
            abteilung: [this.abteilung, Validators.required],
            laufendeNummer: [this.laufendeNummer],
            datum: [this.datum]
        });
    }

    get datum(): string {
        return this._datum;
    }

    set datum(value: string) {
        this._datum = value ? this.formatDate(value) : '';
    }

    formatDate(dateString: string) {
        const [year, month, day] = dateString.split('-');
        const formattedDate = `${day}.${month}.${year}`;
        return formattedDate;
    }
}