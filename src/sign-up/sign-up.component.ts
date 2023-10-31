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

    // IMPORTANT:
    // If you are subscribing to an observable, then make sure to unsubscribe in
    // ngOnDestroy.
    //
    // Calling take(1)/first() or assuming an observable, such as an HTTP
    // call, will automatically cleanup is not enough. They will prevent memory
    // leaks but they will not prevent the subscribe method from being called
    // after the component is destroyed. This will leak the side effects of the
    // subscribe method, such as route navigation or showing a snackbar, that we
    // don't want to continue after the user has navigated away.
    //
    // HOW TO FIX IT:
    // Add the subscription returned from the subscribe method to a parent
    // subscription using Subscription#add.
    //
    // The only exceptions are:
    // 1. Observables exclusively used in the template. Don't even subscribe to
    // these in the first place. Just use the async pipe.
    // 2. Observables piped with takeUntil(otherObservable) where
    // otherObservable is unsubscribed in ngOnDestroy
    // 3. Observables from ActivatedRoute unless it's a nested or dynamic
    // component
    // 4. Observables that you truly want to run the side effect in the
    // subscribe method after the component is destroyed. This is rare, but
    // sometimes the logic calls for it.
    // 5. You live in the glorious future when we've migrated to Angular 16 and
    // can pipe in the takeUntilDestroyed function
    // https://stackoverflow.com/a/51850733
    // https://stackoverflow.com/a/51732897
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
