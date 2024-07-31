import { Component, Input, OnInit, SimpleChanges, inject } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { ReservationService } from '../services/reservation.service';
import { NewReservationModel, PlaceType } from '../reservation.model';

@Component({
  selector: 'app-time',
  standalone: true,
  imports: [
    MatSelectModule,
    MatButtonModule,
    CommonModule,
    FormsModule,
    MatSnackBarModule,
  ],
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.scss'],
})
export class TimeComponent implements OnInit {
  @Input() selectedDay: string = '';
  rs = inject(ReservationService);
  snackBar = inject(MatSnackBar);
  permitSelect = false;
  availableHours: string[] = [];
  selectedStartTime: string = '';
  selectedEndTime: string = '';
  selectedPlace: PlaceType = PlaceType.BALKON;
  places = Object.values(PlaceType);

  ngOnInit(): void {
    this.updateDataSource();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedDay']) {
      this.permitSelect = !!this.selectedDay;
      this.updateDataSource();
    }
  }

  updateDataSource(): void {
    this.availableHours = this.rs.getAvailableHoursNew(this.selectedDay);
  }

  reserve() {
    const newReservation: NewReservationModel = {
      id: 'new', // Generate or assign an ID appropriately
      date: this.selectedDay,
      startHour: this.selectedStartTime,
      endHour: this.selectedEndTime,
      place: this.selectedPlace, // Use the selected place
      user: {
        id: 'u1', // Example user ID, modify as needed
        name: 'Example User',
        email: 'example.user@example.com',
      },
    };
    this.rs.addReservation(newReservation);
    this.snackBar.open('Reservation saved successfully!', 'Close', {
      duration: 3000,
    });
  }
}
