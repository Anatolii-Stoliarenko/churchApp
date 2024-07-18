import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { WrapperComponent } from '../shared/wrapper/wrapper.component';
import { AuthData } from '../wrapper.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [WrapperComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  errorsMessages: string[] = [];

  constructor(private router: Router) {}

  onAuthorisation(data: AuthData): void {
    console.log('data from login', data);
    this.router.navigate(['/calendar']);
  }
}
