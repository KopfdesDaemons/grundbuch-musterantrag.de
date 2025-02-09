import { FormGroup, FormBuilder, Validators } from '@angular/forms';

export class BerechtigtesInteresse {
    interesse: string = 'Ich bin Eigentümer';
    bemerkung: string = '';

    getFormGroup(): FormGroup {
        const formBuilder = new FormBuilder();
        return formBuilder.group({
            interesse: [this.interesse, Validators.required],
            bemerkung: [this.bemerkung]
        });
    }
}
