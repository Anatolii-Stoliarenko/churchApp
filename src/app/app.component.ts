import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AuthService } from './auth/services/auth.service';
import { BottomComponent } from "./shared/components/footer/footer.component";
import { AdminComponent } from "./auth/components/admin/admin.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BottomComponent, AdminComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  authService = inject(AuthService);

  ngOnInit(): void {
    this.authService.restoreUser();
  }
}
