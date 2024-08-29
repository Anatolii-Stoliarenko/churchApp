import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

import { UtilsService } from '../reservation/services/utils.service';
import { User } from './auth.model';
import { ApiService } from '../services/api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  utilsService = inject(UtilsService);
  api = inject(ApiService);
  router = inject(Router);

  constructor() {
    this.loadCurrentUseFromLocalStorage();
  }

  loadCurrentUseFromLocalStorage(): void {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  isLoggedIn(): boolean {
    const loggedInUser = localStorage.getItem('currentUser');
    return !!loggedInUser; // Return true if user is logged in, false otherwise
  }

  // Method to update the current user
  setCurrentUser(user: User): void {
    this.currentUserSubject.next(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  logout(): void {
    const currentUser = this.currentUserSubject.getValue();
    this.utilsService.greenConsole(
      `${currentUser ? currentUser.name : ''} successfully logged out`
    );

    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
  }

  login(data: User): void {
    const user: User = {
      email: data.email,
      password: data.password,
    };
    this.api.login(user).subscribe({
      next: (response) => {
        this.setCurrentUser(response.user);
        this.utilsService.greenConsole(
          response.user.name + ' successfully logged'
        );
        this.utilsService.snackBarSuccess(`${response.message}`);
      },
      error: (error) => {
        console.error('Failed to login', error);
        this.utilsService.snackBarError('Failed to login');
      },
      complete: () => {
        this.router.navigate(['/reservation']);
      },
    });
  }

  register(data: User): void {
    const user: User = {
      name: data.name,
      email: data.email,
      password: data.password,
    };
    this.api.register(user).subscribe({
      next: (response) => {
        this.utilsService.snackBarSuccess(`${response.message}`);
        this.utilsService.greenConsole(`${user.name} successfully registered`);
      },
      error: (error) => {
        console.error('Failed to register', error);
        this.utilsService.snackBarError('Failed to register');
      },
      complete: () => {
        this.router.navigate(['/login']);
      },
    });
  }
}
