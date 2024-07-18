import { Component } from '@angular/core';

import { AuthData } from '../wrapper.model';
import { WrapperComponent } from '../shared/wrapper/wrapper.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [WrapperComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  constructor(private router: Router) {}
  errorsMessages: string[] = [];

  onAuthorisation(data: AuthData): void {
    console.log(data);
    this.router.navigate(['/calendar']);
  }
}
