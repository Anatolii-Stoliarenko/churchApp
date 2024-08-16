import {
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  inject,
} from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { ReservationService } from '../services/reservation.service';
import { PlaceType, UserModel } from '../reservation.model';
import { SharedService } from '../services/shared.service';
import { UtilsService } from '../services/utils.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-time',
  standalone: true,
  imports: [MatSelectModule, MatButtonModule, CommonModule, FormsModule],
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.scss'],
})
export class TimeComponent implements OnInit, OnDestroy, OnChanges {
  selectedDay = '';
  reserveService = inject(ReservationService);
  authService = inject(AuthService);
  utilService = inject(UtilsService);
  sharedService = inject(SharedService);
  router = inject(Router);

  availableHours: string[] = [];
  selectedStartTime: string = '';
  selectedEndTime: string = '';
  selectedPlace: PlaceType = PlaceType.DUZA_KAPLICA;
  places = Object.values(PlaceType);

  currentUser: UserModel | null = null;
  subscription: Subscription[] = [];

  ngOnInit(): void {
    this.initObservables();
    this.updateDataSource();

    this.subscription.push(
      this.authService.currentUser$.subscribe((user) => {
        this.currentUser = user;
        this.updateDataSource();
      })
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedDay']) {
      this.updateDataSource();
    }
  }

  ngOnDestroy(): void {
    this.subscription.forEach((subscription) => subscription.unsubscribe());
  }

  initObservables(): void {
    this.subscription.push(
      this.sharedService.selectedDay$.subscribe(() => {
        this.selectedDay = this.sharedService.getSelectedDay();
        this.updateDataSource();
      }),

      this.sharedService.reservationMade$.subscribe(() => {
        this.updateDataSource();
      })
    );
  }

  updateDataSource(): void {
    this.availableHours = this.reserveService.getHours(
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

  addReservation() {
    const newReservation = {
      date: this.selectedDay,
      startHour: this.selectedStartTime,
      endHour: this.selectedEndTime,
      place: this.selectedPlace,
    };
    if (!this.reserveService.hasConflict(newReservation)) {
      this.resetComponentState();
      this.reserveService.addReservation(newReservation);
      this.sharedService.notifyReservationMade();
      this.updateDataSource();
      // this.reloadComponent();
    } else {
      this.resetComponentState();
      this.utilService.snackBarError('Conflict detected! Reservation failed.');
    }
  }
}
