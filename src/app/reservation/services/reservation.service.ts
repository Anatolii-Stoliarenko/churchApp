import { Injectable, inject } from '@angular/core';

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
import { RoleService } from '../../auth/role.service';
import { Subscription } from 'rxjs';
import { SNACKBAR_CLASSES } from '../../config/snack-bar.config';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  utilsService = inject(UtilsService);
  sharedService = inject(SharedService);
  dataService = inject(DataService);
  authService = inject(AuthService);
  roleService = inject(RoleService);
  private currentUserSubscription: Subscription | undefined;

  currentUser: UserModel | null = null;
  localStorageKey = 'reservation';

  constructor() {
    this.loadAllReservationsFromLocallStorage();
    this.loadCurrentUser();
  }

  ngOnDestroy(): void {
    this.currentUserSubscription?.unsubscribe();
  }

  private loadCurrentUser(): void {
    this.currentUserSubscription = this.authService.currentUser$.subscribe(
      (user) => {
        this.currentUser = user;
      }
    );
  }

  getReservations(): ReservationModel[] {
    return this.dataService.reservations;
  }

  addReservation(reservation: Omit<ReservationModel, 'user' | 'id'>): void {
    if (!this.currentUser) {
      this.utilsService.snackBarError(
        'Reservation failed. Cannot create reservation.'
      );
      return;
    }
    const newReservation = this.createReservation(reservation);
    this.saveNewReservation(newReservation);
    this.utilsService.snackBarSuccess('Reservation saved successfully!');
  }

  private createReservation(
    reservation: Omit<ReservationModel, 'user' | 'id'>
  ): ReservationModel {
    return {
      ...reservation,
      id: this.utilsService.generateId(),
      user: this.currentUser!,
      status: ReservationStatus.PENDING,
    };
  }

  private saveNewReservation(reservation: ReservationModel): void {
    this.dataService.reservations = [
      ...this.dataService.reservations,
      reservation,
    ];
    this.saveReservationsInLocallStorage();
  }

  updateReservation(updatedReservation: ReservationModel): void {
    const found = this.dataService.reservations.some(
      (reservation) => reservation.id === updatedReservation.id
    );

    if (found) {
      this.dataService.reservations = this.dataService.reservations.map(
        (reservation) =>
          reservation.id === updatedReservation.id
            ? updatedReservation
            : reservation
      );
      this.saveReservationsInLocallStorage();
      this.utilsService.snackBarSuccess('Reservation updated successfully!');
    } else {
      this.utilsService.snackBarError('Failed to update reservation!');
    }
  }

  deleteReservation(delitedReservation: ReservationModel): void {
    const initialLength = this.dataService.reservations.length;

    this.dataService.reservations = this.dataService.reservations.filter(
      (reservation) => reservation.id !== delitedReservation.id
    );
    if (this.dataService.reservations.length < initialLength) {
      this.saveReservationsInLocallStorage();
      this.utilsService.snackBarSuccess('Reservation deleted successfully!');
    } else {
      this.utilsService.snackBarError('Failed to delete reservation!');
    }
  }

  // Changing reservation status
  setReservationStatus(
    reservation: ReservationModel,
    status: ReservationStatus
  ): void {
    this.updateReservationStatus(reservation, status);
  }

  private findIndexReservation(reservation: ReservationModel): number {
    const index = this.dataService.reservations.findIndex(
      (res) => res.id === reservation.id
    );

    if (index === -1) {
      console.error(`Reservation with ID ${reservation.id} not found`);
    }

    return index;
  }

  private updateReservationStatus(
    reservation: ReservationModel,
    newStatus: ReservationStatus
  ): void {
    const index = this.findIndexReservation(reservation);

    if (index !== -1) {
      this.dataService.reservations[index].status = newStatus;
      this.saveReservationsInLocallStorage();
      this.utilsService.snackBarSuccess(
        'Reservation status saved successfully!'
      );
    } else {
      this.utilsService.snackBarError('Failed to update reservation status.');
    }
  }

  private loadAllReservationsFromLocallStorage(): void {
    const data = localStorage.getItem(this.localStorageKey);
    if (data) {
      this.dataService.reservations = JSON.parse(data);
    }
  }

  private saveReservationsInLocallStorage(): void {
    localStorage.setItem(
      this.localStorageKey,
      JSON.stringify(this.dataService.reservations)
    );
    this.sharedService.notifyReservationMade();
  }

  // Checking conflicts reservation
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

  private getReservedHours(
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

  getAllReservationsBySelectedDay(selectedDay: string): ReservationModel[] {
    return this.dataService.reservations.filter(
      (res) => res.date === selectedDay
    );
  }
}
