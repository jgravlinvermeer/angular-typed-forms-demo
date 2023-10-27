import { AsyncPipe, JsonPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule, ValidationErrors, ValidatorFn,
  Validators,
} from '@angular/forms';
import {filter, map, startWith} from 'rxjs';
import {PasswordConfirmForm, ProfileForm, SignUpForm, SignUpFormValue} from './sign-up-form';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
  imports: [ReactiveFormsModule, AsyncPipe, JsonPipe, NgIf],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUpComponent {
  readonly signUpForm = new FormGroup<SignUpForm>({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    confirmPassword: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    profile: new FormGroup<ProfileForm>({
      firstName: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      lastName: new FormControl(null, {
        validators: [],
      }),
      birthDate: new FormControl<Date|null>(null, {
        validators: [Validators.required],
      })
    })
  }, {
    validators: [this.passwordMatchValidator()]
  });

  passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl<PasswordConfirmForm>): ValidationErrors | null => {
      const controlValue = control.getRawValue();
      const forbidden = controlValue.password !== controlValue.confirmPassword;
      return forbidden ? {passwordMatch: true} : null;
    };
  }

  readonly loginFormValue$ = this.signUpForm.valueChanges.pipe(
    startWith(this.signUpForm.getRawValue()),
    filter((x): x is Partial<SignUpFormValue> => x !== undefined),
    // startWith({ email: '' }),
    // tap((x) => console.log(x)),
    map((x) => this.mapToObfuscatedPassword(x))
  );

  private mapToObfuscatedPassword(
    formValue: Partial<SignUpFormValue>
  ) {
    return {
      ...formValue,
      password: this.obfuscatePassword(formValue.password ?? ''),
    };
  }

  private obfuscatePassword(password: string) {
    return password.replace(/./g, '*');
  }

  onSubmit() {
    console.warn(this.signUpForm.value);
  }
}
