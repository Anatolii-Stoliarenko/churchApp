import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';

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
import { ReservationDetailDialogComponent } from '../reservation-detail-dialog/reservation-detail-dialog.component';
import { Store } from '@ngrx/store';
import { AppState } from '../../../shared/store/appState.interface';
import { currentUserSelector } from '../../../auth/store/selectors/auth.selectors';
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
  ],
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.scss'],
})
export class TimeComponent implements OnInit, OnDestroy {
  reserveService = inject(ReservationService);
  authService = inject(AuthService);
  utilService = inject(UtilsService);
  store = inject(Store<AppState>);

  // selectedPlaces: PlaceType[] = [];
  selectedDay = '';
  availableHours: string[] = [];
  allTemplateHours: string[] = this.reserveService.getAllTemplateHour();
  selectedStartTime: string = '';
  selectedEndTime: string = '';
  filteredToHours: string[] = [];
  selectedPlace: PlaceType = PlaceType.DUZA_KAPLICA;
  places = Object.values(PlaceType);
  comment = '';
  weekOptions = Array.from(
    { length: 12 },
    (_, i) => `${i + 1} week${i + 1 > 1 ? 's' : ''}`
  );
  selectedWeek: string = ''; // This will hold the selected value

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
      this.store.select(selectedDaySelector).subscribe((day) => {
        this.selectedDay = day ? day : '';
        this.resetComponentState();
      }),

      this.store.select(reservationsSelector).subscribe((day) => {
        this.resetComponentState();
      }),

      this.store.select(currentUserSelector).subscribe((user) => {
        this.currentUser = user;
        this.resetComponentState();
      })
    );

    this.updateAvailableHours();
  }

  openConfirmDialogDetails() {
    const confirmReservation = {
      ...this.createNewReservation(),
      status:
        this.currentUser?.role === UserRole.ADMIN
          ? ReservationStatus.APPROVED
          : ReservationStatus.PENDING,
      user: this.currentUser,
      repeat: this.selectedWeek,
      caller: 'reserve',
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
      // Get all available hours after the selected start time
      const startTimeIndex = this.allTemplateHours.indexOf(
        this.selectedStartTime
      );

      this.filteredToHours = this.allTemplateHours.slice(startTimeIndex + 1);

      // Get all reserved hours for the selected day and place
      const reservedHours = this.reserveService.getReservedHours(
        this.selectedDay,
        this.selectedPlace
      );

      if (reservedHours.length > 0) {
        // Find the first reserved hour that comes after the selected start time
        const nextReservedHourIndex = this.allTemplateHours.findIndex(
          (hour) =>
            reservedHours.includes(hour) &&
            this.allTemplateHours.indexOf(hour) > startTimeIndex
        );

        // If there is a reserved hour after the start time, limit the filteredToHours array
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

  async addReservation(): Promise<void> {
    const repeatInterval = this.getWeekInterval();
    let currentDate = new Date(this.selectedDay);

    for (let i = 0; i < repeatInterval; i++) {
      const newReservation: Omit<ReservationModel, 'user' | 'id'> = {
        ...this.createNewReservation(),
        date: currentDate.toISOString().split('T')[0],
      };

      if (this.isReservationConflictFree(newReservation)) {
        try {
          await this.reservation(newReservation); // Wait for each reservation to complete
        } catch (error) {
          this.utilService.snackBarError('Reservation failed.');
          console.error('Reservation error:', error);
          break; // Stop the loop if an error occurs
        }
      } else {
        this.handleReservationConflict();
        break; // Stop if there's a conflict
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
      place: this.selectedPlace,
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
    // this.reserveService.addReservations(reservation);
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
    this.availableHours = this.reserveService.getHours(
      this.selectedDay,
      this.selectedPlace
    );
  }
}
