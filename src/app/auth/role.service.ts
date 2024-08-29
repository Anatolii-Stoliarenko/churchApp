// import { inject, Injectable } from '@angular/core';
// import { BehaviorSubject, Subscription } from 'rxjs';

// import { AuthService } from './auth.service';
// import { UserRole } from './auth.model';

// @Injectable({
//   providedIn: 'root',
// })
// export class RoleService {
//   private currentUserRoleSubject = new BehaviorSubject<UserRole | null>(null);
//   currentUserRole$ = this.currentUserRoleSubject.asObservable();
//   private userSubscription: Subscription | undefined;

//   authService = inject(AuthService);

//   constructor() {
//     this.setUserRole();
//   }

//   private setUserRole(): void {
//     this.userSubscription = this.authService.currentUser$.subscribe((user) => {
//       if (user && user.role) {
//         this.currentUserRoleSubject.next(user.role as UserRole);
//       } else {
//         this.currentUserRoleSubject.next(null); // Or a default role if needed
//       }
//     });
//   }

//   ngOnDestroy(): void {
//     if (this.userSubscription) {
//       this.userSubscription.unsubscribe();
//     }
//   }
// }
