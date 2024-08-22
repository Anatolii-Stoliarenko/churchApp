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
import { RoleService } from '../../auth/role.service';
import { SharedService } from './shared.service';
import { ApiService } from '../../services/api.service';

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
  roleService = inject(RoleService);
  apiService = inject(ApiService);

  reservations: ReservationModel[] = [];

  private currentUserSubscription: Subscription | undefined;

  currentUser: UserModel | null = null;
  localStorageKey = 'reservation';

  constructor() {
    this.loadAllReservationsFromAPI();
    this.loadCurrentUser();
  }

  // Load reservations from  API
  loadAllReservationsFromAPI(): void {
    this.apiService.loadAllReservations().subscribe((reservations) => {
      if (reservations) {
        this.reservationsSubject.next(reservations);
        this.reservations = reservations;
        console.log('successful download of reservations from the API');
        this.sharedService.notifyReservationMade();
        this.reservationsSubject.next(reservations);
      }
    });
  }

  // Save reservations to the API
  saveReservationsToAPI(): void {
    this.apiService.saveReservations(this.reservations).subscribe({
      next: (reservations) => {
        if (reservations && Array.isArray(reservations)) {
          this.reservations = reservations;
          console.log('Reservations saved successfully');
          this.reservationsSubject.next(reservations);
        }
      },
      error: (error) => {
        console.error('Failed to save reservations', error);
      },
      complete: () => {
        this.sharedService.notifyReservationMade();
        console.log('Reservation save process complete');
      },
    });
  }

  // Add reservation to the API
  addReservationsToAPI(newReservatio: ReservationModel): void {
    this.apiService.addReservation(newReservatio).subscribe({
      next: (reservations) => {
        if (reservations && Array.isArray(reservations)) {
          this.reservations = reservations;
          console.log('Reservation added successfully');
          this.reservationsSubject.next(reservations);
        }
      },
      error: (error) => {
        console.error('Failed to add reservations', error);
      },
      complete: () => {
        this.sharedService.notifyReservationMade();
        console.log('Reservation adding process complete');
      },
    });
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
    return this.reservations;
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
    this.reservations = [...this.reservations, reservation];
    this.saveReservationsToAPI();
  }

  updateReservation(updatedReservation: ReservationModel): void {
    const found = this.reservations.some(
      (reservation) => reservation.id === updatedReservation.id
    );

    if (found) {
      this.reservations = this.reservations.map((reservation) =>
        reservation.id === updatedReservation.id
          ? updatedReservation
          : reservation
      );
      this.saveReservationsToAPI();
      this.utilsService.snackBarSuccess('Reservation updated successfully!');
    } else {
      this.utilsService.snackBarError('Failed to update reservation!');
    }
  }

  deleteReservation(delitedReservation: ReservationModel): void {
    const initialLength = this.reservations.length;

    this.reservations = this.reservations.filter(
      (reservation) => reservation.id !== delitedReservation.id
    );
    if (this.reservations.length < initialLength) {
      // this.saveReservationsInLocallStorage();
      this.saveReservationsToAPI();
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
    const index = this.reservations.findIndex(
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
      this.reservations[index].status = newStatus;
      // this.saveReservationsInLocallStorage();
      this.saveReservationsToAPI();
      this.utilsService.snackBarSuccess(
        'Reservation status saved successfully!'
      );
    } else {
      this.utilsService.snackBarError('Failed to update reservation status.');
    }
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
    return this.reservations.filter((res) => res.date === selectedDay);
  }

  getAllTemplateHour() {
    return this.dataService.availableHours;
  }

  private loadAllReservationsFromLocallStorage(): void {
    const data = localStorage.getItem(this.localStorageKey);
    if (data) {
      this.reservations = JSON.parse(data);
    }
    this.sharedService.notifyReservationMade();
  }

  private saveReservationsInLocallStorage(): void {
    localStorage.setItem(
      this.localStorageKey,
      JSON.stringify(this.reservations)
    );
    this.sharedService.notifyReservationMade();
  }
}
