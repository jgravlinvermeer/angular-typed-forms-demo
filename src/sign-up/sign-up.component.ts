import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { filter, map, startWith } from 'rxjs';
import {
  PasswordConfirmForm,
  ProfileForm,
  SignUpForm,
  SignUpFormValue,
} from './sign-up-form';
import { ProfileComponent } from './profile/profile.component';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
  imports: [CommonModule, ReactiveFormsModule, ProfileComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUpComponent {
  readonly signUpForm = new FormGroup<SignUpForm>(
    {
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
    if (this.signUpForm.invalid) {
      return;
    }
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
}
