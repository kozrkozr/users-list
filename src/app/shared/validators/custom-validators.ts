import { AbstractControl } from '@angular/forms';

export enum CustomValidatorsErrorKeys {
  NumberAndLetter = 'numberAndLetter',
  NotEqualControl = 'notEqualControl'
}

export class CustomValidators {
  static numberAndLetter(control: AbstractControl): { [key: string]: boolean } | null {
    const value: string = control.value || '';

    if (!value) {
      return null;
    }

    const hasNumber = /[0-9]/.test(value);
    const hasLetter = /[a-zA-Z]/.test(value);

    if (!hasNumber || !hasLetter) {
      return { [CustomValidatorsErrorKeys.NumberAndLetter]: true };
    }

    return null;
  }
}
