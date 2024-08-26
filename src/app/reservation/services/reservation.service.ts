import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

import { UtilsService } from './utils.service';
import { DataService } from './data.service';
import { AuthService } from '../../auth/auth.service';
import {
  PlaceType,
  ReservationModel,
  ReservationStatus,
  TimeSlot,
  UserModel,
} from '../reservation.model';
import { SharedService } from './shared.service';
import { ApiService } from '../../services/api.service';
import { RoleService } from '../../auth/role.service';
import { UserRole } from '../../auth/auth.model';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private reservationsSubject = new BehaviorSubject<ReservationModel[]>([]);
  reservations$: Observable<ReservationModel[]> =
    this.reservationsSubject.asObservable();

  utilsService = inject(UtilsService);
  sharedService = inject(SharedService);
  dataService = inject(DataService);
  authService = inject(AuthService);
  apiService = inject(ApiService);
  roleService = inject(RoleService);

  reservations: ReservationModel[] = [];

  Subscription: Subscription[] = [];

  currentUser: UserModel | null = null;
  localStorageKey = 'reservation';
  userRole: UserRole | null | undefined;

  constructor() {
    this.initValues();
    this.loadReservations();
  }

  ngOnDestroy(): void {
    this.Subscription.forEach((sub) => sub.unsubscribe());
  }

  private initValues(): void {
    this.Subscription.push(
      this.authService.currentUser$.subscribe((user) => {
        this.currentUser = user;
      })
    );

    this.Subscription.push(
      this.roleService.currentUserRole$.subscribe((role) => {
        this.userRole = role;
      })
    );
  }

  getReservationsLocaly(): ReservationModel[] {
    return this.reservations;
  }

  loadReservations(): void {
    this.apiService.getAllReservations().subscribe({
      next: (response) => {
        this.reservations = response;
        this.reservationsSubject.next(response);
        console.log(
          '%csuccessful download reservations from API',
          'color: green; font-weight: bold;'
        );
      },
      error: (error) => {
        console.error('Failed to load reservations', error);
        this.utilsService.snackBarError('Failed to load reservations');
      },
      complete: () => {
        this.sharedService.notifyReservationMade();
      },
    });
  }

  addReservations(reservation: Omit<ReservationModel, 'user' | 'id'>): void {
    const newReservation = this.createReservation(reservation);
    this.apiService.addNewReservation(newReservation).subscribe({
      next: (response) => {
        console.log(response.message);
        this.utilsService.snackBarSuccess(response.message);
      },
      error: (error) => {
        console.error('Failed to add reservation', error);
        this.utilsService.snackBarError('Failed to add reservation');
      },
      complete: () => {
        this.loadReservations();
      },
    });
  }

  updateReservation(id: string, data: any): void {
    this.apiService.updateReservation(id, data).subscribe({
      next: (response) => {
        console.log(response.message);
        this.utilsService.snackBarSuccess(response.message);
      },
      error: (error) => {
        console.error('Failed to update reservation', error);
        this.utilsService.snackBarError('Failed to update reservation');
      },
      complete: () => {
        this.loadReservations();
      },
    });
  }

  deleteReservation(id: string): void {
    this.apiService.deleteReservation(id).subscribe({
      next: (response) => {
        console.log(response.message);
        this.utilsService.snackBarSuccess(response.message);
      },
      error: (error) => {
        console.error('Failed to delete reservation', error);
        this.utilsService.snackBarError('Failed to delete reservation');
      },
      complete: () => {
        this.loadReservations();
      },
    });
  }

  private createReservation(
    reservation: Omit<ReservationModel, 'user' | 'id'>
  ): ReservationModel {
    return {
      ...reservation,
      id: this.utilsService.generateId(),
      user: this.currentUser!,
      status:
        this.userRole === UserRole.ADMIN
          ? ReservationStatus.APPROVED
          : ReservationStatus.PENDING,
    };
  }

  // Checking conflicts reservation
  hasConflict(newReservation: Omit<ReservationModel, 'user' | 'id'>): boolean {
    if (newReservation.startHour === newReservation.endHour) {
      return true; // If start and end times are the same, consider it a conflict
    }
    return this.reservations.some((existingReservation) => {
      return (
        existingReservation.date === newReservation.date &&
        existingReservation.place === newReservation.place &&
        this.timeRangesOverlap(
          existingReservation.startHour,
          existingReservation.endHour,
          newReservation.startHour,
          newReservation.endHour
        ) &&
        this.dataService.availableTimeSlots.indexOf(
          newReservation.startHour as TimeSlot
        ) <=
          this.dataService.availableTimeSlots.indexOf(
            newReservation.endHour as TimeSlot
          )
      );
    });
  }

  private timeRangesOverlap(
    start1: string,
    end1: string,
    start2: string,
    end2: string
  ): boolean {
    return (
      (start1 <= start2 && end1 > start2) || // Case 1: New start within existing range
      (start2 <= start1 && end2 > start1) // Case 2: Existing start within new range
    );
  }

  getHours(
    date: string,
    place?: PlaceType,
    user?: UserModel,
    type: 'reserved' | 'available' = 'available'
  ): string[] {
    return type === 'reserved'
      ? this.getReservedHours(date, place, user)
      : this.getAvailableHours(date, place, user);
  }

  private getAvailableHours(
    date: string,
    place?: PlaceType,
    user?: UserModel
  ): string[] {
    const reservedHours = this.getReservedHours(date, place, user);
    return this.dataService.availableHours.filter(
      (hour) => !reservedHours.includes(hour)
    );
  }

  getReservedHours(
    date: string,
    place?: PlaceType,
    user?: UserModel
  ): string[] {
    return this.reservations
      .filter(
        (reservation) =>
          reservation.date === date &&
          reservation.place === place &&
          (!user || reservation.user.id === user.id)
      )
      .flatMap((reservation) => {
        const startIndex = this.dataService.availableHours.indexOf(
          reservation.startHour as TimeSlot
        );
        const endIndex = this.dataService.availableHours.indexOf(
          reservation.endHour as TimeSlot
        );

        if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
          return this.dataService.availableHours.slice(startIndex, endIndex);
        }

        return [];
      });
  }

  getAllReservationsBySelectedDay(selectedDay: string): ReservationModel[] {
    return this.reservations.filter((res) => res.date === selectedDay);
  }

  getAllTemplateHour() {
    return this.dataService.availableHours;
  }
}
