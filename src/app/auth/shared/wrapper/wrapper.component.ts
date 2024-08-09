import { Component, input, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

import { AuthUserModel, AuthMode } from '../../auth.model';

@Component({
  selector: 'app-wrapper',
  standalone: true,
  imports: [
    MatCardModule,
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
  ],
  templateUrl: './wrapper.component.html',
  styleUrl: './wrapper.component.scss',
})
export class WrapperComponent {
  typeAuthorisation = input<AuthMode>('register');
  errorsMessages = input<string[]>();
  dataAuthorisation = output<AuthUserModel>();
  authorisationForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.authorisationForm = this.fb.group({
      name: ['', []],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onSubmit() {
    const authData: AuthUserModel = this.authorisationForm.value;
    // authData.id = '';
    this.dataAuthorisation.emit(this.authorisationForm.value);
  }
}
