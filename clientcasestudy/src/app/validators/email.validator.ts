import { AbstractControl } from '@angular/forms';
export function ValidateEmail(control: AbstractControl): { invalidEmail: boolean } | null {
 const EMAIL_REGEXP = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
 return !EMAIL_REGEXP.test(control.value) ? { invalidEmail: true } : null;
} // ValidateEmail