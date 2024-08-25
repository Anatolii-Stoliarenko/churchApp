import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
// import * as bcrypt from 'bcryptjs';

import { UtilsService } from '../reservation/services/utils.service';
import { AuthUserModel, UserRole } from './auth.model';
import { DefaultUsers } from '../config/default-users';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<AuthUserModel | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  utilsService = inject(UtilsService);
  router = inject(Router);

  private users: AuthUserModel[] = DefaultUsers;

  constructor() {
    this.loadUsersFromLocalStorage();
    this.getLoggedInUserFromAsObservable();
  }

  register(data: AuthUserModel): void {
    if (this.isEmailTaken(data.email)) {
      this.utilsService.snackBarError(
        'Registration failed. Email already exists.'
      );
      return;
    }

    const newUser = this.createNewUser(data);

    this.saveUser(newUser);
    this.saveLoggedInUserToLocalStorage(newUser);
    this.utilsService.snackBarSuccess('Registration successful!');
    this.router.navigate(['/reservation']);
  }

  login(data: Omit<AuthUserModel, 'name'>): void {
    const user = this.findUserByEmailAndPassword(data.email, data.password);
    if (!user) {
      this.utilsService.snackBarError(
        'Login failed. Invalid email or password.'
      );
      return;
    }
    this.saveLoggedInUserToLocalStorage(user);
    this.utilsService.snackBarSuccess('Login successful!');
    this.router.navigate(['/reservation']);
  }

  logout(): void {
    this.clearLoggedInUserFromLocalStorage();
  }

  private saveUsersToLocallStorage(): void {
    localStorage.setItem('users', JSON.stringify(this.users));
  }

  private createNewUser(data: AuthUserModel): AuthUserModel {
    const newUser: AuthUserModel = {
      id: this.utilsService.generateId(),
      name: data.name,
      email: data.email,
      password: data.password, //:hashedPassword
      role: UserRole.USER,
    };

    return newUser;
  }

  private saveUser(newUser: AuthUserModel): void {
    this.users.push(newUser);
    this.saveLoggedInUserToLocalStorage(newUser);
  }

  private isEmailTaken(email: string): boolean {
    return this.users.some((user) => user.email === email);
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

  private loadUsersFromLocalStorage() {
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
      let storedUsers = JSON.parse(savedUsers);
      if (Array.isArray(storedUsers)) {
        this.users.push(...storedUsers);
      }
    }
  }

  private clearLoggedInUserFromLocalStorage(): void {
    localStorage.removeItem('loggedInUser');
    this.currentUserSubject.next(null);
  }

  private saveLoggedInUserToLocalStorage(user: AuthUserModel): void {
    localStorage.setItem('loggedInUser', JSON.stringify(user));
    this.getLoggedInUserFromAsObservable();
  }

  private getLoggedInUserFromAsObservable(): void {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
      const user = JSON.parse(loggedInUser) as AuthUserModel;
      this.currentUserSubject.next(user);
    }
  }

  isLoggedIn(): boolean {
    const loggedInUser = localStorage.getItem('loggedInUser');
    return !!loggedInUser; // Return true if user is logged in, false otherwise
  }
}
