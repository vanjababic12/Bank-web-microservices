import { AbstractControl, ValidatorFn } from "@angular/forms";

// Custom validator function
export function minimumAgeValidator(minAge: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        if (!control.value) {
            return null; // Don't validate empty value
        }
        const today = new Date();
        const birthDate = new Date(control.value);
        var age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age >= minAge ? null : { 'minimumAge': { value: control.value } };
    };
}