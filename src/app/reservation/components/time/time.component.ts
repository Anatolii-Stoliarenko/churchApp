import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Store } from '@ngrx/store';

import { ReservationService } from '../../services/reservation.service';
import {
  CreateReservationModel,
  PlaceType,
  ReservationModel,
  ReservationStatus,
} from '../../models/reservations.model';
import { UtilsService } from '../../../shared/services/utils.service';
import { AuthService } from '../../../auth/services/auth.service';
import { UserInterface, UserRole } from '../../../auth/models/auth.model';
import { ReservationDetailDialogComponent } from '../detail-dialog/detail-dialog.component';
import { AppState } from '../../../shared/store/appState.interface';
import { currentUserSelector } from '../../../auth/store/auth.selectors';
import {
  reservationsSelector,
  selectedDaySelector,
} from '../../store/reservations.selectors';
import * as ReservationActions from '../../store/reservations.actions';

@Component({
  selector: 'app-time',
  standalone: true,
  imports: [
    MatSelectModule,
    MatButtonModule,
    CommonModule,
    FormsModule,
    MatInputModule,
    MatCheckboxModule,
    MatFormFieldModule,
  ],
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.scss'],
})
export class TimeComponent implements OnInit, OnDestroy {
  reserveService = inject(ReservationService);
  authService = inject(AuthService);
  utilService = inject(UtilsService);
  store = inject(Store<AppState>);

  selectedPlaces: PlaceType[] = [];
  selectedDay = '';
  availableHours: string[] = [];
  allTemplateHours: string[] = this.reserveService.getAllTemplateHour();
  selectedStartTime: string = '';
  selectedEndTime: string = '';
  filteredToHours: string[] = [];
  places = Object.values(PlaceType);
  comment = '';
  weekOptions = Array.from(
    { length: 12 },
    (_, i) => `${i + 1} week${i + 1 > 1 ? 's' : ''}`
  );
  selectedWeek: string = '';

  currentUser: UserInterface | null = null;
  subscription: Subscription[] = [];
  dialog = inject(MatDialog);

  ngOnInit(): void {
    this.initValues();
  }

  ngOnDestroy(): void {
    this.subscription.forEach((subscription) => subscription.unsubscribe());
  }

  initValues(): void {
    this.subscription.push(
      this.store.select(selectedDaySelector).subscribe((selectedDay) => {
        this.selectedDay = selectedDay ? selectedDay : '';
        this.resetComponentState();
      }),

      this.store.select(reservationsSelector).subscribe(() => {
        this.resetComponentState();
      }),

      this.store.select(currentUserSelector).subscribe((user) => {
        this.currentUser = user;
        this.resetComponentState();
      })
    );

    this.updateAvailableHours();
  }
  private createStatus(): ReservationStatus {
    return this.currentUser?.role === UserRole.ADMIN
      ? ReservationStatus.APPROVED
      : ReservationStatus.PENDING;
  }

  openConfirmDialogDetails() {
    const confirmReservation = {
      ...this.createNewReservation(),
      status: this.createStatus(),
      user: this.currentUser,
      repeat: this.selectedWeek,
      caller: 'reserve',
      places: this.selectedPlaces,
    };
    const dialogRef = this.dialog.open(ReservationDetailDialogComponent, {
      width: '250px',
      data: confirmReservation,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.addReservation();
      }
    });
  }

  onStartTimeChange(): void {
    if (this.selectedStartTime) {
      const startTimeIndex = this.allTemplateHours.indexOf(
        this.selectedStartTime
      );

      this.filteredToHours = this.allTemplateHours.slice(startTimeIndex + 1);

      // Aggregate reserved hours for all selected places
      let reservedHours: string[] = [];
      this.selectedPlaces.forEach((place) => {
        const placeReservedHours = this.reserveService.getReservedHours(
          this.selectedDay,
          place
        );
        reservedHours = [...reservedHours, ...placeReservedHours];
      });

      reservedHours = [...new Set(reservedHours)]; // Remove duplicates, if necessary

      if (reservedHours.length > 0) {
        const nextReservedHourIndex = this.allTemplateHours.findIndex(
          (hour) =>
            reservedHours.includes(hour) &&
            this.allTemplateHours.indexOf(hour) > startTimeIndex
        );

        if (nextReservedHourIndex !== -1) {
          this.filteredToHours = this.filteredToHours.slice(
            0,
            nextReservedHourIndex - startTimeIndex
          );
        }
      }
    }
  }

  isHourAvailable(time: string): boolean {
    return this.availableHours.includes(time);
  }

  onPlaceChange() {
    this.updateAvailableHours();
    this.resetComponentState();
  }

  isConflictPlaningReservations(): boolean {
    const repeatInterval = this.getWeekInterval();
    let currentDate = new Date(this.selectedDay);

    const ReservationsWithConflict = [];

    for (let i = 0; i < repeatInterval; i++) {
      for (const place of this.selectedPlaces) {
        const newReservation: Omit<ReservationModel, 'user' | 'id'> = {
          ...this.createNewReservation(),
          place: place,
          date: currentDate.toISOString().split('T')[0], // YYYY-MM-DD format
        };

        if (!this.isReservationConflictFree(newReservation)) {
          ReservationsWithConflict.push(newReservation);
          const message = `Conflict reservations: ${ReservationsWithConflict.length}`;
          this.utilService.snackBarError(message);
          this.utilService.greenConsole(message);
          console.log(ReservationsWithConflict);
        }
      }

      currentDate.setDate(currentDate.getDate() + 7);
    }

    return ReservationsWithConflict.length > 0;
  }

  async addReservation(): Promise<void> {
    if (this.isConflictPlaningReservations()) {
      console.log('conflict planing reservations');
      return;
    }

    const repeatInterval = this.getWeekInterval();
    let currentDate = new Date(this.selectedDay);

    for (let i = 0; i < repeatInterval; i++) {
      for (const place of this.selectedPlaces) {
        const newReservation: Omit<ReservationModel, 'user' | 'id'> = {
          ...this.createNewReservation(),
          place: place, // Use the current place
          date: currentDate.toISOString().split('T')[0], // YYYY-MM-DD format
        };

        if (this.isReservationConflictFree(newReservation)) {
          try {
            await this.reservation(newReservation); // Wait for each reservation to complete
          } catch (error) {
            this.utilService.snackBarError('Reservation failed.');
            console.error('Reservation error:', error);
            break;
          }
        } else {
          this.handleReservationConflict();
          break;
        }
      }

      currentDate.setDate(currentDate.getDate() + 7); // Move to the next week
    }

    this.resetComponentState();
  }

  private getWeekInterval(): number {
    return parseInt(this.selectedWeek.split(' ')[0], 10) || 1; // Default to 1 if no repeat interval is selected
  }

  private createNewReservation() {
    return {
      date: this.selectedDay,
      startHour: this.selectedStartTime,
      endHour: this.selectedEndTime,
      comments: this.comment,
    };
  }

  private isReservationConflictFree(
    reservation: Omit<ReservationModel, 'user' | 'id'>
  ): boolean {
    return !this.reserveService.hasConflict(reservation);
  }

  private reservation(data: Omit<ReservationModel, 'user' | 'id'>): void {
    const newReservation: CreateReservationModel = {
      date: data.date,
      startHour: data.startHour,
      endHour: data.endHour,
      place: data.place,
      user: this.currentUser!,
      comments: data.comments,
      status:
        this.currentUser?.role === 'admin'
          ? ReservationStatus.APPROVED
          : ReservationStatus.PENDING,
    };
    this.store.dispatch(
      ReservationActions.addReservations({ reservation: newReservation })
    );
  }

  private handleReservationConflict(): void {
    this.utilService.snackBarError('Conflict detected! Reservation failed.');
    this.resetComponentState();
  }

  private resetComponentState(): void {
    this.selectedStartTime = '';
    this.selectedEndTime = '';
    this.comment = '';
    this.selectedWeek = '';
    this.updateAvailableHours();
  }

  private updateAvailableHours(): void {
    this.availableHours = [];

    // Loop through all selected places and get reserved hours for each
    this.selectedPlaces.forEach((place) => {
      const hours = this.reserveService.getHours(this.selectedDay, place);
      this.availableHours = [...this.availableHours, ...hours]; // Combine hours
    });

    this.availableHours = [...new Set(this.availableHours)]; // Removing duplicates
  }
}
