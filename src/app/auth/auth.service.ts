import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
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

  private utils = inject(UtilsService);

  private loggedInUserSubject = new BehaviorSubject<AuthUserModel | null>(null);
  loggedInUser$ = this.loggedInUserSubject.asObservable();

  constructor() {
    this.loadUsersFromLocalStorage();
    this.loadLoggedInUserFromLocalStorage();
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

  //Load all users from LocalStorage
  loadUsersFromLocalStorage() {
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
      this.users = JSON.parse(savedUsers);
    }
  }

  private saveUsers(): void {
    localStorage.setItem('users', JSON.stringify(this.users));
  }

  logout(): void {
    this.loggedInUserSubject.next(null);
    this.clearLoggedInUserFromLocalStorage();
  }

  register(
    name: string,
    email: string,
    password: string
  ): AuthUserModel | null {
    if (this.users.find((user) => user.email === email)) {
      window.alert('User with this email already exists.');
      return null;
    }
    // const hashedPassword = bcrypt.hashSync(password, 10); // Hash the password
    const newUser: AuthUserModel = {
      id: this.utils.generateId(),
      name,
      email,
      password, //:hashedPassword
    };

    this.users.push(newUser);
    this.saveUsers();
    this.saveLoggedInUserToLocalStorage(newUser);
    return newUser;
  }

  login(email: string, password: string): AuthUserModel | null {
    const user = this.findUserByEmailAndPassword(email, password);
    if (user) {
      this.loggedInUserSubject.next(user);
      this.saveLoggedInUserToLocalStorage(user); // Save logged-in user to localStorage
      return user;
    } else {
      return null;
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
