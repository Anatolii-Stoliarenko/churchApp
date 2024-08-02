import { ApplicationRef, Component, OnInit, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { ReservationModel } from '../reservation.model';
import { ReservationService } from '../services/reservation.service';
import { TimeComponent } from '../time/time.component';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [MatTableModule, CommonModule, TimeComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent implements OnInit {
  rs = inject(ReservationService);
  sharedService = inject(SharedService);
  private subscription: Subscription[] = [];
  appRef = inject(ApplicationRef);

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
  ];

  ngOnInit(): void {
    this.subscription.push(
      this.sharedService.selectedDay$.subscribe(() => {
        this.updateDataSource();
      })
    );

    this.subscription.push(
      this.sharedService.reservationMade$.subscribe(() => {
        console.log('must be refresh');
        this.appRef.tick(); // Ensure Angular's change detection is triggered
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
      this.dataSource = this.rs.getAllHoursBySelectedDay(selectedDay);
    }
  }
}
