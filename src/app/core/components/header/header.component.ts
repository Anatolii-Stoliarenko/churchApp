import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AuthService } from '../../../auth/services/auth.service';
import { CurrentUserInterface } from '../../../auth/models/auth.model';
import { AppState } from '../../../shared/store/appState.interface';
import { currentUserSelector } from '../../../auth/store/auth.selectors';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [MatButtonModule, CommonModule],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
})
export class HeaderComponent {
    authService = inject(AuthService);
    router = inject(Router);
    currentUser$: Observable<CurrentUserInterface | null>;

    constructor(private store: Store<AppState>) {
        this.currentUser$ = this.store.select(currentUserSelector);
    }

    logout(): void {
        this.authService.logout();
    }

    login(): void {
        this.router.navigate(['/login']);
    }
    register(): void {
        this.router.navigate(['/register']);
    }
}
