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

import { AuthMode, UserInterface } from '../../models/auth.model';
import { Store } from '@ngrx/store';
import { AppState } from '../../../shared/store/appState.interface';
import { Observable } from 'rxjs';
import { selectAuthLoading } from '../../store/selectors/auth.selectors';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';

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
    LoadingComponent,
  ],
  templateUrl: './wrapper.component.html',
  styleUrl: './wrapper.component.scss',
})
export class WrapperComponent {
  store = inject(Store<AppState>);
  isLoading$: Observable<boolean>;
  private fb = inject(FormBuilder);
  typeAuthorisation = input<AuthMode>('register');
  errorsMessages = input<string[]>();
  dataAuthorisation = output<UserInterface>();
  authorisationForm!: FormGroup;

  constructor() {
    this.isLoading$ = this.store.select(selectAuthLoading);
  }

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
