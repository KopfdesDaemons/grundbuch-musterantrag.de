import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * @description Checks if the value contains options that are not for this form
 * @returns {ValidationErrors | null}
 */
export function AmtsgerichtValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    // When there is no value, it is valid
    if (!control.value) return null;

    const value = control.value || '';
    const valueLowerCase = value.toLowerCase();
    const containsAG = valueLowerCase.includes('amtsgericht');
    return !containsAG
      ? {
          amtsgericht: {
            message: 'Die Bezeichnung des Gerichts sollte das Wort "Amtsgericht" enthalten.'
          }
        }
      : null;
  };
}
