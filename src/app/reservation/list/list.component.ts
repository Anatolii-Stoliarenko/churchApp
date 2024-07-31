import { Component, Input, OnInit, SimpleChanges, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';

import { ReservationModel } from '../reservation.model';
import { ReservationService } from '../services/reservation.service';
import { TimeComponent } from '../time/time.component';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [MatTableModule, CommonModule, TimeComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent implements OnInit {
  rs = inject(ReservationService);
  @Input() selectedDay: string = '';

  availableHours: string[] = [];
  partialReservedHours: string[] = [];
  dataSource: ReservationModel[] = [];
  displayedColumns: string[] = ['date', 'hours', 'place', 'user'];

  ngOnInit(): void {
    this.updateDataSource();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedDay']) {
      this.updateDataSource();
    }
  }

  updateDataSource(): void {
    this.dataSource = this.rs.getSelectedDateHours(this.selectedDay);
    if (this.selectedDay) {
      this.availableHours = this.rs.getAvailableHours(this.selectedDay);
      this.partialReservedHours = this.rs.getPartialReservedHours(
        this.selectedDay
      );
    }
  }
}
