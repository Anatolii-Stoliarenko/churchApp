import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { WrapperComponent } from '../wrapper/wrapper.component';
import { RegisterInterface, UserInterface } from '../../models/auth.model';
import { AuthState } from '../../store/auth.state';
import * as AuthActions from '../../../auth/store/auth.actions';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [WrapperComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  store = inject(Store<AuthState>);
  errorsMessages: string[] = [];

  register(data: UserInterface): void {
    const { name, email, password } = data;

    if (name && email && password) {
      const payload: RegisterInterface = {
        name,
        email,
        password,
      };
      this.store.dispatch(AuthActions.register({ payload: payload }));
    } else {
      console.error('Register failed: Name, email, and password are required.');
    }
  }
}
