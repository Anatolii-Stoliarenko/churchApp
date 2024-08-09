import { Component, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { AuthUserModel } from '../auth.model';
import { WrapperComponent } from '../shared/wrapper/wrapper.component';
import { AuthService } from '../auth.service';
import { UtilsService } from '../../reservation/services/utils.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [WrapperComponent, MatSnackBarModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  authService = inject(AuthService);
  utilsService = inject(UtilsService);
  snackBar = inject(MatSnackBar);
  router = inject(Router);

  constructor() {}
  errorsMessages: string[] = [];

  register(data: AuthUserModel): void {
    const newUser = this.authService.register(
      data.name,
      data.email,
      data.password
    );

    if (newUser) {
      this.utilsService.showSnackBar(
        'Registration successful!',
        'success-snackbar'
      );
      this.router.navigate(['/reservation']);
    } else {
      this.utilsService.showSnackBar(
        'Registration failed. Email already exists.',
        'error-snackbar'
      );
      this.router.navigate(['/login']);
    }
  }
}
