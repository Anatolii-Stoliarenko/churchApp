import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AuthService } from './auth/services/auth.service';
// import { ThemeService } from './core/services/theme.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
    private readonly _authService = inject(AuthService);
    // private readonly _themeService = inject(ThemeService);

    ngOnInit(): void {
        this._authService.restoreUser();
    }
}
