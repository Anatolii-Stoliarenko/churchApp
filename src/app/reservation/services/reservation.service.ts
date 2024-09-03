import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { UtilsService } from '../../shared/services/utils.service';
import { DataService } from './data.service';
import { AuthService } from '../../auth/services/auth.service';
import {
  ApiResponse,
  CreateReservationModel,
  PlaceType,
  ReservationModel,
  ReservationStatus,
  ResponseReservationModel,
  TimeSlot,
  updateReservationInterface,
  UserModel,
} from '../models/reservations.model';
import { ApiService } from '../../shared/services/api.service';
import { UserInterface, UserRole } from '../../auth/models/auth.model';
import { AppState } from '../../shared/store/appState.interface';
import { currentUserSelector } from '../../auth/store/selectors/auth.selectors';
import {
  reservationsSelector,
  selectedDaySelector,
} from '../store/reservations.selectors';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  // private reservationsSubject = new BehaviorSubject<ReservationModel[]>([]);
  // reservations$: Observable<ReservationModel[]> =
  // this.reservationsSubject.asObservable();

  utilsService = inject(UtilsService);
  dataService = inject(DataService);
  authService = inject(AuthService);
  apiService = inject(ApiService);
  store = inject(Store<AppState>);

  selectedDay: string | null | undefined;
  Subscription: Subscription[] = [];
  currentUser: UserInterface | null = null;
  reservations: ReservationModel[] = [];

  constructor() {
    this.initValues();
  }

  ngOnDestroy(): void {
    this.Subscription.forEach((sub) => sub.unsubscribe());
  }

  initValues(): void {
    this.Subscription.push(
      this.store.select(currentUserSelector).subscribe((user) => {
        this.currentUser = user;
      }),

      this.store.select(selectedDaySelector).subscribe((day) => {
        this.selectedDay = day;
      }),

      this.store.select(reservationsSelector).subscribe((reservation) => {
        this.reservations = reservation ? reservation : [];
      })
    );
  }

  isSelectedDayTodayOrFuture(): boolean {
    let selectedDate = new Date(this.selectedDay ?? '');
    const today = new Date();
    // Set time to 00:00:00 to compare only the dates, not the time
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    // Return true if selectedDate is today or in the future
    return selectedDate >= today;
  }

  getReservationsLocaly(): ReservationModel[] {
    return this.reservations;
  }

  getReservations(): Observable<ResponseReservationModel> {
    return this.apiService.getAllReservations();
  }

  addReservation(reservation: CreateReservationModel): Observable<ApiResponse> {
    return this.apiService.addNewReservation(reservation);
  }

  updateReservation(
    id: string,
    payload: updateReservationInterface
  ): Observable<ApiResponse> {
    return this.apiService.updateReservation(id, payload);
  }

  deleteReservationStore(id: string): Observable<ApiResponse> {
    return this.apiService.deleteReservation(id);
  }

  private createReservation(
    reservation: Omit<ReservationModel, 'user' | 'id'>
  ): CreateReservationModel {
    return {
      ...reservation,
      user: this.currentUser!,
      status:
        this.currentUser?.role === UserRole.ADMIN
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
