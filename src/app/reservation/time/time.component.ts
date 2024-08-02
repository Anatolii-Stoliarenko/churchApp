import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  SimpleChanges,
  inject,
} from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { ReservationService } from '../services/reservation.service';
import { ReservationModel, PlaceType } from '../reservation.model';
import { SharedService } from '../services/shared.service';
import { Subscription } from 'rxjs';

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
  selectedDay = '';
  rs = inject(ReservationService);
  sharedService = inject(SharedService);
  cdr = inject(ChangeDetectorRef);

  snackBar = inject(MatSnackBar);
  availableHours: string[] = [];
  selectedStartTime: string = '';
  selectedEndTime: string = '';
  selectedPlace: PlaceType = PlaceType.DUZA_KAPLICA;
  places = Object.values(PlaceType);
  subscription: Subscription[] = [];

  ngOnInit(): void {
    this.subscription.push(
      this.sharedService.selectedDay$.subscribe(() => {
        this.selectedDay = this.sharedService.getSelectedDay();
        this.updateDataSource();
      })
    );

    this.updateDataSource();
  }

  ngOnDestroy(): void {
    this.subscription.forEach((subscription) => subscription.unsubscribe());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedDay']) {
      this.updateDataSource();
    }
  }

  updateDataSource(): void {
    this.availableHours = this.rs.getHours(
      this.selectedDay,
      this.selectedPlace
    );
  }

  onPlaceChange() {
    this.updateDataSource();
  }

  resetComponentState(): void {
    this.selectedStartTime = '';
    this.selectedEndTime = '';
    this.updateDataSource();
  }

  reserve() {
    const newReservation: ReservationModel = {
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
    this.resetComponentState();
    this.sharedService.notifyReservationMade();
    this.rs.addReservation(newReservation);
    this.snackBar.open('Reservation saved successfully!', 'Close', {
      duration: 3000,
    });
    // this.cdr.detectChanges();
  }
}
