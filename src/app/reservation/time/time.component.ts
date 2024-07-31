import { Component, Input, OnInit, SimpleChanges, inject } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ReservationModel } from '../reservation.model';
import { ReservationService } from '../services/reservation.service';

@Component({
  selector: 'app-time',
  standalone: true,
  imports: [MatSelectModule, MatButtonModule, CommonModule, FormsModule],
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.scss'],
})
export class TimeComponent implements OnInit {
  @Input() selectedDay: string = '';
  rs = inject(ReservationService);
  permitSelect = false;
  dataSource: ReservationModel[] = [];
  availableHours: string[] = [];
  selectedStartTime: string = '';
  selectedEndTime: string = '';

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
    if (this.selectedDay) {
      this.availableHours = this.rs.getAvailableHoursSplit(this.selectedDay);
    }
  }

  reserve() {
    if (this.selectedStartTime && this.selectedEndTime) {
      console.log(
        'Reservation from',
        this.selectedStartTime,
        'to',
        this.selectedEndTime
      );
      // Add reservation logic here
    } else {
      alert('Please select both start and end times.');
    }
  }
}
