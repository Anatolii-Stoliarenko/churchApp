import { Component } from '@angular/core';

import { WrapperComponent } from '../shared/wrapper/wrapper.component';
import { AuthData } from '../shared/wrapper.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [WrapperComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  errorsMessages: string[] = [];

  onAuthorisation(data: AuthData): void {
    console.log(data);
  }
}
