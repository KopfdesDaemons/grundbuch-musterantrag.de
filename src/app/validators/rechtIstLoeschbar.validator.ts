import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * @description Prüft, ob der Wert ungültige Begriffe enthält.
 * @returns {ValidationErrors | null}
 */
export function RechtIstLoeschbarValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const invalidOptions = ['zwangsversteigerung', 'zwangsverwaltung'];

    // Wenn kein Wert vorhanden ist, gilt er als gültig
    if (!control.value) return null;

    const valueLowerCase = control.value.toLowerCase();
    const containsInvalidOption = invalidOptions.some(option => valueLowerCase.includes(option));

    return containsInvalidOption
      ? {
          nichtAbteilung2: {
            message:
              'Eintragungen vom Vollstreckungsgericht werden durch ein Ersuchen des Vollstreckungsgerichts an das Grundbuchamt gelöscht. Dies geschieht automatisch nach Abschluss des dortigen Verfahrens.'
          }
        }
      : null;
  };
}
