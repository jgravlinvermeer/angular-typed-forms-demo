import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ProfileForm } from '../sign-up-form';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  // See: https://angular.io/guide/inputs-outputs#configuring-the-child-component-input-as-required-field
  @Input({ required: true }) form!: FormGroup<ProfileForm>;
}
