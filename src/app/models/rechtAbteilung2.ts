import { FormBuilder, FormGroup } from "@angular/forms";

export class RechtAbteilung2 {
    bezeichnung: string = '';
    laufendeNummer: number | '' = '';
    _datumDerBewilligung: string = '';

    getFormGroup(): FormGroup {
        const formBuilder = new FormBuilder();
        return formBuilder.group({
            bezeichnung: [this.bezeichnung],
            laufendeNummer: [this.laufendeNummer],
            datumDerBewilligung: [this.datumDerBewilligung]
        });
    }

    get datumDerBewilligung(): string {
        return this._datumDerBewilligung;
    }

    set datumDerBewilligung(value: string) {
        this._datumDerBewilligung = value ? this.formatDate(value) : '';
    }

    formatDate(dateString: string) {
        const [year, month, day] = dateString.split('-');
        const formattedDate = `${day}.${month}.${year}`;
        return formattedDate;
    }
}