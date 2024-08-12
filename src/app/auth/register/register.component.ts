import { Component, inject } from '@angular/core';

import { AuthUserModel } from '../auth.model';
import { WrapperComponent } from '../shared/wrapper/wrapper.component';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [WrapperComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  authService = inject(AuthService);
  errorsMessages: string[] = [];

  register(data: AuthUserModel): void {
    this.authService.register(data);
  }
}
