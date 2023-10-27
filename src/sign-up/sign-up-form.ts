import { FormControl } from '@angular/forms';

export interface SignUpForm {
  email: FormControl<string>;
  password: FormControl<string>;
}

export interface SignUpFormValue {
  email: string;
  password: string;
}
