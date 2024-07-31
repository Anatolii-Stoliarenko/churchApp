import { Injectable, inject } from '@angular/core';

import { UtilsService } from './utils.service';
import { DataService } from './data.service';
import { NewReservationModel, ReservationModel } from '../reservation.model';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  utilsService = inject(UtilsService);
  dataService = inject(DataService);

  // new version

  addReservation(reservations: NewReservationModel) {
    this.dataService.NewReservations.push(reservations);
  }

  getfullDayHours(reservation: ReservationModel): boolean {
    // const fullDayHours = this.dataService.availableHours;
    // return fullDayHours.every((hour) => reservation.hours.includes(hour));
    return false;
  }

  getAllReservation() {
    return this.dataService.NewReservations;
  }

  getSelectedDateHoursNew(selectedDay: string): NewReservationModel[] {
    return this.dataService.NewReservations.filter((res) => {
      return res.date === selectedDay;
    });
  }

  getHoures(date: string, availableHours: boolean): string[] {
    const reservedHours = this.dataService.NewReservations.filter(
      (res) => res.date === date
    )
      .map((res) =>
        this.utilsService.getTimeRangeArray(res.startHour, res.endHour)
      )
      .flat();

    const allHours = this.dataService.NewAvailableHours;

    return allHours.filter((hour) =>
      availableHours
        ? !reservedHours.includes(hour)
        : reservedHours.includes(hour)
    );
  }

  getAvailableHoursNew(date: string): string[] {
    return this.getHoures(date, true);
  }

  getPartialReservedHoursNew(date: string): string[] {
    return this.getHoures(date, false);
  }

  //old version

  getAvailableHoursSplit(date: string): string[] {
    const reservedHours = this.dataService.reservations
      .filter((res) => res.date === date)
      .flatMap((res) => res.hours);
    const available = this.dataService.availableHours.filter(
      (hour) => !reservedHours.includes(hour)
    );
    reservedHours.sort();
    return available;
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
