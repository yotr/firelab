import { AbstractControl, ValidatorFn } from '@angular/forms';

// if validator has no parameters
export const passwordMatch: ValidatorFn = (
  control: AbstractControl<any, any>
): { [key: string]: any } | null => {
  let passControl = control.get('password');
  let confirmPassControl = control.get('confirmPassword');
  return passControl?.value == confirmPassControl?.value
    ? null
    : { unMatchedPassword: true };
};
