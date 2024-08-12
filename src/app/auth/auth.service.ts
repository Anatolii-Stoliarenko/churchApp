import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
// import * as bcrypt from 'bcryptjs';

import { UtilsService } from '../reservation/services/utils.service';
import { AuthUserModel } from './auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private users: AuthUserModel[] = [
    { id: '1', name: 'admin', email: 'admin@gmail.com', password: '12345678' },
  ];

  private utilsService = inject(UtilsService);
  router = inject(Router);

  private loggedInUserSubject = new BehaviorSubject<AuthUserModel | null>(null);
  loggedInUser$ = this.loggedInUserSubject.asObservable();

  constructor() {
    this.loadUsersFromLocalStorage();
    this.loadLoggedInUserFromLocalStorage();
  }

  //Load all users from LocalStorage
  loadUsersFromLocalStorage() {
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
      let storedUsers = JSON.parse(savedUsers);
      if (Array.isArray(storedUsers)) {
        this.users.push(...storedUsers);
      }
    }
  }

  private saveUsers(): void {
    localStorage.setItem('users', JSON.stringify(this.users));
  }

  isAdmin(): boolean {
    return true;
  }

  isLoggedIn(): boolean {
    const loggedInUser = localStorage.getItem('loggedInUser');
    return !!loggedInUser; // Return true if user is logged in, false otherwise
  }

  //Set user as asObservable
  loadLoggedInUserFromLocalStorage(): void {
    const loggedInUserJson = localStorage.getItem('loggedInUser');
    if (loggedInUserJson) {
      const user = JSON.parse(loggedInUserJson) as AuthUserModel;
      this.loggedInUserSubject.next(user);
    }
  }

  logout(): void {
    this.loggedInUserSubject.next(null);
    this.clearLoggedInUserFromLocalStorage();
  }

  register(data: AuthUserModel): void {
    if (this.users.find((user) => user.email === data.email)) {
      this.utilsService.showSnackBar(
        'Registration failed. Email already exists.',
        'error-snackbar'
      );
      this.router.navigate(['/login']);
      return;
    }
    const newUser: AuthUserModel = {
      id: this.utilsService.generateId(),
      name: data.name,
      email: data.email,
      password: data.password, //:hashedPassword
    };

    this.users.push(newUser);
    this.saveUsers();
    this.saveLoggedInUserToLocalStorage(newUser);
    this.utilsService.showSnackBar(
      'Registration successful!',
      'success-snackbar'
    );
    this.router.navigate(['/reservation']);
  }

  login(data: Omit<AuthUserModel, 'name'>): void {
    const user = this.findUserByEmailAndPassword(data.email, data.password);
    if (user) {
      this.loggedInUserSubject.next(user);
      this.saveLoggedInUserToLocalStorage(user); // Save logged-in user to localStorage
      this.utilsService.showSnackBar('Login successful!', 'custom-snackbar');
      this.router.navigate(['/reservation']);
    } else {
      this.utilsService.showSnackBar(
        'Login failed. Invalid email or password.',
        'error-snackbar'
      );
    }
  }

  private findUserByEmailAndPassword(
    email: string,
    password: string
  ): AuthUserModel | null {
    return (
      this.users.find(
        (user) => user.email === email && user.password === password
      ) || null
    );
  }

  private clearLoggedInUserFromLocalStorage(): void {
    localStorage.removeItem('loggedInUser');
  }

  private saveLoggedInUserToLocalStorage(user: AuthUserModel): void {
    localStorage.setItem('loggedInUser', JSON.stringify(user));
  }
}
