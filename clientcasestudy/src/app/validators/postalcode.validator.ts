import { AbstractControl } from '@angular/forms';
export function ValidatePosCode(control: AbstractControl): { invalidPoscode: boolean } | null {
 const POSCODE_REGEXP = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
 return !POSCODE_REGEXP.test(control.value) ? { invalidPoscode: true } : null;
} // ValidatePosCode