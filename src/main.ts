import 'zone.js/dist/zone';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { bootstrapApplication } from '@angular/platform-browser';
import { LoginComponent } from './login/login.component';

@Component({
  selector: 'my-app',
  standalone: true,
  imports: [CommonModule, LoginComponent],
  template: `
    <app-login></app-login>
  `,
})
export class App {
  name = 'Angular';
}

bootstrapApplication(App);
