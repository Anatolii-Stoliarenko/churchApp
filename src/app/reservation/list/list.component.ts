import { Component, OnInit, SimpleChanges, inject, input } from '@angular/core';
import { MatTableModule } from '@angular/material/table';

import { ReservationService } from '../reservation.service';
import { ReservationModel } from '../reservation.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [MatTableModule, CommonModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent implements OnInit {
  rs = inject(ReservationService);
  selectedDay = input<string>();

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
    this.dataSource = this.rs.reservations.filter((res) => {
      return this.selectedDay && res.date === this.selectedDay();
    });
  }
}
