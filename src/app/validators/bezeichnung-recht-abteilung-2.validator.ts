import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * @description Checks if the value contains options that are not for this form
 * @returns {ValidationErrors | null}
 */
export function BezeichnungRechtAbteilung2Validator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const invalidOptions = ['grundschuld', 'hypothek', 'rentenschuld'];

    // When there is no value, it is valid
    if (!control.value) return null;

    const value = control.value || '';
    const valueLowerCase = value.toLowerCase();
    const containsInvalidOption = invalidOptions.some(option => valueLowerCase.includes(option));
    return containsInvalidOption
      ? {
          nichtAbteilung2: {
            message:
              'Diese Formular ist nicht für diese Recht geeignet, da es nicht in der Abteilung II eingetragen wird. Bei Löschungen von Rechten in Abteilung III bedarf es einer Unterschriftsbeglaubigung.'
          }
        }
      : null;
  };
}
