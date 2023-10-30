import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  UntypedFormControl,
  UntypedFormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { UntypedProfileComponent } from './untyped-profile/untyped-profile.component';
import { PasswordConfirmForm, SignUpFormValue } from '../sign-up/sign-up-form';
import { filter, map, startWith } from 'rxjs';

@Component({
  selector: 'app-untyped-sign-up',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, UntypedProfileComponent],
  templateUrl: './untyped-sign-up.component.html',
  styleUrls: ['./untyped-sign-up.component.css'],
})
export class UntypedSignUpComponent {
  get profileFormGroup() {
    return this.signUpForm.controls['profile'] as UntypedFormGroup;
  }

  readonly signUpForm = new UntypedFormGroup(
    {
      email: new UntypedFormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
      }),
      password: new UntypedFormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      confirmPassword: new UntypedFormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      profile: new UntypedFormGroup({
        firstName: new UntypedFormControl('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
        lastName: new UntypedFormControl(null, {
          validators: [],
        }),
      }),
    },
    {
      validators: [this.passwordMatchValidator()],
    },
  );

  readonly signUpFormValue$ = this.signUpForm.valueChanges.pipe(
    startWith(this.signUpForm.getRawValue()),
    filter((x): x is Partial<SignUpFormValue> => x !== undefined),
    map((x) => this.mapToObfuscatedPassword(x)),
  );

  onSubmit() {
    console.warn(this.signUpForm.value);
  }

  private passwordMatchValidator(): ValidatorFn {
    return (
      control: AbstractControl<PasswordConfirmForm>,
    ): ValidationErrors | null => {
      const controlValue = control.getRawValue();
      const forbidden = controlValue.password !== controlValue.confirmPassword;
      return forbidden ? { passwordMatch: true } : null;
    };
  }

  private mapToObfuscatedPassword(
    formValue: Partial<SignUpFormValue>,
  ): Partial<SignUpFormValue> {
    return {
      ...formValue,
      password: this.obfuscatePassword(formValue.password ?? ''),
    };
  }

  private obfuscatePassword(password: string) {
    return password.replace(/./g, '*');
  }

  protected readonly UntypedFormGroup = UntypedFormGroup;
}
