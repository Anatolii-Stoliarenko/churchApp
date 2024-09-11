import { Injectable, inject } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { UtilsService } from '../../shared/services/utils.service';
import { DataService } from './data.service';
import { AuthService } from '../../auth/services/auth.service';
import {
  ApiResponse,
  BookingModel,
  ConfirmDialogDetailModel,
  CreateReservationModel,
  DaysReservationModel,
  PlaceType,
  ReservationModel,
  ReservationStatus,
  ResponseReservationModel,
  TimeSlot,
  updateReservationInterface,
} from '../models/reservations.model';
import { ApiService } from '../../shared/services/api.service';
import { CurrentUserInterface } from '../../auth/models/auth.model';
import { AppState } from '../../shared/store/appState.interface';
import { currentUserSelector } from '../../auth/store/auth.selectors';
import {
  reservationsSelector,
  selectedDaySelector,
} from '../store/reservations.selectors';
import * as ReservationActions from '../store/reservations.actions';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  utilsService = inject(UtilsService);
  dataService = inject(DataService);
  authService = inject(AuthService);
  apiService = inject(ApiService);
  store = inject(Store<AppState>);

  selectedDay: string | null | undefined;
  Subscription: Subscription[] = [];
  currentUser: CurrentUserInterface | null = null; //UserInterface | null = null;
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

  // API
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

  //OTHER FUNCTIONSs
  addReservations(reservations: BookingModel) {
    const cheking = this.chekingPlaningReservations(reservations);
    cheking.length > 0
      ? this.handleConflictReservations(cheking)
      : this.dispatchReservartions(reservations);
  }

  dispatchReservartions(reservations: BookingModel): void {
    const repeatInterval = this.getWeekInterval(reservations?.repeat);
    const currentDate = new Date(reservations?.date ?? this.selectedDay!);

    for (let i = 0; i < repeatInterval; i++) {
      for (const place of reservations.places) {
        const newRes: CreateReservationModel = {
          ...reservations,
          place: place, // Use the current place
          date: currentDate.toISOString().split('T')[0], // YYYY-MM-DD format
          user: this.currentUser!,
          status: this.createStatus(),
        };

        try {
          this.store.dispatch(
            ReservationActions.addReservations({ reservation: newRes })
          );
        } catch (error) {
          this.utilsService.snackBarError('Reservation failed.');
          console.error('Reservation error:', error);
          break;
        }
      }
      currentDate.setDate(currentDate.getDate() + 7); //add 7 days aftre each interaction
    }
  }

  handleConflictReservations(data: BookingModel[]) {
    if (data.length > 0) {
      this.utilsService.snackBarError(`Conflict reservations: ${data.length}`);
      this.utilsService.greenConsole(`Conflict reservation with exist: `);
      console.log(data);
    }
  }

  private chekingPlaningReservations(data: BookingModel): BookingModel[] {
    const repeatInterval = this.getWeekInterval(data?.repeat);
    const currentDate = new Date(data?.date ?? this.selectedDay!);

    let conflictReservations: BookingModel[] = [];

    for (let i = 0; i < repeatInterval; i++) {
      for (const place of data.places) {
        const reserves = this.isConflict({
          ...data,
          date: currentDate.toISOString().split('T')[0],
          place: place,
          user: this.currentUser!,
        });
        if (reserves) {
          conflictReservations = [
            ...conflictReservations,
            {
              startHour: data.startHour,
              endHour: data.endHour,
              places: data.places,
              comments: data.comments,
              repeat: data.repeat,
              date: currentDate.toISOString().split('T')[0],
              type: data.type,
            },
          ];
        }
      }

      currentDate.setDate(currentDate.getDate() + 7); //add 7 days aftre each interaction
    }

    return conflictReservations;
  }

  isConflict(reservation: CreateReservationModel): boolean {
    if (reservation.startHour === reservation.endHour) {
      return true;
    }
    return this.reservations.some((existingRes) => {
      return (
        existingRes.date === reservation.date &&
        existingRes.place === reservation.place &&
        this.timeRangesOverlap(
          existingRes.startHour,
          existingRes.endHour,
          reservation.startHour,
          reservation.endHour
        ) &&
        this.getIndexOfPossibleHours(reservation.startHour) <=
          this.getIndexOfPossibleHours(reservation.endHour)
      );
    });
  }

  private getIndexOfPossibleHours(hour: string): number {
    return this.dataService.availableHours.indexOf(hour as TimeSlot);
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

  getAvailableHours(date: string, place?: PlaceType): string[] {
    const reservedHours = this.getReservedHours(date, place);
    return this.dataService.availableHours.filter(
      (hour) => !reservedHours.includes(hour)
    );
  }

  getReservedHours(date: string, place?: PlaceType): string[] {
    return this.reservations
      .filter(
        (reservation) =>
          reservation.date === date && reservation.place === place
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

  //for ConrirmDialog in booking component
  getDataForConfirmDialogBooking(data: BookingModel): ConfirmDialogDetailModel {
    return {
      status: this.createStatus(),
      user: this.currentUser!,
      repeat: data.repeat,

      places: data.places,
      date: data.date,
      startHour: data.startHour,
      endHour: data.endHour,
      comments: data.comments,
      type: data.type,
    };
  }

  getReservationsFromToDays(
    start: string,
    end: string
  ): DaysReservationModel[] {
    let reservations: DaysReservationModel[] = [];

    let currentDate = new Date(start);
    let endDate = new Date(end);

    while (currentDate <= endDate) {
      const formattedDate = currentDate.toISOString().split('T')[0]; // Format date to 'yyyy-MM-dd'

      const dailyReservations =
        this.getAllReservationsBySelectedDay(formattedDate);

      if (dailyReservations.length > 0) {
        reservations.push({
          date: formattedDate,
          reservations: dailyReservations,
        });
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return reservations;
  }

  getAllReservationsBySelectedDay(selectedDay: string): ReservationModel[] {
    return this.reservations.filter((res) => res.date === selectedDay);
  }

  getAllPossibleHours() {
    return this.dataService.availableHours;
  }

  isSelectedDayTodayOrFuture(day: string): boolean {
    // Set time to 00:00:00 to compare only the dates, not the time
    let selectedDate = new Date(day).setHours(0, 0, 0, 0);
    const today = new Date().setHours(0, 0, 0, 0);

    // Return true if selectedDate is today or in the future
    return selectedDate >= today;
  }

  private createStatus(): ReservationStatus {
    return this.currentUser?.role === 'admin'
      ? ReservationStatus.APPROVED
      : ReservationStatus.PENDING;
  }

  private getWeekInterval(repeat: string = ''): number {
    return parseInt(repeat.split(' ')[0], 10) || 1; // Default to 1 if no repeat interval is selected
  }
}
