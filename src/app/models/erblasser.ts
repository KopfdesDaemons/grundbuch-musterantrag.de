import { FormGroup, FormBuilder, Validators } from "@angular/forms";

export class Erblasser {
    vorname: string = ''
    nachname: string = ''
    _geburtsdatum: string = ''

    getFormGroup(): FormGroup {
        const formBuilder = new FormBuilder();
        return formBuilder.group({
            vorname: [this.vorname, Validators.required],
            nachname: [this.nachname, Validators.required],
            geburtsdatum: [this.geburtsdatum]
        });
    }

    get geburtsdatum(): string {
        return this._geburtsdatum;
    }

    set geburtsdatum(value: string) {
        this._geburtsdatum = value ? this.formatDate(value) : '';
    }

    formatDate(dateString: string) {
        const [year, month, day] = dateString.split('-');
        const formattedDate = `${day}.${month}.${year}`;
        return formattedDate;
    }
}