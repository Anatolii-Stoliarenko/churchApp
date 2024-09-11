import { Component, inject, signal } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatNativeDateModule } from '@angular/material/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { ListComponent } from '../list/list.component';
import {
  DaysReservationModel,
  ReservationModel,
} from '../../models/reservations.model';
import { ReservationService } from '../../services/reservation.service';
import { DetailsComponent } from '../details/details.component';
import { Store } from '@ngrx/store';
import { AppState } from '../../../shared/store/appState.interface';
import { currentUserSelector } from '../../../auth/store/auth.selectors';

@Component({
  selector: 'app-full-list',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    MatExpansionModule,
    ListComponent,
    MatDatepickerModule,
    MatFormFieldModule,
    FormsModule,
    CommonModule,
    MatNativeDateModule,
    MatSelectModule,
    MatIconModule,
    MatInputModule,
    DetailsComponent,
  ],

  templateUrl: './full-list.component.html',
  styleUrl: './full-list.component.scss',
})
export class FullListComponent {
  reservationService = inject(ReservationService);
  store = inject(Store<AppState>);
  currentUser$ = this.store.select(currentUserSelector);

  startDay: string = new Date().toISOString().split('T')[0];
  endDay: string = new Date().toISOString().split('T')[0];

  reservationsOfDays: DaysReservationModel[] = [];

  ngOnInit() {
    this.onEndDateChange();
  }

  onEndDateChange() {
    this.reservationsOfDays = this.reservationService.getReservationsFromToDays(
      this.startDay,
      this.endDay
    );
  }
}
