import { Component, OnInit, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';

import { ReservationService } from '../reservation.service';
import { ReservationModel } from '../reservation.model';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [MatTableModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent implements OnInit {
  rs = inject(ReservationService);
  reservationData: ReservationModel[] = [];
  displayedColumns: string[] = ['Position', 'Date', 'Place', 'Hour'];

  ngOnInit(): void {
    this.reservationData = this.rs.reservations;
    console.log(this.reservationData);
  }
}
