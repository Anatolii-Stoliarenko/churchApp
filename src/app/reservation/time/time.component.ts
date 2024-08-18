import {
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  inject,
} from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { ReservationService } from '../services/reservation.service';
import {
  PlaceType,
  ReservationModel,
  TimeSlot,
  UserModel,
} from '../reservation.model';
import { SharedService } from '../services/shared.service';
import { UtilsService } from '../services/utils.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-time',
  standalone: true,
  imports: [MatSelectModule, MatButtonModule, CommonModule, FormsModule],
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.scss'],
})
export class TimeComponent implements OnInit, OnDestroy {
  reserveService = inject(ReservationService);
  authService = inject(AuthService);
  utilService = inject(UtilsService);
  sharedService = inject(SharedService);

  selectedDay = '';
  availableHours: string[] = [];
  allTemplateHours: string[] = this.reserveService.getAllTemplateHour();
  selectedStartTime: string = '';
  selectedEndTime: string = '';
  filteredToHours: string[] = [];
  selectedPlace: PlaceType = PlaceType.DUZA_KAPLICA;
  places = Object.values(PlaceType);

  currentUser: UserModel | null = null;
  subscription: Subscription[] = [];

  ngOnInit(): void {
    this.initObservables();
    this.updateAvailableHours();
  }

  ngOnDestroy(): void {
    this.subscription.forEach((subscription) => subscription.unsubscribe());
  }

  initObservables(): void {
    this.subscription.push(
      this.sharedService.selectedDay$.subscribe(() => {
        this.selectedDay = this.sharedService.getSelectedDay();
        this.updateAvailableHours();
      }),

      this.sharedService.reservationMade$.subscribe(() => {
        this.updateAvailableHours();
      }),

      this.authService.currentUser$.subscribe((user) => {
        this.currentUser = user;
        this.updateAvailableHours();
      })
    );
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

  updateAvailableHours(): void {
    this.availableHours = this.reserveService.getHours(
      this.selectedDay,
      this.selectedPlace
    );
  }

  isHourAvailable(time: string): boolean {
    return this.availableHours.includes(time);
  }

  onPlaceChange() {
    this.updateAvailableHours();
    this.resetComponentState();
  }

  resetComponentState(): void {
    this.selectedStartTime = '';
    this.selectedEndTime = '';
    this.updateAvailableHours();
  }

  createNewReservation() {
    const newReservation = {
      date: this.selectedDay,
      startHour: this.selectedStartTime,
      endHour: this.selectedEndTime,
      place: this.selectedPlace,
    };

    return newReservation;
  }

  addReservation(): void {
    const newReservation = this.createNewReservation();

    if (this.isReservationConflictFree(newReservation)) {
      this.reservation(newReservation);
    } else {
      this.handleReservationConflict();
    }
  }

  private isReservationConflictFree(
    reservation: Omit<ReservationModel, 'user' | 'id'>
  ): boolean {
    return !this.reserveService.hasConflict(reservation);
  }

  private reservation(
    reservation: Omit<ReservationModel, 'user' | 'id'>
  ): void {
    this.reserveService.addReservation(reservation);
    this.utilService.snackBarSuccess('Reservation created successfully!');
    this.resetComponentState();
    this.sharedService.notifyReservationMade();
    this.updateAvailableHours();
  }

  private handleReservationConflict(): void {
    this.utilService.snackBarError('Conflict detected! Reservation failed.');
    this.resetComponentState();
  }
}
