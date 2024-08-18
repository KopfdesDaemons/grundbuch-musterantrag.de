import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * @description Checks if the value contains the word 'IV' or 'IV'
 * @returns {ValidationErrors | null}
 */
export function NachlassAktenzeichenValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

        // When there is no value, it is valid
        if (!control.value) return null;

        const value = control.value || '';
        const regex = /.*(IV|VI).*/;
        const valid = regex.test(value);
        return valid ? null : { IVorVI: true };
    };
}