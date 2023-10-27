import { AsyncPipe, JsonPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { map, startWith, tap } from 'rxjs';
import {SignUpForm, SignUpFormValue} from './sign-up-form';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
  imports: [ReactiveFormsModule, AsyncPipe, JsonPipe, NgIf],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUpComponent {
  readonly loginForm = new FormGroup<SignUpForm>({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  readonly loginFormValue$ = this.loginForm.valueChanges.pipe(
    startWith(this.loginForm.getRawValue()),
    // startWith({ email: '' }),
    // tap((x) => console.log(x)),
    map((x) => this.mapToObfuscatedLoginFormValue(x))
  );

  private mapToObfuscatedLoginFormValue(
    formValue: Partial<SignUpFormValue>
  ) {
    return {
      email: formValue.email ?? '',
      password: this.obfuscatePassword(formValue.password ?? ''),
    };
  }

  private obfuscatePassword(password: string) {
    return password.replace(/./g, '*');
  }

  onSubmit() {
    console.warn(this.loginForm.value);
  }
}
