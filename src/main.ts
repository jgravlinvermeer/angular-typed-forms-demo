import 'zone.js/dist/zone';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { bootstrapApplication } from '@angular/platform-browser';
import { SignUpComponent } from './sign-up/sign-up.component';

@Component({
  selector: 'my-app',
  standalone: true,
  imports: [CommonModule, SignUpComponent],
  template: ` <app-sign-up></app-sign-up> `,
})
export class App {
  name = 'Angular';
}

bootstrapApplication(App);
