import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

import { UtilsService } from './utils.service';
import { DataService } from './data.service';
import { PlaceType, ReservationModel, UserModel } from '../reservation.model';
import { AuthService } from '../../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  utilsService = inject(UtilsService);
  dataService = inject(DataService);
  authService = inject(AuthService);
  router = inject(Router);
  currentUser: UserModel | null = null;
  localStorageKey = 'reservation';

  constructor() {
    this.loadReservations();
    this.authService.loggedInUser$.subscribe((user) => {
      this.currentUser = user;
    });
  }

  private saveReservations() {
    localStorage.setItem(
      this.localStorageKey,
      JSON.stringify(this.dataService.reservations)
    );
  }

  private loadReservations() {
    const data = localStorage.getItem(this.localStorageKey);
    if (data) {
      this.dataService.reservations = JSON.parse(data);
    }
  }
  //cheking conflicts reservation
  hasConflict(newReservation: Omit<ReservationModel, 'user'>): boolean {
    return this.dataService.reservations.some((existingReservation) => {
      return (
        existingReservation.date === newReservation.date &&
        existingReservation.place === newReservation.place &&
        this.timeRangesOverlap(
          existingReservation.startHour,
          existingReservation.endHour,
          newReservation.startHour,
          newReservation.endHour
        )
      );
    });
  }

  //cheking conflicts reservation
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

  addReservation(reservation: Omit<ReservationModel, 'user'>) {
    if (this.currentUser) {
      const newReservation: ReservationModel = {
        ...reservation,
        user: this.currentUser, // Use currentUser for the reservation
      };
      this.dataService.reservations.push(newReservation);
      this.saveReservations();
      this.utilsService.showSnackBar(
        'Reservation saved successfully!',
        'custom-snackbar'
      );
    } else {
      this.utilsService.showSnackBar(
        'No user is logged in. Cannot create reservation.',
        'error-snackbar'
      );
      console.error('No user is logged in. Cannot create reservation.');
      this.router.navigate(['/login']);
    }
  }

  deleteReservation(id: string): void {
    this.dataService.reservations = this.dataService.reservations.filter(
      (reservation) => reservation.id !== id
    );
    this.saveReservations(); // Save updated reservations list (if necessary)
  }

  getReservation() {
    return this.dataService.reservations;
  }

  getfullDayHours(reservation: ReservationModel): boolean {
    // const fullDayHours = this.dataService.availableHours;
    // return fullDayHours.every((hour) => reservation.hours.includes(hour));
    return false;
  }

  getHours(
    date: string,
    place?: PlaceType,
    user?: UserModel,
    type: 'reserved' | 'available' = 'available'
  ): string[] {
    if (type === 'reserved') {
      return this.getReservedHours(date, place, user);
    } else {
      return this.getAvailableHours(date, place, user);
    }
  }

  getReservedHours(
    date: string,
    place?: PlaceType,
    user?: UserModel
  ): string[] {
    return this.dataService.reservations
      .filter(
        (reservation) =>
          reservation.date === date &&
          reservation.place === place &&
          (!user || reservation.user.id === user.id)
      )
      .flatMap((reservation) =>
        this.utilsService.getTimeRangeArray(
          reservation.startHour,
          reservation.endHour
        )
      );
  }

  getAvailableHours(
    date: string,
    place?: PlaceType,
    user?: UserModel
  ): string[] {
    const reservedHours = this.getReservedHours(date, place, user);
    return this.dataService.availableHours.filter(
      (hour) => !reservedHours.includes(hour)
    );
  }

  getAllHoursBySelectedDay(selectedDay: string): ReservationModel[] {
    return this.dataService.reservations.filter((res) => {
      return res.date === selectedDay;
    });
  }

  getAvailableHoursOld(date: string): string[] {
    return this.getHouresOld(date, true);
  }

  getReservedHoursOld(date: string): string[] {
    return this.getHouresOld(date, false);
  }

  getHouresOld(date: string, isAvailableHours: boolean): string[] {
    const reservedHours = this.dataService.reservations
      .filter((res) => res.date === date)
      .map((res) =>
        this.utilsService.getTimeRangeArray(res.startHour, res.endHour)
      )
      .flat();

    const allHours = this.dataService.availableHours;

    return allHours.filter((hour) =>
      isAvailableHours
        ? !reservedHours.includes(hour)
        : reservedHours.includes(hour)
    );
  }
}
