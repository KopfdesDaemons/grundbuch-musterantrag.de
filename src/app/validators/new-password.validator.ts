import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function newPasswordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.value;
    if (!password) return null;
    if (typeof password !== 'string' || password.trim().length === 0) {
      return { passwordIsInvalid: { message: 'Passwort darf nicht nur aus Leerzeichen bestehen.' } };
    }
    if (password.length < 8) {
      return { passwordIsInvalid: { message: 'Passwort muss mindestens 8 Zeichen lang sein.' } };
    }
    return null;
  };
}
