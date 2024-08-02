import { Injectable, inject } from '@angular/core';

import { UtilsService } from './utils.service';
import { DataService } from './data.service';
import { PlaceType, ReservationModel, UserModel } from '../reservation.model';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  us = inject(UtilsService);
  ds = inject(DataService);
  private localStorageKey = 'reservation';

  constructor() {
    this.loadReservations();
  }

  private saveReservations() {
    localStorage.setItem(
      this.localStorageKey,
      JSON.stringify(this.ds.reservations)
    );
  }

  private loadReservations() {
    const data = localStorage.getItem(this.localStorageKey);
    if (data) {
      this.ds.reservations = JSON.parse(data);
    }
  }

  addReservation(reservations: ReservationModel) {
    this.ds.reservations.push(reservations);
    this.saveReservations();
  }

  getReservation() {
    return this.ds.reservations;
  }

  getfullDayHours(reservation: ReservationModel): boolean {
    // const fullDayHours = this.dataService.availableHours;
    // return fullDayHours.every((hour) => reservation.hours.includes(hour));
    return false;
  }

  getHours(
    date: string,
    place?: PlaceType,
    user?: UserModel,
    type: 'reserved' | 'available' = 'available'
  ): string[] {
    if (type === 'reserved') {
      return this.getReservedHours(date, place, user);
    } else {
      return this.getAvailableHours(date, place, user);
    }
  }

  getReservedHours(
    date: string,
    place?: PlaceType,
    user?: UserModel
  ): string[] {
    return this.ds.reservations
      .filter(
        (reservation) =>
          reservation.date === date &&
          reservation.place === place &&
          (!user || reservation.user.id === user.id)
      )
      .flatMap((reservation) =>
        this.us.getTimeRangeArray(reservation.startHour, reservation.endHour)
      );
  }

  getAvailableHours(
    date: string,
    place?: PlaceType,
    user?: UserModel
  ): string[] {
    const reservedHours = this.getReservedHours(date, place, user);
    return this.ds.availableHours.filter(
      (hour) => !reservedHours.includes(hour)
    );
  }

  getAllHoursBySelectedDay(selectedDay: string): ReservationModel[] {
    return this.ds.reservations.filter((res) => {
      return res.date === selectedDay;
    });
  }

  getAvailableHoursOld(date: string): string[] {
    return this.getHouresOld(date, true);
  }

  getReservedHoursOld(date: string): string[] {
    return this.getHouresOld(date, false);
  }

  getHouresOld(date: string, isAvailableHours: boolean): string[] {
    const reservedHours = this.ds.reservations
      .filter((res) => res.date === date)
      .map((res) => this.us.getTimeRangeArray(res.startHour, res.endHour))
      .flat();

    const allHours = this.ds.availableHours;

    return allHours.filter((hour) =>
      isAvailableHours
        ? !reservedHours.includes(hour)
        : reservedHours.includes(hour)
    );
  }
}
