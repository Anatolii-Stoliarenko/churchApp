import { Component, inject } from '@angular/core';

import { WrapperComponent } from '../shared/wrapper/wrapper.component';
import { AuthUserModel } from '../auth.model';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [WrapperComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  errorsMessages: string[] = [];
  authService = inject(AuthService);

  login(data: AuthUserModel): void {
    this.authService.login(data);
  }
}
