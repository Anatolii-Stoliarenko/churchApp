import { Component, inject, input, output } from '@angular/core';
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

import { AuthMode, User } from '../auth.model';

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
  private fb = inject(FormBuilder);
  typeAuthorisation = input<AuthMode>('register');
  errorsMessages = input<string[]>();
  dataAuthorisation = output<User>();
  authorisationForm!: FormGroup;

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.authorisationForm = this.fb.group({
      name: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onSubmit() {
    this.dataAuthorisation.emit(this.authorisationForm.value);
  }
}
