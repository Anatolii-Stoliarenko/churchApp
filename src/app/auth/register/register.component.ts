import { Component, inject } from '@angular/core';

import { WrapperComponent } from '../wrapper/wrapper.component';
import { AuthService } from '../auth.service';
import { User } from '../auth.model';

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

  register(data: User): void {
    this.authService.register(data);
  }
}
