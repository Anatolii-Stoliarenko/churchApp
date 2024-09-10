import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';

import {
  BookingModel,
  PlaceType,
  ReservationType,
} from '../../models/reservations.model';
import { ReservationService } from '../../services/reservation.service';
import { BookingService } from '../../services/booking.service';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [
    MatSelectModule,
    MatButtonModule,
    CommonModule,
    FormsModule,
    MatInputModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatIconModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss',
})
export class BookingComponent {
  reserveService = inject(ReservationService);
  bookingService = inject(BookingService);

  @Input() mode: 'create' | 'edit' = 'create';
  @Input() selectedPlaces: PlaceType[] = [];
  @Input() comment: string = '';
  @Input() selectedStartTime: string = '';
  @Input() selectedEndTime: string = '';
  @Input() selectedDay: string = new Date().toISOString().split('T')[0];
  @Input() type: ReservationType = ReservationType.OTHER; // Holds the selected reservation type

  @Output() submitEvent = new EventEmitter<BookingModel>();

  reservationTypes = this.bookingService.getTypes();
  filteredToHours: string[] = [];
  repeat: string = '';
  places = this.bookingService.getPlaces();
  weekOptions: string[] = this.bookingService.getWeekOptions();
  possibleTimes: string[] = this.reserveService.getAllPossibleHours();

  hideSingleSelectionIndicator() {}

  onSubmit() {
    this.submitEvent.emit({
      startHour: this.selectedStartTime,
      endHour: this.selectedEndTime,
      places: this.selectedPlaces,
      comments: this.comment,
      repeat: this.repeat,
      type: this.type,
    });
  }

  onStartTime(selectedStartTime: string): void {
    this.filteredToHours = this.bookingService.getFilteredEndTimes(
      selectedStartTime,
      this.selectedDay,
      this.selectedPlaces,
      this.possibleTimes
    );
  }

  isHourAvailable(time: string): boolean {
    const availableHours = this.bookingService.getAvailableTimes(
      this.selectedDay,
      this.selectedPlaces
    );
    return availableHours.includes(time);
  }

  onPlaceChange(): void {
    this.selectedStartTime = '';
    this.selectedEndTime = '';
  }
}
