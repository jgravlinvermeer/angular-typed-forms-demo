import {Form, FormControl, FormGroup} from '@angular/forms';

export interface SignUpForm {
  email: FormControl<string>;
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
  profile: FormGroup<ProfileForm>;
}

export interface ProfileForm {
  firstName: FormControl<string>;
  lastName: FormControl<string|null>;
  birthDate: FormControl<Date|null>;
}

export interface SignUpFormValue {
  email: string;
  password: string;
  confirmPassword: string;
  profile: ProfileFormValue;
}

export interface ProfileFormValue {
  firstName: string;
  lastName: string|null;
  birthDate: Date|null;
}

export type PasswordConfirmForm = Pick<SignUpForm, 'password' | 'confirmPassword'>;
export type PasswordConfirmFormValue = Pick<SignUpFormValue, 'password' | 'confirmPassword'>;
