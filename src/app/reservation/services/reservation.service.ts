import { Injectable, inject } from '@angular/core';

import { UtilsService } from './utils.service';
import { DataService } from './data.service';
import { ReservationModel } from '../reservation.model';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  utilsService = inject(UtilsService);
  dataService = inject(DataService);

  addReservation(reservations: ReservationModel) {
    this.dataService.reservations.push(reservations);
  }

  getfullDayHours(reservation: ReservationModel): boolean {
    const fullDayHours = this.dataService.availableHours;
    return fullDayHours.every((hour) => reservation.hours.includes(hour));
  }

  getAvailableHours(date: string): string[] {
    const reservedHours = this.dataService.reservations
      .filter((res) => res.date === date)
      .flatMap((res) => res.hours);
    const available = this.dataService.availableHours.filter(
      (hour) => !reservedHours.includes(hour)
    );
    reservedHours.sort();
    return this.utilsService.mergeTimeSlots(available);
  }

  getPartialReservedHours(date: string): string[] {
    const reservedHours = this.dataService.reservations
      .filter((res) => res.date === date)
      .flatMap((res) => res.hours);
    reservedHours.sort();
    return this.utilsService.mergeTimeSlots(reservedHours);
  }

  getSelectedDateHours(selectedDay: string): ReservationModel[] {
    return this.dataService.reservations.filter((res) => {
      return res.date === selectedDay;
    });
  }

  getReservation(): ReservationModel[] {
    return this.dataService.reservations;
  }
}
