import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { WrapperComponent } from '../shared/wrapper/wrapper.component';
import { AuthUserModel } from '../auth.model';
import { AuthService } from '../auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UtilsService } from '../../reservation/services/utils.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [WrapperComponent, MatSnackBarModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  errorsMessages: string[] = [];
  utilsService = inject(UtilsService);
  authService = inject(AuthService);
  snackBar = inject(MatSnackBar);
  router = inject(Router);

  constructor() {}

  login(data: AuthUserModel): void {
    const user = this.authService.login(data.email, data.password);
    if (user) {
      this.utilsService.showSnackBar('Login successful!', 'custom-snackbar');
      this.router.navigate(['/reservation']);
    } else {
      this.utilsService.showSnackBar(
        'Login failed. Invalid email or password.',
        'error-snackbar'
      );
    }
  }
}
