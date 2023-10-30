import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-untyped-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './untyped-profile.component.html',
  styleUrls: ['./untyped-profile.component.css'],
})
export class UntypedProfileComponent {
  // See: https://angular.io/guide/inputs-outputs#configuring-the-child-component-input-as-required-field
  @Input({ required: true }) form!: UntypedFormGroup;
}
