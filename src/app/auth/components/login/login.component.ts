import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { AuthState } from '../../store/auth.state';
import * as AuthActions from '../../../auth/store/auth.actions';
import { WrapperComponent } from '../wrapper/wrapper.component';
import { LoginInterface, UserInterface } from '../../models/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [WrapperComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  store = inject(Store<AuthState>);
  errorsMessages: string[] = [];

  login(data: UserInterface) {
    const { email, password } = data;
    if (email && password) {
      const payload: LoginInterface = {
        email,
        password,
      };
      this.store.dispatch(
        AuthActions.login({
          payload: payload,
        })
      );
    } else {
      console.error('Login failed: email, and password are required.');
    }
  }
}
