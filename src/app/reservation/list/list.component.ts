import { Component, OnInit, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { ReservationModel } from '../reservation.model';
import { ReservationService } from '../services/reservation.service';
import { TimeComponent } from '../time/time.component';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    MatTableModule,
    CommonModule,
    TimeComponent,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent implements OnInit {
  reservationService = inject(ReservationService);
  sharedService = inject(SharedService);
  subscription: Subscription[] = [];

  startHour = '';
  endHour = '';
  availableHours: string[] = [];
  partialReservedHours: string[] = [];
  dataSource: ReservationModel[] = [];
  displayedColumns: string[] = [
    'date',
    'startHour',
    'endHour',
    'place',
    'user',
    'actions',
  ];

  ngOnInit(): void {
    this.subscription.push(
      this.sharedService.selectedDay$.subscribe(() => {
        this.updateDataSource();
      })
    );

    this.subscription.push(
      this.sharedService.reservationMade$.subscribe(() => {
        this.updateDataSource();
      })
    );

    this.updateDataSource();
  }

  ngOnDestroy(): void {
    this.subscription.forEach((subscription) => subscription.unsubscribe());
  }

  updateDataSource(): void {
    const selectedDay = this.sharedService.getSelectedDay();
    if (selectedDay) {
      this.dataSource =
        this.reservationService.getAllHoursBySelectedDay(selectedDay);
    }
  }
  reject(reservation: ReservationModel): void {
    // Logic for rejecting reservation (for admins)
    console.log('Reject reservation', reservation);
  }

  approve(reservation: ReservationModel): void {
    // Logic for approving reservation (for admins)
    console.log('Approve reservation', reservation);
  }

  viewDetails(reservation: ReservationModel): void {
    // Logic for viewing details
    console.log('View details for', reservation);
  }

  edit(reservation: ReservationModel): void {
    // Logic for editing reservation
    console.log('Edit reservation', reservation);
  }

  delete(reservation: ReservationModel): void {
    // Logic for deleting reservation
    this.reservationService.deleteReservation(reservation.id);
    this.sharedService.notifyReservationMade();
    this.updateDataSource(); // Refresh the table after deletion
  }
}
