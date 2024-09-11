import { Component, Input, SimpleChanges, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSort, MatSortModule } from '@angular/material/sort';
import {
  ReservationModel,
  ReservationStatus,
} from '../../models/reservations.model';

import { DetailsComponent } from '../details/details.component';
import { CurrentUserInterface } from '../../../auth/models/auth.model';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    MatTableModule,
    CommonModule,
    MatIconModule,
    MatCardModule,
    MatSortModule,
    MatSort,
    DetailsComponent,
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent {
  @Input() reservation: ReservationModel[] = [];
  @Input() currentUser: CurrentUserInterface | null = null;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  dataSource: MatTableDataSource<ReservationModel>;
  selectedRow: ReservationModel | null = null;

  displayedColumns: string[] = [
    'type',
    'startHour',
    'endHour',
    'place',
    'comment',
  ];

  constructor() {
    this.dataSource = new MatTableDataSource<ReservationModel>([]);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['reservation'] && changes['reservation'].currentValue) {
      this.dataSource.data = this.reservation; // Update the table data
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  selectRow(row: ReservationModel) {
    if (this.selectedRow === row) {
      this.selectedRow = null;
    } else {
      this.selectedRow = row;
    }
  }

  getRowClass(reservation: ReservationModel): string {
    if (this.selectedRow === reservation) {
      return 'selected-row'; // Apply selected row class
    }
    if (!reservation.status) {
      return '';
    }
    switch (reservation.status) {
      case ReservationStatus.APPROVED:
        return 'approved-row';
      case ReservationStatus.PENDING:
        return 'pending-row';
      default:
        return '';
    }
  }

  closeDetails() {
    this.selectedRow = null;
  }
}
