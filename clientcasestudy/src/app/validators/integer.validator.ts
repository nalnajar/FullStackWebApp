import { AbstractControl } from '@angular/forms';
export function ValidateInteger(control: AbstractControl): { invalidInteger: boolean } | null {
 const INTEGER_REGEXP =  /^\d+$/;
 return !INTEGER_REGEXP.test(control.value) ? { invalidInteger: true } : null;
} // ValidateDecimal