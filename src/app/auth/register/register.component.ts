import { Component } from '@angular/core';

import { AuthData } from '../shared/wrapper.model';
import { WrapperComponent } from '../shared/wrapper/wrapper.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [WrapperComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  errorsMessages: string[] = [];

  onAuthorisation(data: AuthData): void {
    console.log(data);
  }
}
