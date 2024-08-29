import { Component, inject } from '@angular/core';

import { WrapperComponent } from '../wrapper/wrapper.component';
import { User } from '../auth.model';
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

  login(data: User): void {
    this.authService.login(data);
  }
}
