import { Injectable, inject } from '@angular/core';

import { UtilsService } from './utils.service';
import { DataService } from './data.service';
import { AuthService } from '../../auth/auth.service';
import { PlaceType, ReservationModel, UserModel } from '../reservation.model';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  utilsService = inject(UtilsService);
  dataService = inject(DataService);
  authService = inject(AuthService);

  currentUser: UserModel | null = null;
  localStorageKey = 'reservation';

  constructor() {
    this.loadAllReservationsFromLocallStorage();
    this.loadCurrentUser();
  }

  loadCurrentUser() {
    this.authService.loggedInUser$.subscribe((user) => {
      this.currentUser = user;
    });
  }

  private loadAllReservationsFromLocallStorage() {
    const data = localStorage.getItem(this.localStorageKey);
    if (data) {
      this.dataService.reservations = JSON.parse(data);
    }
  }
  private saveReservationsInLocallStorage() {
    localStorage.setItem(
      this.localStorageKey,
      JSON.stringify(this.dataService.reservations)
    );
  }

  //cheking conflicts reservation
  hasConflict(newReservation: Omit<ReservationModel, 'user' | 'id'>): boolean {
    if (newReservation.startHour === newReservation.endHour) {
      return true; // If start and end times are the same, consider it a conflict
    }
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

  addReservation(reservation: Omit<ReservationModel, 'user' | 'id'>) {
    if (this.currentUser) {
      const newReservation: ReservationModel = {
        ...reservation,
        id: this.utilsService.generateId(),
        user: this.currentUser,
      };
      this.dataService.reservations.push(newReservation);
      this.saveReservationsInLocallStorage();
      this.utilsService.showSnackBar(
        'Reservation saved successfully!',
        'custom-snackbar'
      );
    } else {
      this.utilsService.showSnackBar(
        'Reservation faild. Cannot create reservation.',
        'error-snackbar'
      );
      console.error('Reservation faild. Cannot create reservation.');
    }
  }

  // Method to update an existing reservation
  updateReservation(updatedReservation: ReservationModel): void {
    const index = this.dataService.reservations.findIndex(
      (res) => res.id === updatedReservation.id
    );

    if (index !== -1) {
      this.dataService.reservations[index] = updatedReservation;
      this.saveReservationsInLocallStorage();
    } else {
      console.error(`Reservation with ID ${updatedReservation.id} not found.`);
    }
  } 

  deleteReservation(id: string): void {
    this.dataService.reservations = this.dataService.reservations.filter(
      (reservation) => reservation.id !== id
    );
    this.saveReservationsInLocallStorage(); // Save updated reservations list (if necessary)
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
}
